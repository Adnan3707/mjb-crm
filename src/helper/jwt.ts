import jwt from "jsonwebtoken";
import { ENV } from "../constant/environment";
import { NextFunction, Request, Response } from "express";
import { AnyARecord } from "dns";
export const getAccessToken = (user: any) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        user: user,
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRE_IN },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const verifyjwt = (req: Request, res: Response, next: NextFunction) =>  {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
   try{
        // jwt.verify(token,ENV.JWT_SECRET)
        next()

   }catch(error: any){
    if (error.message === "jwt expired") {
      res.status(401).json({ error: "Token expired" });
    } else res.status(500).json({ error: "Internal server error" });
   }
}

