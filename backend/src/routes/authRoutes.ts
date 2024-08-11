import { Router } from 'express'
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/authController';
import { handleInputErrors } from '../middleware/validation';


const router = Router();

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El Nombre no puede ir vacio'),
    body('email')
        .isEmail().withMessage('El Email no puede ir vacio o es muy'),
    body('password_confirmation')
        .custom((value, {req}) => {
            
            if(req.body.password !== value){
                throw new Error('Los Password NO son Iguales')
            }
            return true
        }),
    body('password')
        .isLength({min:8}).withMessage('La Contraseña no puede ir vacia'),

    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El Token no puede ir vacio'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('El campo de correo se Encuentra vacio'),
    body('password')
    .isLength({min:8}).withMessage('La Contraseña no puede ir vacia'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('El campo de correo se Encuentra vacio'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('El campo de correo se Encuentra vacio'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El Token no puede ir vacio'),
    handleInputErrors,
    AuthController.validateToken

)

router.post('/reset-password/:token',
    param('token')
        .isNumeric().withMessage('Token No Valido'),
    body('password_confirmation')
        .custom((value, {req}) => {
        
        if(req.body.password !== value){
            throw new Error('Los Password NO son Iguales')
        }
        return true
    }),
    body('password')
        .isLength({min:8}).withMessage('La Contraseña no puede ir vacia'),
    handleInputErrors,
    AuthController.resetPassword
)


export default router;