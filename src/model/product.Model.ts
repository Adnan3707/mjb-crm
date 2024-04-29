import mongoose, { Schema, Types } from "mongoose";


export interface   ProductLayout {
    _id:String;
    name: string;
    description: string  
}

const ProductSchema = new Schema(
    {
        id: { type: Types.ObjectId,required: false },
        name: { type: String,required: false },
        description: { type: String,required: false}
    },
    { timestamps: true }
    );
    
    const ProductModel = mongoose.model("products", ProductSchema);
    
    
    export default ProductModel;