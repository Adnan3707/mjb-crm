import Lead from "../model/lead";
import HttpStatus from "../constant/httpStatus";
import { NextFunction, Request, Response } from "express";
import * as notificationService from "../service/reminderServices"
import Notification,{INotification} from "../model/notifications";
import { CustomError } from "../handler/error";
import  Optional  from 'typescript';
import { OPERATION_TYPES } from "../constant/types";



export  async function createNotificationLeadOnEdit (req: Request, res: Response, next: NextFunction) {
  try {
    const leadId = req.params.leadId; // Assuming lead ID is in the request parameters
      next();
    } catch (error) {
      // Handle any errors
      console.error('Error creating notification_lead:', error);
      res.status(500).send('Internal Server Error');
    }
  };
export async function notificationRead(userId:string) {

    if ( !userId) {
      throw new CustomError(
        " userId is required.",
        HttpStatus.BAD_REQUEST
      );
    }
    const notification = await Notification.find({user_id:userId})
  
    if (!notification) {
      throw new CustomError("Notification not found.", HttpStatus.NOT_FOUND);
    }
  }
  export  async function createLeadNotificationN(  req: Request, res: Response,  next: NextFunction){
    try {
      const leadId = req.body.leadId as string; // Assuming lead ID is in the request parameters
      var userId : string [] = [];
       userId = [...req.body.users ?? ''] ;
      if(!leadId || !userId){
        throw new Error('lead id and userId both require');
      }else{
      const notification = await notificationService.createNotificationN({lead_id:leadId,rules:'test rule',user_id:req.body.userId,
      operationType:OPERATION_TYPES.CREATE });
      // res.status(HttpStatus.OK).json(notification)
      }
  
    } catch (error) {
      next(error);
    }
    }
