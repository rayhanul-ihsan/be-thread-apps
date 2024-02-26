import * as express from 'express'
import AuthControlers from '../controllers/AuthControlers';
import AuthMiddlewares from '../middlewares/Auth'
import Auth from '../middlewares/Auth';
import threadController from '../controllers/threadController';
import uploadImage from '../middlewares/multer';
import UserController from '../controllers/UserController';
import ReplyService from '../services/ReplyService';
import ReplyController from '../controllers/ReplyController';

const router = express.Router();
// Auth
router.post("/auth/register", AuthControlers.register)
router.post("/auth/login", AuthControlers.login)
router.get("/auth/check",AuthMiddlewares.Auth, AuthControlers.check)

// Threads
router.get("/thread", threadController.getThreads)
router.post("/thread",AuthMiddlewares.Auth, uploadImage.upload('image'), threadController.createThread)
router.put("/thread/:id",AuthMiddlewares.Auth, uploadImage.upload('image'), threadController.updateThread)
router.delete("/thread/:id",AuthMiddlewares.Auth, threadController.deleteThread)

// Users
router.get("/users", UserController.all)
router.post("/user/:id", UserController.findOne)
router.put("/user/:id", UserController.update)

//Replies
router.post("/reply/thread",AuthMiddlewares.Auth, uploadImage.upload('image'), ReplyController.ReplyThread)
router.delete("/reply/:id",AuthMiddlewares.Auth, ReplyController.DeleteReply)





export default router;