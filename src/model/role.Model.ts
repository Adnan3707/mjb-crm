import mongoose, { Schema, Types } from "mongoose";

export interface RoleLayout {
    role: string;
}
const roleSchema = new Schema(
    {
        role: { type: String,required: false },
    },
    { timestamps: true }
    );
    
    const RoleModel = mongoose.model("roles", roleSchema);
    
    
    export default RoleModel;