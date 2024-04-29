import Express from "express"
import * as roleController from "../controller/role.controller";
import {  validateCreateRole , validatedeleteRole } from "../helper/validator";
import * as auth from "../helper/jwt";


const roleRoute = Express.Router();
roleRoute.use(auth.verifyjwt)
roleRoute.get('/roles/getAllRoles',roleController.allRoles)

roleRoute.post('/role/create',validateCreateRole,roleController.createRole)
roleRoute.get('/role/:id',roleController.rolesByid)

roleRoute.delete('/role/:id',roleController.deleteRole)

export default roleRoute;