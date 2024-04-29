import e, { NextFunction, Request, Response } from 'express';
import * as CustomFieldCategoryService from '../service/customFieldCategories'
import HttpStatus from '../constant/httpStatus';

async function getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await CustomFieldCategoryService.getAll()
        res.status(HttpStatus.OK).json(categories)
    } catch (error) {
        next(error)
    }
}
async function getbyName(name:string) {
    try {
        const categories = await CustomFieldCategoryService.getByName(name as string)
       return categories
    } catch (error) {
        
    }
}
async function createCustomFieldCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const category = await CustomFieldCategoryService.createCustomFieldCategory({...req.body})
        res.status(HttpStatus.OK).json(category)
    } catch (error) {
        next(error)
    }
}


export { getAllCategories,createCustomFieldCategory,getbyName }


