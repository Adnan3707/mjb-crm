import mongoose, { Schema, Types } from "mongoose";

export interface StatusLayout {
    status: string;
}
const StatusSchema = new Schema(
    {
        status_id: { type: Types.ObjectId,required: false },
        status: { type: String,required: false },
        color_code: { type: String,required: false },
    },
    { timestamps: true }
    );
    
    const StatusModel = mongoose.model("status", StatusSchema);
    
    
    export default StatusModel;