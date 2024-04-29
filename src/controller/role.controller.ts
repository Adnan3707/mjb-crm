import HttpStatus from "../constant/httpStatus";
import { NextFunction, Request, Response } from "express";
import { ENV } from "../constant/environment";
import * as RoleService from '../service/roleServices';
import ApiResponse from '../handler/response';

// import { database } from "../config/mongodbn"
// let client = database.collection("roles")
const allRoles = async (req: Request, res: Response, next: NextFunction) =>{
    try{

       let data =  await RoleService.getAllProductDetails()
        return res.status(HttpStatus.OK).json(data)
    }catch{

    }
}   
const rolesByid = async (req:Request,res:Response) =>{
    try{
        let data =  await RoleService.getProductDetailsById(req.params.id)
         return res.status(HttpStatus.OK).json(data)
    }catch{
        
    }
}

const createRole = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const data = await RoleService.create(req.body);
        next()
        res.status(HttpStatus.OK).json(new ApiResponse(true, data));
    } catch (error) {
        next(error);
    }
}
const updateRole = async (req:Request,res:Response) => {
    try{
        const data = await RoleService.updateRole(req.params.id, { ...req.body });
        res.status(HttpStatus.OK).json(new ApiResponse(true, data));
    }catch(err){
        return res.status(HttpStatus.BAD_REQUEST).json({'err':err})

    }
}
const deleteRole = async (req:Request,res:Response,next:NextFunction) => {

    try{
        const data = await RoleService.deleteRole(req.params.id);
        res.status(HttpStatus.OK).json(new ApiResponse(true, data));
    }catch(error){
        next(error);
    }
} 
export { allRoles,    rolesByid,    createRole,updateRole ,deleteRole}