import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constant/messages/user";
import User, { IUser } from "../model/user";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import EmailService, { IEmail } from "../service/emailService";
import { resetPasswordRequest, resetPasswordSuccessful, welcomeMail } from "../helper/mailTemplate";


const emailService = new EmailService();

async function createUser(payload: IUser) {
    const emailExists = await User.countDocuments({ email_id: { $regex: new RegExp(payload.email_id?.toString(), "i") } });
  
    if (emailExists) {
      throw new Error(ERROR_MESSAGE.DUPLICATE_EMAIL);
      return
    }
  
    let unHashedPassword: string = "";
    if (!payload.password) {
      const randomPassword = Math.random().toString(36).slice(2, 10);
      unHashedPassword = randomPassword;
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(randomPassword, salt);
    } else {
      unHashedPassword = payload.password.toString();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(payload.password?.toString(), salt);
      payload.password = hashedPassword;
    }
    const user = await User.create(payload);
    const emailParams: IEmail = welcomeMail(payload, unHashedPassword);
    await emailService.sendEmailWithAttachment(emailParams);
  

    return user;
  }

  async function getUser(email_id: string) {
    const user = await User.findOne({ email_id: email_id });
    return user;
  }

  async function updateUser(userId: string, payload: IUser) {
    try {
      let user = await User.updateOne({ _id: userId }, payload);
      if (user?.modifiedCount > 0) {
        return SUCCESS_MESSAGE.USER_UPDATED;
      }
      throw new Error(ERROR_MESSAGE.USER_UPDATE_FAILED);
    } catch (error) {
      return ERROR_MESSAGE.USER_UPDATE_FAILED;
    }
  }

  async function changePassword(userId: string, payload: IUser) {
    const { new_password, confirm_password } = payload;
    try {
      if (new_password !== confirm_password) {
        return ERROR_MESSAGE.PASSWORD_NOT_MATCHED;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password.toString(), salt);
      let user = await User.updateOne({ _id: userId }, { password: hashedPassword });
      if (user?.modifiedCount > 0) {
        return SUCCESS_MESSAGE.USER_UPDATED;
      }
      throw new Error(ERROR_MESSAGE.USER_UPDATE_FAILED);
    } catch (error) {
      return ERROR_MESSAGE.PASSWORD_UPDATE_FAILED;
    }
  }

  async function request_reset_password(email_id: string) {
    const otp: string = Math.floor(1000 + Math.random() * 9000).toString();
  
    const user = await User.updateOne(
      { email_id: email_id },
      {
        $set: {
          otp: otp,
        },
      }
    );
  
    if (user?.modifiedCount > 0) {
      const emailParams: any = resetPasswordRequest(email_id, otp);
      await emailService.sendEmailWithAttachment(emailParams);
      return SUCCESS_MESSAGE.OTP_UPDATED;
    }
    throw new Error(ERROR_MESSAGE.OTP_Failed);
  }
  
  async function verifyOtp(email_id: string, otp: string) {
    const user = await User.countDocuments({ email_id, otp });
    
    if (user) {
      return SUCCESS_MESSAGE.OTP_VERIFIED;
    }
    throw new Error(ERROR_MESSAGE.OTP_NOT_VERIFIED);
  }
  
  async function forgotPassword(email_id: string, payload: IUser) {
    const { new_password, confirm_password } = payload;
    try {
      if (new_password !== confirm_password) {
        return ERROR_MESSAGE.PASSWORD_NOT_MATCHED;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password.toString(), salt);
  
      const password = hashedPassword;
  
      const user = await User.updateOne(
        { email_id: email_id },
        {
          $set: {
            password,
          },
        }
      );
      if (user?.modifiedCount > 0) {
        const emailParams: any = resetPasswordSuccessful(email_id, new_password.toString());
        await emailService.sendEmailWithAttachment(emailParams);
        return SUCCESS_MESSAGE.PASSWORD_UPDATED;
      }
      return ERROR_MESSAGE.PASSWORD_UPDATE_FAILED;
    } catch (error) {
      return ERROR_MESSAGE.PASSWORD_UPDATE_FAILED;
    }
  }

  async function logoutUser(user_id: string, isLogout: boolean) {

    const user = await User.updateOne({ _id: user_id }, {
        $set: {
            login_status: isLogout
        }
    })
    if (user?.modifiedCount > 0) {
        return SUCCESS_MESSAGE.USER_IS_LOGOUT;
    }
    throw new Error(ERROR_MESSAGE.USER_IS_NOT_LOGOUT);
}

async function getAllUsers() {
  const users = await User.aggregate([
    {
      $addFields: {
        sortField: { $cond: { if: { $ne: ["$first_name", null] }, then: "$first_name", else: "$email_id" } }
      }
    },
    { $sort: { sortField: 1 } },
    { $unset: "sortField" }, // Remove the sortField added for sorting
    { $project: { _id: 1, first_name: 1, last_name: 1, email_id: 1,password: 1,phone_number: 1,otp: 1,status: 1,login_status: 1 } } // Exclude _id field from the result
  ]);
  return users;
}
  export{createUser,getUser,updateUser,changePassword,request_reset_password,verifyOtp,forgotPassword,logoutUser,getAllUsers}


