import * as express from 'express'
import AuthControlers from '../controllers/AuthControlers';
import AuthMiddlewares from '../middlewares/Auth'
import Auth from '../middlewares/Auth';
import threadController from '../controllers/threadController';
import uploadImage from '../middlewares/multer';

const router = express.Router();
// Auth
router.post("/auth/register", AuthControlers.register)
router.post("/auth/login", AuthControlers.login)
router.get("/auth/check",AuthMiddlewares.Auth, AuthControlers.check)

router.get("/thread", threadController.getThreads)
router.post("/thread",AuthMiddlewares.Auth, uploadImage.upload('image'), threadController.createThread)




export default router;