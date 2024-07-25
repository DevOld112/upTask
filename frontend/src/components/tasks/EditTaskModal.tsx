import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EditTaskForm from './EditTaskForm';
import { Task, TaskFormData } from '@/types/index';
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from 'react-toastify'
import { editTask } from "@/api/TaskAPI";




export default function editTaskModal() {

    //Mostrar Modal de Agregar Tarea

    const location = useLocation()
    const queryParam = new URLSearchParams(location.search)
    const modalTask = queryParam.get('editTask')
    const showEditModal:boolean = modalTask ? true : false
    const navigate = useNavigate()


    const params = useParams()
    
    const projectId = params.projectId!
    const taskId: Task['_id'] = modalTask ? modalTask : ''


    const initialValues : TaskFormData = {
        name: '',
        description: ''
    }

    const {register, handleSubmit, reset, formState: {errors} } = useForm({defaultValues: initialValues})

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: editTask,
        onError: (error) => {
            
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            reset()
            navigate(location.pathname, {replace: true})
        }
    })

    const handleEditTask = (formData : TaskFormData) => {
        const data = {
            formData,
            projectId,
            taskId
        }

        

        mutation.mutate(data)
        
    }


    return (
        <>
            <Transition appear show={showEditModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl  my-5"
                                    >
                                        Editar Tarea
                                    </Dialog.Title>

                                    <p className="text-xl font-bold">Llena el formulario y Modifica {''}
                                        <span className="text-fuchsia-600">La tarea</span>
                                    </p>

                                    <form
                                    onSubmit={handleSubmit(handleEditTask)}
                                    noValidate
                                    >


                                        <EditTaskForm
                                            register={register}
                                            errors={errors}
                                        />

                                        <input
                                            type="submit"
                                            value="Guardar Cambios"
                                            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                                        />
                                    </form>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}