import * as express from 'express'
import AuthControlers from '../controllers/AuthControlers';
import AuthMiddlewares from '../middlewares/Auth'
import Auth from '../middlewares/Auth';
import threadController from '../controllers/threadController';
import uploadImage from '../middlewares/multer';
import UserController from '../controllers/UserController';
import ReplyService from '../services/ReplyService';
import ReplyController from '../controllers/ReplyController';
import { Like } from 'typeorm';
import LikeController from '../controllers/LikeController';
import FollowController from '../controllers/FollowController';

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

// Like
router.post("/like/thread", AuthMiddlewares.Auth, LikeController.likeThread)
router.delete("/unlike/thread", AuthMiddlewares.Auth, LikeController.unlikeThread)
router.post("/like/reply", AuthMiddlewares.Auth, LikeController.likeReply)
router.delete("/unlike/reply", AuthMiddlewares.Auth, LikeController.unlikeReply)

// follows
router.post("/follow", AuthMiddlewares.Auth, FollowController.follow)
router.get("/follow/:id", FollowController.getFollow)
router.delete("/unfollow", AuthMiddlewares.Auth, FollowController.unFollow)








export default router;