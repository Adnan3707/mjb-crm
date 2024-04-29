import { NextFunction, Request, Response } from "express";
import * as customFieldService from '../service/customField';
import { getByName } from "../service/customFieldCategories";
import HttpStatus from "../constant/httpStatus";
import ApiResponse from "../handler/response";
import { SUCCESS_MESSAGE } from "../constant/messages/customField";
import { getbyName } from "./customFieldCategories";

async function getAllCustomFields(req: Request, res: Response, next: NextFunction) {
    try {

        const {  search, } = req.query;
        const searchQuery = search?.toString();
        
        const customFields = await customFieldService.getAllCustomFields(searchQuery)
        res.status(HttpStatus.OK).json(new ApiResponse(true, customFields));
    } catch (error) {
        next(error);
    }
}

async function getCustomField(req: Request, res: Response, next: NextFunction) {
    try {
        const customField = await customFieldService.getCustomField(req.params.custom_field_id);
        res.status(HttpStatus.OK).json(new ApiResponse(true, customField));
    } catch (error) {
        next(error);
    }
}

async function createCustomField(req: Request, res: Response, next: NextFunction) {
    try {
        const customField = await customFieldService.createCustomField({ ...req.body, created_by: req.headers["x-user-id"] });
        res.status(HttpStatus.OK).json(new ApiResponse(true, customField, null, SUCCESS_MESSAGE.CUSTOM_FIELD_CREATED));
    } catch (error) {
        next(error);
    }
}

async function updateCustomField(req: Request, res: Response, next: NextFunction) {
    try {
        const customField = await customFieldService.updateCustomField(req.params.custom_field_id, { ...req.body, updated_by: req.headers["x-user-id"] });
        res.status(HttpStatus.OK).json(new ApiResponse(true, customField, null, SUCCESS_MESSAGE.CUSTOM_FIELD_UPDATED));
    } catch (error) {
        next(error);
    }
}

async function deleteCustomField(req: Request, res: Response, next: NextFunction) {
    try {
        const customField = await customFieldService.deleteCustomField(req.params.custom_field_id);
        res.status(HttpStatus.OK).json(new ApiResponse(true, customField, null, SUCCESS_MESSAGE.CUSTOM_FIELD_DELETED));
    } catch (error) {
        next(error);
    }
}


export { getAllCustomFields, getCustomField, createCustomField, updateCustomField, deleteCustomField }