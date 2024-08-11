import type { Request, RequestParamHandler, Response } from "express"
import User from "../models/User"

import { checkPassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import Token from "../models/Token"
import { AuthEmail } from "../emails/AuthEmail"

export class AuthController {
    

    static createAccount = async(req : Request, res: Response)=> {

        try {
            const { password, email } = req.body
            const user = new User(req.body)

            //Prevenir Duplicados

            const userExist = await User.findOne({email: email})

            if(userExist){
                const error = new Error('El usuario esta registrado')
                return res.status(409).json({error: error.message})
            }

            //Hashear Password

            user.password = await hashPassword(password)

            //Generar Token

            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.email,
                token: token.token
            })


            await Promise.allSettled([user.save(), token.save()])

            res.send('Usuario Creado Correctamente, se envio un mensaje a tu correo')
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async(req: Request, res: Response) => {

        try {
            const {token} = req.body

            const tokenExist = await Token.findOne({token})

            if(!tokenExist){
                const error = new Error('Token No Valido')
                return res.status(401).json({error: error.message})
            }

            const user = await User.findById(tokenExist.user)
            
            user.confirmed = true
            
            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            res.status(200).send('Cuenta Confirmada Correctamente')

        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static login = async(req: Request, res: Response) => {
        try {

            const { email, password } = req.body

            const user = await User.findOne({email: email})

            //Valido que el usuario exista

            if(!user){
                const error = new Error('Usuario NO Registrado')
                return res.status(404).json({error: error.message})
            }

            //Valido que la cuenta este confirmada

            if(!user.confirmed){

                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.email,
                token: token.token
            })

                const error = new Error('Por favor confirme su Cuenta, hemos enviado un email de confirmacion')
                return res.status(401).json({error: error.message})
            }

            //Revisar Password

            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect){
                const error = new Error('Contraseña Invalida')
                return res.status(401).json({error: error.message})
            }

            return res.send('Sesion Iniciada Correctamente')
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static requestConfirmationCode = async(req: Request, res: Response) => {
        try {

            const { email } = req.body

            const user = await User.findOne({email: email})

            //Valido que el usuario exista

            if(!user){
                const error = new Error('Usuario NO Registrado')
                return res.status(409).json({error: error.message})
            }

            //Valido que la cuenta este confirmada

            if(!user.confirmed){

                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.email,
                token: token.token
            })


            return res.send('Codigo enviado a su bandeja de Correo Electronico')
            } else {
                const error = new Error('El Usuario ya esta confirmado')
                return res.status(403).json({error: error.message})
            }

        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static forgotPassword = async(req: Request, res: Response) => {
        try {

            const { email } = req.body

            const user = await User.findOne({email: email})

            //Valido que el usuario exista

            if(!user){
                const error = new Error('Usuario NO Registrado')
                return res.status(409).json({error: error.message})
            }
            

                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

            //Enviar Email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.email,
                token: token.token
            })


            return res.send('Codigo enviado a su bandeja de Correo Electronico')


        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }


    static validateToken = async(req: Request, res: Response) => {

        try {
            const {token} = req.body

            const tokenExist = await Token.findOne({token})

            if(!tokenExist){
                const error = new Error('Token No Valido')
                return res.status(404).json({error: error.message})
            }

            return res.status(200).send('Token valido, define tu nuevo Password')

        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }


    static resetPassword = async(req: Request, res: Response) => {

        try {
            const {token} = req.params
            const { password } = req.body

            const tokenExist = await Token.findOne({token})

            if(!tokenExist){
                const error = new Error('Token No Valido')
                return res.status(404).json({error: error.message})
            }

            const user = await User.findById(tokenExist.user)

            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            res.status(200).send('El password se modifico correctamente')

        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
        
    }
}