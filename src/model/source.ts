import mongoose, { Schema, Types } from "mongoose";

export interface ISource{
  _id: String;
  name:String;
  address:String;
  first_name:String;
  last_name:String;
  phone_number:String;
}
const sourceSchema = new mongoose.Schema ({

    name: {
        type: String,
        required: false
      },
      address: {
        type: String,
        required: false
      },
      first_name: {
        type: String,
        required: false
      },
      last_name: {
        type: String,
        required: false
      },
      phone_number: {
        type: String,
        required: false
      },


},{ timestamps: true });

const Source = mongoose.model('source', sourceSchema);

export default Source;