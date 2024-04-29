import Express from "express"
import * as Controller from "../controller/status.controller";
import { validateCreateStatus } from "../helper/validator";
import * as auth from "../helper/jwt";

const statusRoute = Express.Router();
statusRoute.use(auth.verifyjwt)
statusRoute.get('/status/getallstatus',Controller.allStatus)

statusRoute.post('/status',Controller.createStatus)
statusRoute.get('/status/:id',Controller.StatusByid)

statusRoute.put('/status/:id',Controller.updateStatus)


export default statusRoute;