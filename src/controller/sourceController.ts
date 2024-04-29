import HttpStatus from "../constant/httpStatus";
import { NextFunction, Request, Response } from "express";
import { ENV } from "../constant/environment";
import * as sourceService from '../service/sourceService';
import ApiResponse from '../handler/response';


export async function createSource(req: Request, res: Response, next: NextFunction) {
    try{
      let data =   await sourceService.create(req.body)
        return res.status(HttpStatus.OK).json(data)
    }catch(err){
        next(err);
    }
}

export async function fetchAllSource(req: Request, res: Response, next: NextFunction){
    try{
       let data =  await sourceService.fetchAllSource()
        return res.status(HttpStatus.OK).json(data)
    }catch(err){
        next(err);
    }
}   
export async function deleteSource(req: Request, res: Response, next: NextFunction){
    try{
       let data =  await sourceService.deleteSource(req.params.id)
        return res.status(HttpStatus.OK).json(data)
    }catch(err){
        next(err);
    }
}   

  export async function updateSource(req: Request, res: Response, next: NextFunction){
    try{
        let data =    await sourceService.updateSource(req.params.id,{ ...req.body })
        return res.status(HttpStatus.OK).json(data)
    }catch (error) {
        next(error);
    }
}