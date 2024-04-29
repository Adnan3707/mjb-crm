import { NextFunction, Request, Response } from 'express';
import * as userService from '../service/userService';
import HttpStatus from '../constant/httpStatus';
import ApiResponse from '../handler/response';
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from '../constant/messages/user';
import { CustomError } from "../handler/error";
import * as loginService from '../service/loginService';
import { validationResult } from 'express-validator/src';



async function signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await userService.createUser({...req.body, created_by: req.headers["x-user-id"] });
        res.status(HttpStatus.OK).json(new ApiResponse(true, user, null, SUCCESS_MESSAGE.USER_CREATED));
    } catch (error : any) {
      if (error.message === ERROR_MESSAGE.DUPLICATE_EMAIL) {
        res.status(400).json({ error: ERROR_MESSAGE.DUPLICATE_EMAIL });
    } else {
        next(error);
    }
}
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const user = await loginService.login(req.body);
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(true, user, null, SUCCESS_MESSAGE.LOGIN_SUCCESSFUL)
        );
      return;
    }
    throw new CustomError(
      errors.array({ onlyFirstError: true })[0].msg,
      HttpStatus.BAD_REQUEST
    );
  } catch (error: any) {
    if (error.message === ERROR_MESSAGE.INVALID_CREDENTIAL) {
      res.status(401).json({ error: ERROR_MESSAGE.INVALID_CREDENTIAL });
    } else {
      next(error);
    }
  }
}

  async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userService.getUser(req.params.email_id);
        res.status(HttpStatus.OK).json(users);

    } catch (error: any) {
        next(error)
    }
}
async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
      const user = await userService.updateUser(req.params.user_id, { ...req.body, updated_by: req.headers["x-user-id"] });
      res.status(HttpStatus.OK).json(new ApiResponse(true, user));
  } catch (error: any) {
    if (error.message === ERROR_MESSAGE.USER_UPDATE_FAILED) {
      res.status(401).json({ error: ERROR_MESSAGE.USER_UPDATE_FAILED });
    } else {
      next(error);
    }
  }
}
async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {

      const user = await userService.changePassword(req.params.user_id, { ...req.body, updated_by: req.headers["x-user-id"] });
      res.status(HttpStatus.OK).json(new ApiResponse(true, user));
  } catch (error: any) {
    if (error.message === ERROR_MESSAGE.USER_UPDATE_FAILED || error.message === ERROR_MESSAGE.PASSWORD_UPDATE_FAILED) {
      res.status(401).json({ error: ERROR_MESSAGE.PASSWORD_UPDATE_FAILED });
    } else {
      next(error);
    }
  }
}
async function request_reset_password(req: Request, res: Response, next: NextFunction) {
  try {
      const user = await userService.request_reset_password(req.params.email_id);
      res.status(HttpStatus.OK).json(new ApiResponse(true, user));
  } catch (error : any) {
      if (error.message === ERROR_MESSAGE.OTP_Failed) {
        res.status(401).json({ error: ERROR_MESSAGE.INVALID_EMAIL });
    } else {
        next(error);
    } 
  }
}

async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {

      const user = await userService.forgotPassword(req.params.email_id, req.body);
      res.status(HttpStatus.OK).json(new ApiResponse(true, user));
  } catch (error: any) {
    if (error.message === ERROR_MESSAGE.USER_UPDATE_FAILED || error.message === ERROR_MESSAGE.PASSWORD_UPDATE_FAILED) {
      res.status(401).json({ error: ERROR_MESSAGE.PASSWORD_UPDATE_FAILED });
    } else {
      next(error);
    }
  }
}
async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
      const user = await userService.verifyOtp(req.params.email_id, req.params.otp);
      res.status(HttpStatus.OK).json(new ApiResponse(true, user));
  } catch (error:any) {
    if (error.message === ERROR_MESSAGE.OTP_NOT_VERIFIED) {
      res.status(401).json({ error: ERROR_MESSAGE.OTP_NOT_VERIFIED });
  } else {
      next(error);
  }  
}
}
async function logoutUser(req: Request, res: Response, next: NextFunction) {
  try {
      const isLogout = false;
      const user = await userService.logoutUser(req.params.user_id,isLogout);
      res.status(HttpStatus.OK).json(new ApiResponse(true, user));
  } catch (error) {
      next(error);
  }
}
async function getAllUsers(req: Request, res: Response, next: NextFunction){
  try{
     let data =  await userService.getAllUsers();
      return res.status(HttpStatus.OK).json(data)
  }catch{

  }
}  
export {signUpUser,login,getUser,updateUser,changePassword,request_reset_password,forgotPassword,
  verifyOtp,logoutUser,getAllUsers}

