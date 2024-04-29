import express from 'express';
import * as sourceController from '../controller/sourceController';

import * as auth from "../helper/jwt";

const sourceRouter = express.Router();
sourceRouter.use(auth.verifyjwt)


sourceRouter.post('/source/create',sourceController.createSource);
sourceRouter.get('/source/getAllSource',sourceController.fetchAllSource);
sourceRouter.delete('/source/delete/:id',sourceController.deleteSource);
sourceRouter.put('/source/update/:id',sourceController.updateSource)

export default sourceRouter;
