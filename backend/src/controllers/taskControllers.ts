import type { Request, Response } from 'express'
import Task from '../models/Task'

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)

            await Promise.allSettled([task.save(), req.project.save()])

            res.status(200).send('Tarea Creada Correctamente')
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
            const { taskId } = req.params
            const task = await Task.findById(taskId)

            res.status(200).json(task)

        } catch (error) {
            console.log(error)
            res.status(500).send('Hubo un error en la obtencion de la tarea')
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description

            await req.task.save()

            return res.status(200).send('Tarea Actualizada Correctamente')

        } catch (error) {
            res.status(500).json({error: 'Hubo un error en la obtencion de la tarea'})
        }
    }

    static deleteTask = async(req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task._id.toString() !== req.task.id.toString())

            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            
            return res.status(200).send('Tarea Eliminada')

        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Hubo un error en la obtencion de la tarea'})
        }
    }

    static updateStatus = async(req: Request, res: Response) => {
        try {
            const { status } = req.body
            
            req.task.status = status
            await req.task.save()

            res.status(200).send('Status Actualizado')



        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }
}