import { IUser } from "../model/user";



export const resetPasswordRequest = (email:string,otp:string) => {
    return {
        to: [email],
        cc: [],
        subject: "Password Reset - From MJB CRM",
        text:
        `Hello,\n\nOTP for password reset is ${otp}\n\nSincerely,\nMjb CRM`,
        attachments: undefined
    }
}
export const resetPasswordSuccessful = (email:string,new_password:string) => {
    return {
        to: [email],
        cc: [],
        subject: "Password reset successfully",
        text:
        `Hello,\n\nPassword reset was successful, Your new password is : ${new_password} \n\nSincerely,\Mjb CRM .`,
        attachments: undefined
    }
}

export const welcomeMail = (payload: IUser, unHashedPassword: string) => {
    return {
        to: [payload.email_id.toString()],
        cc: [],
        subject: "Welcome to MJB CRM",
        text:
        `Hello,\n\nHere are your credential\n\nUsername: ${payload.email_id}\nPassword: ${unHashedPassword}\n\nSincerely,\nMjb CRM`,
        attachments: undefined
    }
}