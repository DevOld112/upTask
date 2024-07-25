import { Router } from 'express'


const router = Router();

router.get('/', (req, res) => {
    res.send('El pana mas pana del mundo')
})


export default router;