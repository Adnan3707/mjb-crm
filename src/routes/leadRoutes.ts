import express from 'express';
import * as leadController from '../controller/leadController';
import { validateCreateLead } from '../validations/leadValidations';
import { multerMiddleware } from "../middleware/multer";
import * as notificationController from '../controller/notificationController'

import * as auth from "../helper/jwt";

const leadRouter = express.Router();
 leadRouter.use(auth.verifyjwt)
leadRouter.post('/lead/create',validateCreateLead,leadController.createLead,leadController.saveNote);
leadRouter.get('/lead/getAll',leadController.getAllLeads);
leadRouter.get('/lead/:lead_id', leadController.getLeadById);
leadRouter.put('/lead/update/:lead_id',validateCreateLead,leadController.updateLead);
leadRouter.delete('/lead/delete/:lead_id', leadController.deleteLead);
leadRouter.get('/lead/by/status', leadController.getLeadByStatus);
leadRouter.post('/lead/:lead_id/attachments', multerMiddleware.array('files'), leadController.addAttachment);
leadRouter.get('/lead/get/number', leadController.generateNextNumber);
leadRouter.get('/lead/add/reminder', leadController.addReminder);
leadRouter.post('/lead/reminder', leadController.checkReminder);
leadRouter.get('/lead/get/statusWithValue', leadController.getStatusWithValue);
leadRouter.get('/lead/get/emailwithStatus', leadController.SalesRep);
leadRouter.put("/lead/:lead_id/savenote", multerMiddleware.array("files"), leadController.saveNote);
leadRouter.post("/job/view/calendar", leadController.getCalendarJobs);
leadRouter.get("/job/view/details", leadController.getDetails);



export default leadRouter;





