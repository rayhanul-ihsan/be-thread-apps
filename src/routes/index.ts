import * as express from 'express'
import uploadImage from '../middlewares/multer'
import AuthMiddlewares from '../middlewares/Auth'
import AuthControlers from '../controllers/AuthControlers';
import UserController from '../controllers/UserController';
import LikeController from '../controllers/LikeController';
import ReplyController from '../controllers/ReplyController';
import threadController from '../controllers/threadController';
import FollowController from '../controllers/FollowController'; 

const router = express.Router();
// Auth
router.post("/auth/login", AuthControlers.login)
router.post("/auth/register", AuthControlers.register)
router.get("/auth/check", AuthMiddlewares.Auth, AuthControlers.check)
 
// Threads 
router.get("/thread", threadController.getThreads)
router.get("/thread/:id", threadController.getThread)
router.post("/thread",AuthMiddlewares.Auth, uploadImage.upload('image'), threadController.createThread)
router.patch("/thread/:id",AuthMiddlewares.Auth, uploadImage.upload('image'), threadController.updateThread)
router.delete("/thread/:id",AuthMiddlewares.Auth, threadController.deleteThread)

// Users
router.get("/users", UserController.all)
router.get("/user/:id", UserController.findOne)
router.get("/user/me/current", AuthMiddlewares.Auth, UserController.getCurrent)
router.patch("/user/:id", AuthMiddlewares.Auth, uploadImage.upload('profile_picture'), UserController.update)
router.patch("/upload/picture/:id", AuthMiddlewares.Auth, uploadImage.upload("profile_picture"), UserController.uploadPicture)
router.delete("/user/:id", UserController.delete)

//Replies
router.get("/reply/:id", ReplyController.ReplyThread)
router.post("/reply/thread",AuthMiddlewares.Auth, uploadImage.upload('image'), ReplyController.ReplyThread)
router.delete("/reply/:id",AuthMiddlewares.Auth, ReplyController.DeleteReply)

// Like
router.post("/like/reply", AuthMiddlewares.Auth, LikeController.likeReply)
router.post("/like/thread", AuthMiddlewares.Auth, LikeController.likeThread)
// router.delete("/unlike/reply", AuthMiddlewares.Auth, LikeController.unlikeReply)
// router.delete("/unlike/thread", AuthMiddlewares.Auth, LikeController.unlikeThread)

// follows
router.post("/follow", AuthMiddlewares.Auth, FollowController.follow)
router.get("/follow", AuthMiddlewares.Auth ,FollowController.getFollows)
router.delete("/unfollow", AuthMiddlewares.Auth, FollowController.unFollow)








export default router;