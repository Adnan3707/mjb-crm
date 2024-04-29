import mongoose, { CallbackError, Types } from 'mongoose';


export interface IUser {
    _id: String;
    email_id: String;
    password: String;
    first_name: String;
    last_name: String;
    last_login: String;
    status: String;
    new_password: String;
    confirm_password: String
    phone_number: String
    otp: String
  }

  export interface Login {
    email_id: string;
    password: string;
}
const userSchema = new mongoose.Schema ({

    email_id: {
        type: String,
        required: false
      },
      password: {
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
      last_login: {
        type: Date,
        default: null,
        required: false
      },
      phone_number: {
        type: String,
        required: false
      },
      otp: {
        type: String,
        required: false
      },

      role_name: {
        type: String,
        required: false
      },
    
      role_id: { type: Types.ObjectId,required: false },

      status: {
        type: String,
        required: false,
        default: "0"
      },
      login_status : { type: Boolean, required: false},


},{ timestamps: true });

const User = mongoose.model('user', userSchema);

export default User;