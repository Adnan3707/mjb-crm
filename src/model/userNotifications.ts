import mongoose, { Schema, Types } from "mongoose";

export interface IUserNotification{
lead_id:String;
lead_name?:string;
user_id : String;
notification_id: String;
is_read: String;
operation_type: String;
}
const userNotificationSchema = new Schema(
    {
        user_id:{ type: Types.ObjectId,required: false },
        lead_id:{ type: Types.ObjectId,required: false },
        lead_name:{type: String,required: false},
        notification_id:{ type: Types.ObjectId,required: false },
        is_read: { type: Boolean, default: false },
        message: {type: String,required: false},

    },
    { timestamps: true }
    );
    
const UserNotification = mongoose.model("user_notifications", userNotificationSchema);

export default UserNotification;