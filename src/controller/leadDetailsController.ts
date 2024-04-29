import { NextFunction, Request, Response } from "express";
import * as leadDetailsService from '../service/leadDetailsService';
import HttpStatus from '../constant/httpStatus';
import ApiResponse from '../handler/response';
import { log } from "console";

export async function createLeadDetails(req: Request, res: Response, next: NextFunction){
    try {
        const leadDetail = await leadDetailsService.create(req.body);
        res.status(HttpStatus.OK).json(new ApiResponse(true, leadDetail));
      } catch (error) {
        next(error);
      }
}
export async function getAllLeadDetails(req: Request, res: Response, next: NextFunction) {
  try {
      const { page, limit, search, sortBy, sortOrder, searchFields } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const searchQuery = search?.toString();

      const leadDetails = await leadDetailsService.getAllLeadDetails(pageNumber, limitNumber, searchQuery, searchFields?.toString().split(","), sortBy?.toString(), sortOrder?.toString());
      res.status(HttpStatus.OK).json(leadDetails);
  } catch (error) {
      next(error);
  }
}
export async function getLeadDetailsById(req: Request, res: Response, next: NextFunction) {
  try {
      const leadDetails = await leadDetailsService.getLeadDetailsById(req.params.lead_id);
      res.status(HttpStatus.OK).json(new ApiResponse(true, leadDetails));
  } catch (error) {
      next(error);
  }
}
