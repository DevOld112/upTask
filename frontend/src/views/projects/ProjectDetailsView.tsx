import { useParams, Navigate, useNavigate } from "react-router-dom"
import {  useQuery } from "@tanstack/react-query"
import {  getProjectById } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import EditTaskModal from "@/components/tasks/EditTaskModal"
import TaskList from "@/components/tasks/TaskList"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"

export default function ProjectDetailsView() {

    const navigate = useNavigate()

    const params = useParams()
    const projectId = params.projectId!

    const { data, isLoading, isError }  = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })




    if(isLoading) return 'Cargando...'
    if(isError) return <Navigate to='/404' />
    if(data) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

            <nav>
                <button
                    type="button"
                    className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors mt-5 rounded-md "
                    onClick={() => navigate('?newTask=true')}
                >
                    Agregar Tarea
                </button>
            </nav>

            <TaskList
                tasks={data.tasks}
            />

            <AddTaskModal />
            <EditTaskModal />
            <TaskModalDetails />
        </>
    )

}
