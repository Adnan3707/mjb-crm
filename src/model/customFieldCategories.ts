import mongoose, { Schema, Types } from 'mongoose';

export interface ICustomFieldCategory {
    category_name: string;
    type: string;
    id: number
}
const customFieldCategorySchema = new mongoose.Schema({
    category_name: { type: String, required: true },
    type: { type: String, required: true },
    id: { type: Number, required: false }
}, { timestamps: true });


  
const CustomFieldCategory = mongoose.model("custom_field_categories", customFieldCategorySchema)
export default CustomFieldCategory;