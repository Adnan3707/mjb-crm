import HttpStatus from "../constant/httpStatus";
import { NextFunction, Request, Response } from "express";
import * as StatusService from '../service/statusServices';
const allStatus = async (req: Request, res: Response, next: NextFunction) =>{
    try{
       let data =  await StatusService.getAllStatusDetails()
        return res.status(HttpStatus.OK).json(data)
    } catch (error) {
        next(error);
    }
}   
const StatusByid = async (req:Request,res:Response,next: NextFunction) =>{
    try{
        let data =  await StatusService.getStatusDetailsById(req.params.id)
         return res.status(HttpStatus.OK).json(data)
    }catch (error) {
        next(error);
    }
}

const createStatus = async (req:Request,res:Response) => {
    try{
      let data =   await StatusService.create(req.body)
      return res.status(HttpStatus.OK).json(data)
    }catch(err){
        return res.status(HttpStatus.BAD_REQUEST).json({'err':err})
    }
}
const updateStatus = async (req:Request,res:Response) => {
    try{
        let data =    await StatusService.updateStatus(req.params.id,{ ...req.body })
        return res.status(HttpStatus.OK).json(data)
    }catch(err){
        return res.status(HttpStatus.BAD_REQUEST).json({'err':err})

    }
}
export { allStatus,    StatusByid,    createStatus,    updateStatus }