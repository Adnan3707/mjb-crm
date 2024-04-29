import express from 'express';
import * as userController from '../controller/userController';
import { validateCreateUser,loginValidator } from '../validations/userValidations';
import * as auth from "../helper/jwt";

const userRouter = express.Router();

userRouter.post('/user/signUp',validateCreateUser,userController.signUpUser)
userRouter.get('/user/:email_id',auth.verifyjwt,userController.getUser)
userRouter.post("/user/login", loginValidator, userController.login);
userRouter.put('/user/:user_id',auth.verifyjwt,userController.updateUser);
userRouter.put('/user/update_password/:user_id',auth.verifyjwt, userController.changePassword);
userRouter.get('/user/reset_password/request_otp/:email_id', userController.request_reset_password);
userRouter.get('/user/reset_password/verify_otp/:email_id/:otp', userController.verifyOtp);
userRouter.put('/user/forgot_password/:email_id', userController.forgotPassword);
userRouter.put('/user/logout/:user_id', userController.logoutUser);
userRouter.get('/user/getAll/users',userController.getAllUsers);


export default userRouter;