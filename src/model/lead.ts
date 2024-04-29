import mongoose, { Schema, Types } from "mongoose";

export interface ILead{
    email_id: String;
    name:String;
    user_id:String;
    product_id:String;
    role_id:String;
    status_id:String;
    mobileNo:String;
    value:String;
    contactPerson:String;
    //notes:String;
    date_time:Date;
    lead_date:Date;
    comments:String;
    attachments:String;
    number:String;
    message:String;
    source_id:String;
    updated_date:Date;
    initial_date:Date;
    reminderAt:Date;
    demo_date:Date ;
    proposal_date : Date;
    nego_date: Date;
    won_date: Date;
    loss_date: Date;
    loggedIn_user_id:String;
}

export interface Note {
    text: string;
    attachments: string[];
    linked_to: string[];
  }

const notesSchema = new Schema(
    {
      text: { type: String },
      attachments: [{ type: String }],
      linked_to: [{ type: String }],
      users: [{ type: Types.ObjectId }],
    },
    { timestamps: true }
  );
export  interface calendarJobFilter {
    start_date: string;
    end_date: string;
    timezone: string;
    status: string;
    userId:string;
  }
  
const leadSchema = new Schema(
{
    name: {type: String,required: false},
    user_id: { type: Types.ObjectId,required: false },
    role_id: { type: Types.ObjectId,required: false },
    product_id: {type: mongoose.Schema.Types.ObjectId, required: false, ref: "products"},
    status_id: { type: Types.ObjectId,required: false },
    mobileNo: {type: String,required: false},
    email_id: { type: String,required: false},
    value: { type: String,required: false},
    contactPerson: { type: String,required: false},
   notes: { type: String,required: false},
    date_time: { type: Date,required: false},
    lead_date: { type: Date,required: false},
    comments: { type: String,required: false},
    attachments: { type: [String], required: false },
    number:{ type: String,required: false},
    is_deleted: { type: Boolean, default: false },
    reminder_date_time: { type: Date,required: false},
    forecast_date: { type: Date,required: false},
    reminderAt:{ type: Date,required: false},
    message:{ type: String,required: false},
    Initial_date:{ type: Date,required: false},
    Demo_Done_date: { type: Date,required: false},
    Proposal_Sent_date :  { type: Date,required: false},
    Nego_FUP_date: { type: Date,required: false},
    Won_date: { type: Date,required: false},
    Loss_date: { type: Date,required: false},
    source_id: { type: Types.ObjectId,required: false },
    reminder_viewed:{ type: Boolean},
    internal_notes: [notesSchema],


},
{ timestamps: true }
);

const Lead = mongoose.model("lead", leadSchema);


export default Lead;
