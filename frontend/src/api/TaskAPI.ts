import { Project, Task, TaskFormData, taskSchema } from "@/types/index";
import api from "../lib/axios"
import { isAxiosError } from "axios"

export type TaskAPI = {
    formData: TaskFormData,
    projectId: Project['_id'],
    taskId: Task['_id'],
    status: Task['status']
}



export async function createTask({formData, projectId} : Pick<TaskAPI, 'formData' | 'projectId'>) {
    
    try {
        const url = `/projects/${projectId}/tasks`
        console.log(url)
        const { data } = await api.post<string>(url, formData)

        console.log(data)

        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function editTask({formData, projectId, taskId} : Pick<TaskAPI, 'formData' | 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        
        const { data } = await api.put<string>(url, formData)

        console.log(data)

        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteTask({ projectId, taskId } : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        
        const { data } = await api.delete<string>(url)

        
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getTasksByProject(projectId: Pick<TaskAPI, 'projectId'>) {
    try {
        const url = `/projects/${projectId}/tasks`

        const { data } = await api.get(url)

        return data

    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getTaskById({ projectId, taskId } : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`

        const { data } = await api.get<string>(url)

        const response = taskSchema.safeParse(data)

        if(response.success){
            return response.data as Task | String
        }

        return data as String

    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateStatus({status, projectId, taskId } : Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/status`
        
        const { data } = await api.post<string>(url, {status})

        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}




