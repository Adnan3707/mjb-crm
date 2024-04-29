import mongoose from "mongoose";
import { ENV } from "../constant/environment";
export const useDB = async () => {
    mongoose.connect(ENV.DB_URL, {
        dbName: ENV.DB_NAME,
        user: ENV.DB_USERNAME,
        pass: ENV.DB_PASSWORD
    }).then(() => console.log(`${ENV.DB_NAME} DB Connected`)).catch(err => console.error("DB Error", err))
};