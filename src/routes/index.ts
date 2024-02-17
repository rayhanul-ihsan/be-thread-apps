import * as express from 'express'
import AuthControlers from '../controllers/AuthControlers';
import AuthMiddlewares from '../middlewares/Auth'
import Auth from '../middlewares/Auth';

const router = express.Router();
// Auth
router.post("/auth/register", AuthControlers.register)
router.post("/auth/login", AuthControlers.login)
router.get("/auth/check",AuthMiddlewares.Auth, AuthControlers.check)


export default router;