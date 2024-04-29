import mongoose, { Schema, Types } from 'mongoose';


export interface ICustomField {
    applies_to: string;
    is_transferable: string;
    name: string;
    default_value: string;
    category: string;
}

const customFieldSchema: Schema = new Schema({
    applies_to: { type: String, required: true },
    is_transferable: { type: String, required: false },
    name: { type: String, required: true },
    default_value: { type: {}, required: false },
    category: { type: Types.ObjectId, required: true },
    created_by: { type: Types.ObjectId, required: false },
    updated_by: { type: Types.ObjectId, required: false }
}, { timestamps: true });


const CustomField = mongoose.model('custom_fields', customFieldSchema)

export default CustomField;