import express from 'express';
import * as leadDetailsController from '../controller/leadDetailsController';
import { validateCreateLead } from '../validations/leadValidations';

import * as auth from "../helper/jwt";

const leadDetailsRouter = express.Router();
leadDetailsRouter.use(auth.verifyjwt)

leadDetailsRouter.post('/leadDetails/create',validateCreateLead,leadDetailsController.createLeadDetails);
leadDetailsRouter.get('/leadDetails/getAll',leadDetailsController.getAllLeadDetails);
leadDetailsRouter.get('/leadDetails/:lead_id', leadDetailsController.getLeadDetailsById);

export default leadDetailsRouter;