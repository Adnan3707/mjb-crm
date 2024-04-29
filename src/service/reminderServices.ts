import user from "../model/user";
import Lead from "../model/lead";
import Notification,{INotification} from "../model/notifications";
import { NextFunction, Request, Response } from "express";
import { NotiIo } from "..";
import * as UserNotificationService from "../service/userNotificationService";
import UserNotification,{IUserNotification} from "../model/userNotifications";



export  async function checkReminders () {
  function generateDateString(offset: number) {
    const today = new Date();
    today.setDate(today.getDate() + offset);
  
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const dayOfWeek = daysOfWeek[today.getDay()];
    const monthOfYear = monthsOfYear[today.getMonth()];
    const dayOfMonth = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    const hours = '23';
    const minutes = '59';
    const seconds = '59';
  
    return `${dayOfWeek}, ${dayOfMonth} ${monthOfYear} ${year} ${hours}:${minutes}:${seconds} GMT`;
  }
  
  // Generate yesterday's date string
  const yesterdayString = generateDateString(-1);
 
  // Generate today's date string
  const todayString = generateDateString(0);

    const reminders = await Lead.aggregate(
      [
        {
          '$lookup': {
            'from': 'users', 
            'localField': 'user_id', 
            'foreignField': '_id', 
            'as': 'user'
          }
        }, {
          '$lookup': {
            'from': 'status', 
            'localField': 'status_id', 
            'foreignField': '_id', 
            'as': 'status'
          }
        }, {
          '$match': {
            'reminderAt': {
              $gte: new Date(yesterdayString),
              $lt: new Date(todayString)
            },
            reminder_viewed: null,
            is_deleted:false
          }
        }
      ]
      ,
        { maxTimeMS: 60000, allowDiskUse: true }
  )
    return reminders
  };

  export async function createNotificationN(payload: INotification) {
    try {
      
        // Create the notification using the payload
        const notification = await Notification.create({ ...payload });

        // Emit test notification
        NotiIo.emit(payload.user_id, 'test notification');

        // Create IUserNotification object
        const userNotificationPayload: IUserNotification = {
           lead_id: payload.lead_id,
           lead_name: payload.lead_name,
            user_id: payload.user_id,
            notification_id: notification._id.toString(),
            is_read: 'false' ,
            operation_type:payload.operationType
        };

        // Call mappedUserNotifications with the userNotificationPayload
        await UserNotificationService.mappedUserNotifications(userNotificationPayload);
    } catch (error) {
        console.error('Error processing notification:', error);
    }
}

    
