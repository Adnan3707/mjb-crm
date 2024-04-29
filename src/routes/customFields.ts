import express from 'express';
import * as customFieldController from '../controller/customField';
// import { validateCreateCustomField } from '../helper//validations/customField';

const customFieldRoute = express.Router();

customFieldRoute.get('/custom_fields', customFieldController.getAllCustomFields);
customFieldRoute.get('/custom_field/:custom_field_id', customFieldController.getCustomField);
customFieldRoute.post('/custom_field',  customFieldController.createCustomField);
customFieldRoute.put('/custom_field/:custom_field_id',  customFieldController.updateCustomField);
customFieldRoute.delete('/custom_field/:custom_field_id', customFieldController.deleteCustomField);

export default customFieldRoute;