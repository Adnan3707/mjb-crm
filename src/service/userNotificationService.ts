import UserNotification,{IUserNotification} from "../model/userNotifications";
import Notification,{INotification} from "../model/notifications";
import { OPERATION_TYPES } from "../constant/types";
import User from "../model/user";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constant/messages/lead";



export async function mappedUserNotifications(payload: IUserNotification) {
    try {
        // Find user notification
        let userNotification = await UserNotification.findById(payload.user_id);

        const user = await User.findById(payload.user_id);

        let userName ; // Initialize userName
        let message : any;

        if (user) {
            // Check if first_name and last_name are null, if so, use email_id
            if (user.first_name && user.last_name) {
                userName = `${user.first_name} ${user.last_name}`; // Combine first_name and last_name
            } else {
                userName = user.email_id ;
            }
        }

        if (payload.operation_type === OPERATION_TYPES.UPDATE) {
            message = `User '${userName}' updated lead`; 
        }
        if (payload.operation_type === OPERATION_TYPES.CREATE) {
            message = `User '${userName}'  created lead`; 
        }

        // If user notification does not exist, create a new one
        if (!userNotification) {
            // Create user notification with isRead = true and current timestamp
            const modifiedPayload = {
                ...payload,
                isRead: true,
                createdAt: new Date(),
                message: message
            };
            await UserNotification.create(modifiedPayload);
        } else {
            // Find notifications with a timestamp greater than userNotification's timestamp
            const notifications = await Notification.find({
                createdAt: { $gt: userNotification.createdAt },
                user_id: payload.user_id
            });

            // Create UserNotifications for new notifications
            const newUserNotifications = notifications.map(notification => ({
                user_id: payload.user_id,
                // Set other properties of UserNotification here
                isRead: false, // Assuming all new notifications are unread
                createdAt: new Date(),
                notification_id: notification._id,
                message: message
            }));

            await UserNotification.insertMany(newUserNotifications);
            console.log('New user notifications created for existing notifications:', newUserNotifications);
        }
    } catch (error) {
        console.error('Error processing user notification:', error);
    }
}


export async function getAllUserNotifications() {
    const userNotifications = await UserNotification.find({ is_read: false }).sort({ createdAt: -1 }).lean().exec();
    return userNotifications;
}

export async function updateNotification(notification_id: string, is_read: boolean) {
    try {
        const notification = await UserNotification.updateOne({ _id: notification_id }, { is_read: is_read });
     if(notification.modifiedCount > 0){
        return SUCCESS_MESSAGE.NOTIFICATION_UPDATED;
    } else{
        return ERROR_MESSAGE.NOTIFICATION_UPDATE_FAILED;
    }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
