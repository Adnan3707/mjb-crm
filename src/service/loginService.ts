import HttpStatus from "../constant/httpStatus";
import { ERROR_MESSAGE } from "../constant/messages/user";
import { CustomError } from "../handler/error";
import { compare } from "../helper/bcrypt";
import { getAccessToken } from "../helper/jwt";
import RoleModel from "../model/role.Model";
import User, { Login } from "../model/user";
import * as userService from '../service/userService';

async function login(payload: Login) {
    const user = await userService.getUser(payload.email_id);

    if (user && user.role_id) {
        const role= await RoleModel.findOne(user.role_id);
        user.role_name= role?.role;
    }
    if (user) {
        if (user.login_status === false) {
            await User.updateOne({ _id: user._id }, { $set: { login_status: true } });
        }

        if (user.password && (await compare(payload.password, user.password))) {
            // Generate an access token for the user
            const token = await getAccessToken({ _id: user._id, email: user.email_id });
            return { user, token };
        } else {
            // If password is invalid, throw an error
            throw new CustomError(ERROR_MESSAGE.INVALID_CREDENTIAL, HttpStatus.UNAUTHORIZED);
        }
    }
    
    throw new CustomError(ERROR_MESSAGE.INVALID_CREDENTIAL, HttpStatus.UNAUTHORIZED);
}
async function logout() {
    return { status: true , message:'user Log Out success'}
}

export{login,logout}