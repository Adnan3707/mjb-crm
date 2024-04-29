import mongoose, { Schema, Types } from "mongoose";


export interface ILeadDetails{
    _id: String;
    user_id:String;
    lead_id:String;
    status_id:String;
    date_time:Date;
    comments:String;


}

const leadDetailsSchema = new Schema(
    {
        user_id: { type: Types.ObjectId,required: false },
        status_id: { type: Types.ObjectId,required: false },
        date_time: { type: Date,required: false},
        lead_id: { type: Types.ObjectId,required: false },
        comments: { type: String,required: false},
        changes: { type: Object },
        old_data: { type: Object },
        new_data: { type: Object },
        differences: { type: String,required: false},
    
    },
    { timestamps: true }
    );
    
    const LeadDetails = mongoose.model("lead_details", leadDetailsSchema);
    
    
    export default LeadDetails;