
import Role from "../model/role.Model";
import User from "../model/user";
import UserNotification,{IUserNotification} from "../model/userNotifications";
import { NextFunction, Request, Response } from "express";
import HttpStatus from '../constant/httpStatus';
import ApiResponse from '../handler/response';
import * as usernotificationService from "../service/userNotificationService";


export async function getUserNotifications(req: Request, res: Response, next: NextFunction){
    try{
       let data =  await usernotificationService.getAllUserNotifications();
        return res.status(HttpStatus.OK).json(data)
    }catch{
  
    }
  }  
  export async function updateIsRead(req: Request, res: Response, next: NextFunction) {
    try {
        const userNotification = await usernotificationService.updateNotification(req.params.notification_id, true);
        next()
        res.status(HttpStatus.OK).json(new ApiResponse(true, userNotification));

    } catch (error) {
        next(error);
    }
}