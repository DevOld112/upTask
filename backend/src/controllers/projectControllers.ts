import type, {Request, Response} from 'express'
import Project from '../models/Project'

export class ProjectController {

    //Obteniendo Todos los Proyectos

    static getAllProjects = async (req: Request, res: Response) => {

        try {
            const projects = await Project.find({})
            res.status(200).json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    //Creando Proyecto

    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body)
        try {
            await project.save()
            res.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    //Obteniendo un proyecto por su ID


    static getProjectById = async (req: Request, res: Response) => {

        try {
            const { id } = req.params
            const project = await Project.findById(id).populate("tasks")

            if(!project){
                const error = new Error('Proyecto No Encontrado')
                return res.status(404).json({error: error.message})
            }

            res.status(200).json(project)
        } catch (error) {
            console.log(error)
        }
    }

    //Actualizar un Proyecto

    
    static updateProject = async (req: Request, res: Response) => {

        try {
            const { id } = req.params
            const project = await Project.findByIdAndUpdate(id, req.body)

            if(!project){
                const error = new Error('Proyecto No Encontrado')
                return res.status(404).json({error: error.message})
            }

            await project.save()

            res.status(200).send('Proyecto Actualizado')
        } catch (error) {
            console.log(error)
        }
    }

    //Eliminando Un Proyecto

    static deleteProject = async (req: Request, res: Response) => {

        try {
            const { id } = req.params
            const project = await Project.findById(id)

            
            if(!project){
                const error = new Error('Proyecto No Encontrado')
                return res.status(404).json({error: error.message})
            }

            await project.deleteOne();

            res.status(200).send('Proyecto Eliminado')
        } catch (error) {
            console.log(error)
        }
    }
}