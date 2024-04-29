import { NextFunction, Request, Response } from "express";
import * as leadService from '../service/leadService';
import HttpStatus from '../constant/httpStatus';
import ApiResponse from '../handler/response';
import { formatDate } from "../helper/dateHelper";
import Lead, { ILead } from "../model/lead";
import { Http } from "winston/lib/winston/transports";

import { ObjectId } from "mongodb";
import LeadDetails from "../model/leadDetails";



export async function createLead(req: Request, res: Response, next: NextFunction) {
    //work
    try {
        const lead = await leadService.create(req.body);
        req.params.lead_id = (lead._id as ObjectId).toString() || '';
        req.body.text = lead.notes;
        req.body.user = lead.user_id;
        if(req.body.text !== ''){
            next()
        }
        res.status(HttpStatus.OK).json(new ApiResponse(true, lead));
    } catch (error) {
        next(error);
    }
}



export async function getAllLeads(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit, search, sortBy, sortOrder, searchFields } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const searchQuery = search?.toString();

        const leads = await leadService.getAllLeads(pageNumber, limitNumber, searchQuery, searchFields?.toString().split(","), sortBy?.toString(), sortOrder?.toString());
        res.status(HttpStatus.OK).json(leads);
    } catch (error) {
        next(error);
    }
}
export async function getLeadById(req: Request, res: Response, next: NextFunction) {
    try {
        const lead = await leadService.getLeadById(req.params.lead_id);
        res.status(HttpStatus.OK).json(new ApiResponse(true, lead));
    } catch (error) {
        next(error);
    }
}

export async function updateLead(req: Request, res: Response, next: NextFunction) {
    try {
        const lead = await leadService.updateLead(req.params.lead_id, { ...req.body });
        req.body.leadId = req.params.lead_id;
        next()
        res.status(HttpStatus.OK).json(new ApiResponse(true, lead));
    } catch (error) {
        next(error);
    }
}

export async function deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
        const lead = await leadService.deleteLead(req.params.lead_id);
        res.status(HttpStatus.OK).json(new ApiResponse(true, lead));
    } catch (error) {
        next(error);
    }
}

export async function getLeadByStatus(req: Request, res: Response, next: NextFunction) {

    try {
        const { search } = req.query;
        let Params_Data: query = {
            start: req.query.start as string ?? formatDate(new Date(0)),
            end: req.query.end as string ?? formatDate(new Date())
        }
        interface query {
            start: string,
            end: string
        }
         let productId: string | undefined;
        productId = req.query.product_id as string;
        
        const searchVal = search ? String(search) : "";

        let userId: string | undefined;
        userId = req.query.user_id as string;

        let sourceId: string | undefined;
        sourceId = req.query.source_id as string;
        
        const data = await leadService.findLeadByStatus(Params_Data.start, Params_Data.end, searchVal,productId,userId,sourceId);
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/*add attachment*/

export async function addAttachment(req: Request, res: Response, next: NextFunction) {
    try {
        const lead = await leadService.addAttachment(req.params.lead_id, req.files);
        res.status(HttpStatus.OK).json(new ApiResponse(true, lead));
    } catch (error) {
        next(error);
    }
}

// Function to generate the next number
export async function generateNextNumber(req: Request, res: Response, next: NextFunction) {
    // Find the latest lead to get the last number
    const latestLead = await Lead.find({}).sort({ '_id': -1 }).limit(1);

    let lastNumber = 0;
    if (latestLead?.length && latestLead[0]?.number) {
        // Extract the numeric part of the last number
        const splitNumber = latestLead[0]?.number.split('_');
        if (splitNumber.length === 2) {
            lastNumber = parseInt(splitNumber[1]);
        }
    }

    // Increment the last number
    const nextNumber = lastNumber + 1;

    // Generate the new number with prefix and suffix
    const newNumber = `MJB_${nextNumber}`;

    res.status(HttpStatus.OK).json(new ApiResponse(true, newNumber));

    return newNumber;
}
export async function addReminder(req: Request, res: Response, next: NextFunction) {
    try {
        let {time ,id} = req.query || null;
        // let {message} = req.body || '';
        if(time!= null){
           let data =  await leadService.reminder(time as string ,id as string);
            res.status(HttpStatus.OK).json(new ApiResponse(true, data));
        }else{
            res.status(HttpStatus.NO_CONTENT).json(new ApiResponse(false,'provide time'))
        }
    } catch (error) {
        next(error);
    }
}

export async function checkReminder(req: Request, res: Response, next: NextFunction) {

    try {
         let userId: string | undefined;
         userId = req.query.lead as string;
        const data = await leadService.stopReminder(userId);
        res.status(HttpStatus.OK).json(new ApiResponse(true, data));
    } catch (error) {
        next(error);
    }
}

export async function SalesRep(req: Request, res: Response, next: NextFunction) {

    try {
        let name: string | undefined;
        name = req.query.name as string;
        let product: string | undefined;
        product = req.query.product as string;
        let source: string | undefined;
        source = req.query.source as string;
        let userId: string | undefined;
        userId = req.query.userId as string;
        let Params_Data: query = {
            start: req.query.start as string ?? formatDate(new Date(0)),
            end: req.query.end as string ?? formatDate(new Date())
        }
        interface query {
            start: string,
            end: string
        }
        const data = await leadService.SalesRep(name,product,source,Params_Data.start, Params_Data.end,userId);
        interface ResultEntry {
            name: string;
            Initial: number;
            'Demo Done': number;
            'Proposal Sent': number;
            'Nego/FUP': number;
            Won: number;
            Loss: number;
          }

          let transformedData: Record<string, ResultEntry> = data.reduce((acc:any, entry:any) => {
            const { name, status, count } = entry;

            if (!acc[name]) {
              acc[name] = {
                name,
                Initial: 0,
                'Demo Done': 0,
                'Proposal Sent': 0,
                'Nego/FUP': 0,
                Won: 0,
                Loss: 0,
              };
            }

            acc[name][status] = count;
            return acc;
          }, {});
          let resultArray = Object.values(transformedData);
        res.status(HttpStatus.OK).json(new ApiResponse(true, resultArray));
    } catch (error) {
        next(error);
    }
}

export async function getStatusWithValue(req: Request, res: Response, next: NextFunction){
    try {
        const { search } = req.query;
        const searchVal = search ? String(search) : "";
        let Params_Data: query = {
            start: req.query.start as string ?? formatDate(new Date(0)),
            end: req.query.end as string ?? formatDate(new Date())
        }
        interface query {
            start: string,
            end: string
        }
        const statusWithValue = await leadService.getStatusWithValue(Params_Data.start, Params_Data.end,searchVal);
        res.status(HttpStatus.OK).json(new ApiResponse(true, statusWithValue));
    } catch (error) {
        next(error);
    }
}

export async function saveNote(req: Request, res: Response, next: NextFunction) {

    try {

    const oldLead = await Lead.findOne({ _id: req.params.lead_id });

      const result = await leadService.saveNote(
        req.params.lead_id,
        { files: req.files, ...req.body },
        req.query.note_id?.toString()
      );
      console.log("----",result);

      const newLead = await Lead.findOne({ _id: req.params.lead_id });

      await LeadDetails.create({
        user_id: newLead?.user_id, // Assuming user_id is part of the payload
        status_id: newLead?.status_id, // Assuming status_id is part of the payload
        date_time: new Date(), // Assuming you want to use the current date and time
        lead_id: req.params.lead_id, // Using the _id of the newly created Lead
        comments: newLead?.comments ,// Assuming comments is part of the payload
        old_data: { internal_notes: oldLead?.toJSON()?.internal_notes },
        new_data: {
          internal_notes: newLead?.toJSON()?.internal_notes,
        },

    });
      res.status(HttpStatus.OK).json(new ApiResponse(true, result));
    } catch (error) {
      next(error);
    }
  }
  
  export async function getCalendarJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await leadService.getCalendarJobs(req.body);
      res.status(HttpStatus.OK).json(new ApiResponse(true, jobs));
    } catch (error) {
      next(error);
    }
  }
  export async function getDetails(req: Request, res: Response, next: NextFunction) {
    try {
        let status: string 
        let email: string 
        let product: string 
        let source: string
         status = req.query.status as string ;
         email = req.query.email as string;
         product = req.query.product as string;
         source = req.query.source as string;


      const jobs = await leadService.getDetails(status,email,product,source);
      res.status(HttpStatus.OK).json(new ApiResponse(true, jobs));
    } catch (error) {
      next(error);
    }
  }