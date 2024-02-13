import * as express from 'express'
import AuthControlers from '../controllers/AuthControlers';


const router = express.Router();

router.post("/auth/register", AuthControlers.register)
router.post("/auth/login", AuthControlers.login)


export default router;