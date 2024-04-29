import mongoose, { Schema, Types } from "mongoose";

export interface INotification{
    lead_id:String
    lead_name?:string;
    rules:String
    //users:string[]; 
    user_id:String;
    operationType:String;

}

const notificationSchema = new Schema(
{
    lead_id:{ type: Types.ObjectId,required: false },
    loggedin_userId:{ type: Types.ObjectId,required: false },
   // users:{ type: Array,default:[], required: false },
    operation_type: {type: String,required: false},
    message: {type: String,required: false},
    rules:{type:String},

},
{ timestamps: true }
);

const Notification = mongoose.model("notification_rules", notificationSchema);


export default Notification;
