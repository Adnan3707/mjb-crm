import { NextFunction, Request, Response } from "express";
import { query, body, matchedData, validationResult } from "express-validator";
import HttpStatus from "../constant/httpStatus";


//Create client validation
export const validateCreateClient = [
  body("name").notEmpty().withMessage("Name is required"),
  body("location.address1")
    .notEmpty()
    .withMessage("Search location is required"),
  body("location.street_address")
    .notEmpty()
    .withMessage("Street Address is required"),
  body("location.city").notEmpty().withMessage("City is required"),
  body("location.state").notEmpty().withMessage("State is required"),
  body("location.zip_code").notEmpty().withMessage("Zip Code is required"),
  body("primary_contact.role")
    .notEmpty()
    .withMessage("Primary Contact Role is required"),
  body("primary_contact.first_name")
    .notEmpty()
    .withMessage("Primary Contact First Name is required"),
  body("primary_contact.last_name")
    .notEmpty()
    .withMessage("Primary Contact Last Name is required"),
  body("primary_contact.email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("primary_contact.phone_number")
    .notEmpty()
    .withMessage("Primary Contact Phone Number is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    next();
  },
];

export const validateCreateRole = [
  body("role").notEmpty().withMessage("role is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
   req.body = retainOnlyKeys(req.body,['role']) 
    next();
  },
]
export const validateCreateProduct = [
  body('name').notEmpty().withMessage("name is required"),
  body('description').notEmpty().withMessage("description is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
   req.body = Product(req.body,['name','description']) 
    next();
  },
]
export const validateCreateStatus = [
  body('status').notEmpty().withMessage("status is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
   req.body = Status(req.body,['status']) 
    next();
  },
]
export const validatedeleteRole = [
  query("role").notEmpty().withMessage("role is required"),
] 
export function retainOnlyKeys(obj:any, keys:string[]) {
  interface MyObjLayout {
    role: string;
    createdAt: string  
    updatedAt:string
}
  // Create a new object
  let newObj :MyObjLayout ={
    role: '',
    createdAt: '',
    updatedAt: ''
  };

  let timestamp = new Date().toISOString();
  // Iterate over each key in the array
  keys.forEach(key => {
      // Check if the key exists in the original object
      if (obj.hasOwnProperty(key )) {
          // Add the key-value pair to the new object
          newObj[key as keyof MyObjLayout] = obj[key];
      }
  });
  newObj.createdAt = timestamp ;
  newObj.updatedAt = timestamp;

  // Return the new object
  return newObj;
}
export function Product(obj:any, keys:string[]) {
  interface MyObjLayout {
    name: string;
    description: string  
    createdAt : string
    updatedAt:string
}
  // Create a new object
  let newObj :MyObjLayout ={
    name: '',
    description: '',
    createdAt: '',
    updatedAt: ''
  };

  let timestamp = new Date().toISOString();
  // Iterate over each key in the array
  keys.forEach(key => {
      // Check if the key exists in the original object
      if (obj.hasOwnProperty(key )) {
          // Add the key-value pair to the new object
          newObj[key as keyof MyObjLayout] = obj[key];
      }
  });
  newObj.createdAt = timestamp ;
  newObj.updatedAt = timestamp;

  // Return the new object
  return newObj;
}
export function Status(obj:any, keys:string[]) {
  interface MyObjLayout {
    status: string;
    createdAt : string
    updatedAt:string
}
  // Create a new object
  let newObj :MyObjLayout ={
    status: '',
    createdAt: '',
    updatedAt: ''
  };

  let timestamp = new Date().toISOString();
  // Iterate over each key in the array
  keys.forEach(key => {
      // Check if the key exists in the original object
      if (obj.hasOwnProperty(key )) {
          // Add the key-value pair to the new object
          newObj[key as keyof MyObjLayout] = obj[key];
      }
  });
  newObj.createdAt = timestamp ;
  newObj.updatedAt = timestamp;

  // Return the new object
  return newObj;
}
export function  paginatedResults(data:[],req:Request,res:Response,next:NextFunction){
  interface Results{
    next:{
      page:number ,
      limit:number 
    },
    previous:{
      page:number,
      limit:number
    } 
  }

  const page= parseInt(req.query.page as string) 
  const limit = parseInt(req.query.limit as  string)
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
   let results : Results ={
    next:{
      page:0 ,
      limit:0 
    },
    previous:{
      page:0,
      limit:0
    } 
   } 
  // .limit(limit).skip(startIndex)
  if (endIndex < data.length) {
    results.next = {
        page: page + 1,
        limit: limit
    };
}

if (startIndex > 0) {
    results.previous  = {
        page: page - 1,
        limit: limit
    };
}

return {next:results.next,previous:results.previous,data:data.slice(startIndex, endIndex)}

}