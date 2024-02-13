import * as express from 'express'
import AuthControlers from '../controllers/AuthControlers';


const router = express.Router();

router.post("/auth/register", AuthControlers.register)


export default router;