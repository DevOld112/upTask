import type { Request, Response } from 'express'
import Project from '../models/Project'
import Task from '../models/Task'

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)

            await Promise.allSettled([task.save(), req.project.save()])

            res.status(200).json(task)
        } catch (error) {
            console.log(error)
        }
    }

    static getAllTaskByProject = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.status(200).json(tasks)

        } catch (error) {
            res.status(500).json({error: 'Hubo un error en la obtencion de las tareas'})
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const { projectId, taskId } = req.params;
            const task = await Task.findById(taskId).populate('project')

            //Valido que la tarea Existe

            if(!task){
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: error.message})
            }

            //Valido que la tarea pertenece a ese proyecto

            if(task.project.toString() !== req.project.id){
                const error = new Error('Accion no valida')
                return res.status(404).json({error: error.message})
            }

            return res.status(200).json(task)

        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Hubo un error en la obtencion de la tarea'})
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            const task = await Task.findById(taskId)
            

            //Valido que la tarea Existe

            if(!task){
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: error.message})
            }

            //Valido que la tarea pertenece a ese proyecto

            

            if(task.project.toString() !== req.project.id){
                const error = new Error('Accion no valida')
                return res.status(404).json({error: error.message})
            }

            task.name = req.body.name
            task.description = req.body.description

            await task.save()

            return res.status(200).send('Tarea Actualizada Correctamente')

        } catch (error) {
            res.status(500).json({error: 'Hubo un error en la obtencion de la tarea'})
        }
    }

    static deleteTask = async(req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            const task = await Task.findById(taskId, req.body)

            //Valido que la tarea Existe

            if(!task){
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: error.message})
            }

            //Valido que la tarea pertenece a ese proyecto

            if(task.project.toString() !== req.project.id){
                const error = new Error('Accion no valida')
                return res.status(404).json({error: error.message})
            }

            req.project.tasks = req.project.tasks.filter(task => task._id.toString() !== taskId)

            await Promise.allSettled([task.deleteOne(), req.project.save()])
            
            return res.status(200).send('Tarea Eliminada')

        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Hubo un error en la obtencion de la tarea'})
        }
    }
}