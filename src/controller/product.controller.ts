import HttpStatus from "../constant/httpStatus";
import { NextFunction, Request, Response } from "express";
import { ENV } from "../constant/environment";
import * as ProductService from '../service/productServices';
import ApiResponse from '../handler/response';

const allProduct = async (req: Request, res: Response, next: NextFunction) =>{
    try{
       let data =  await ProductService.getAllProductDetails()
        return res.status(HttpStatus.OK).json(data)
    }catch{

    }
}   
const ProductByid = async (req:Request,res:Response,next: NextFunction) =>{
    try{
        let data = await ProductService.getProductDetailsById(req.params.id)
         return res.status(HttpStatus.OK).json(data)
    } catch (error) {
        next(error);
    }
}

const createProduct = async (req:Request,res:Response,next: NextFunction) => {
    try{
      let data =   await ProductService.create(req.body)
        return res.status(HttpStatus.OK).json(data)
    }catch(err){
        next(err);
    }
}
const updateProduct = async (req:Request,res:Response,next: NextFunction) => {
    try{
        let data =    await ProductService.updateProduct(req.params.id,{ ...req.body })
        return res.status(HttpStatus.OK).json(data)
    }catch (error) {
        next(error);
    }
}
export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const lead = await ProductService.deleteProduct(req.params.id);
        res.status(HttpStatus.OK).json(new ApiResponse(true, lead));
    } catch (error) {
        next(error);
    }
}
export { allProduct,    ProductByid,    createProduct,    updateProduct   }