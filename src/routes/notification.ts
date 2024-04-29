import express from "express";
import * as notificationController from '../controller/notificationController';
import * as userNotificationController from '../controller/userNotificationController';



const notificationRouter = express.Router();


notificationRouter.post("/notificationN",
notificationController.createLeadNotificationN) ;
notificationRouter.get("/notifications/read", notificationController.notificationRead)
notificationRouter.get("/notifications/get/userNotifications", userNotificationController.getUserNotifications)
notificationRouter.put("/notifications/update/isRead/:notification_id", userNotificationController.updateIsRead)



export default notificationRouter