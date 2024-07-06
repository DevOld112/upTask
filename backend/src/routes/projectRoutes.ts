import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/projectControllers'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/taskControllers'

const router = Router()

router.post('/',

    body('projectName')
        .notEmpty().withMessage('El Nombre del proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('Agregar Descripcion es Obligatorio'),
    handleInputErrors,
    ProjectController.createProject

)

router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('ID no Valido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id', 
    param('id').isMongoId().withMessage('ID no Valido'),
    body('projectName')
        .notEmpty().withMessage('El Nombre del proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('Agregar Descripcion es Obligatorio'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:id', 
    param('id').isMongoId().withMessage('ID no Valido'),
    handleInputErrors,
    ProjectController.deleteProject
)

/* Rutas para las Tareas || Explicacion: como las tareas van a estar dentro de los proyectos, hay que incluilas en el mismo archivo de rutas padre */

router.post('/:projectId/tasks',

    TaskController.createProject


)



export default router;