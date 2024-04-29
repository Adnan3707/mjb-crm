import Lead, { ILead ,calendarJobFilter} from "../model/lead";
import StatusModel from "../model/status.Model";
import Status ,{StatusLayout}from "../model/status.Model";
import { DateTime } from "luxon";

import { paginate } from "../utils/paginator";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constant/messages/lead";
import moment from "moment/moment";
import mongoose, { Types } from "mongoose";
import Storage from "../utils/storage";
import { log } from "console";
import { ObjectId } from "mongodb";
import LeadDetails, { ILeadDetails } from "../model/leadDetails";
import User,{IUser} from "../model/user";
import ProductModel,{ProductLayout} from "../model/product.Model";
import Source,{ISource} from "../model/source";
import RoleModel from "../model/role.Model";
import * as notificationService from "../service/reminderServices";
import { OPERATION_TYPES } from "../constant/types";



/**
 * Creates a new lead with the provided payload.
 * @param payload - The payload for creating a new lead.
 * @returns The created lead.
 */

export async function create(payload: ILead) {
  
  interface statusI {
    status:string ;
  } 

  let status:statusI  | null = { status: '' };
  let allStatus:StatusLayout[] | null = await Status.find();
  status = await StatusModel.findById(payload.status_id)  ;
  allStatus.forEach((ele )=>{
    if(status && status.status == ele.status){
      (payload as any)[ele.status.replace(/[ \/]/g, '_') as string+`_date`] = new Date();
    }
  })
  if(payload.reminderAt.toString() === 'Invalid Date'){
payload.reminderAt = new Date() ;
  }
    const lead = await Lead.create(payload);

    await LeadDetails.create({
        user_id: payload.user_id, // Assuming user_id is part of the payload
        status_id: payload.status_id, // Assuming status_id is part of the payload
        date_time: payload.updated_date, // Assuming you want to use the current date and time
        lead_id: lead._id, // Using the _id of the newly created Lead
        comments: payload.comments // Assuming comments is part of the payload
    });

    //adding Operation in Crud
    const notification = await notificationService.createNotificationN({lead_id:lead._id.toString(),lead_name:lead?.name?.toString(),rules:'test rule',user_id:payload.loggedIn_user_id,
          operationType:OPERATION_TYPES.CREATE });
    
    return lead;
}
/** 
 *Fetch all leads With Pagination
 * @param page The page number
 * @param limit The number of results per page
 * @param search The search string
 * @param sortBy The field to sort by
 * @param sortOrder The sort order ("asc" or "desc")
 * @returns Leads
 */
  export async function getAllLeads(page: number, limit: number, search?: string, searchFields?: string[], sortBy?: string, sortOrder?: string) {
    const leads = await paginate({ collection: Lead, aggregation: [], page, limit, search, sortBy, sortOrder, searchFields })
    return leads;
}

export async function getLeadById(lead_id: string) {
  try {
      // Aggregate pipeline to join Lead and User collections
      const pipeline = [
          {
              $match: {
                  _id: new mongoose.Types.ObjectId(lead_id) // Convert lead_id to ObjectId
              }
          },
              {
                $lookup: {
                  from: "users",
                  // Name of the User collection
                  localField: "user_id",
                  // Field in Lead collection
                  foreignField: "_id",
                  // Field in User collection
                  as: "user", // Output array field name
                },
              },
              {
                $addFields: {
                  user: {
                    $ifNull: [
                      {
                        $arrayElemAt: ["$user", 0],
                      },
                      "",
                    ],
                  },
                },
              },
              {
                $addFields: {
                  username: {
                    $ifNull: [
                      {
                        $concat: [
                          "$user.first_name",
                          " ",
                          "$user.last_name",
                        ],
                      },
                      "$user.email_id",
                    ],
                  },
                },
                
              },

              {
                  $unset: "user",
                },
      ];

      // Execute the aggregation pipeline
      const result = await Lead.aggregate(pipeline);

      if (result.length === 0) {
          throw new Error("Lead not found");
      }

      return result[0]; // Return the first element of the result array
  } catch (error : any) {
      throw new Error("Error fetching lead: " + error.message);

  }
}
export async function updateLead(lead_id: string, payload: ILead) {
  const previousLead: ILead | null = await Lead.findById(lead_id);

  const lead = await Lead.updateOne({ _id: lead_id }, payload);

  if (lead.modifiedCount > 0) {
      // Calculate the differences between old and new data
      const differences: { [key: string]: { old: any, new: any } } = {};
      if (previousLead) {
          for (const key of Object.keys(payload) as (keyof ILead)[]) {
              const oldValue = previousLead[key];
              const newValue = payload[key];
              if (oldValue instanceof ObjectId && newValue instanceof ObjectId) {
                  if (!oldValue.equals(newValue)) {
                      differences[key] = {
                          old: oldValue.toString(),
                          new: newValue.toString()
                      };
                  }
              } else if (String(oldValue) !== String(newValue)) {
                  differences[key] = {
                      old: String(oldValue),
                      new: String(newValue)
                  };
              }
          }
      }
      // Fetch username and statusname using MongoDB aggregation
      const [oldUser, newUser, oldStatus, newStatus,oldProduct,newProduct,
        oldSource,newSource,oldRole,newRole] = await Promise.all([
          User.aggregate([
              { $match: { _id: previousLead?.user_id } },
              { $project: { username: { $concat: ["$first_name", " ", "$last_name"] } } }
            ]),
          User.aggregate([
              { $match: { _id: new ObjectId(payload?.user_id.toString()) } },
              { $project: { username: { $concat: ["$first_name", " ", "$last_name"] } } }
          ]),
          Status.aggregate([
              { $match: { _id: previousLead?.status_id } },
              { $project: { status: 1 } }
          ]),
          Status.aggregate([
              { $match: { _id: new ObjectId(payload?.status_id.toString()) } },
              { $project: { status: 1 } }
          ]),
          ProductModel.aggregate([
            { $match: { _id: previousLead?.product_id } },
            { $project: { name: 1 } }
        ]),
        ProductModel.aggregate([
          { $match: { _id: new ObjectId(payload?.product_id.toString()) } },
          { $project: { name: 1 } }
      ]),
      Source.aggregate([
        { $match: { _id: previousLead?.source_id } },
        { $project: { name: 1 } }
    ]),
    Source.aggregate([
      { $match: { _id: new ObjectId(payload?.source_id.toString()) } },
      { $project: { name: 1 } }
  ]),
  RoleModel.aggregate([
    { $match: { _id: previousLead?.role_id } },
    { $project: { role: 1 } }
]),
RoleModel.aggregate([
    { $match: { _id: new ObjectId(payload?.role_id.toString()) } },
    { $project: { role: 1 } }
])

]);

      const oldUserUsername = oldUser.length ? oldUser[0].username : null;
      const newUserUsername = newUser.length ? newUser[0].username : null;
      const oldStatusName = oldStatus.length ? oldStatus[0].status : null;
      const newStatusName = newStatus.length ? newStatus[0].status : null;
      const oldProductName = oldProduct.length ? oldProduct[0].name : null;
      const newProductName = oldProduct.length ? newProduct[0].name : null;
      const oldSourceName = oldSource.length ? oldSource[0].name : null;
      const newSourceName = newSource.length ? newSource[0].name : null;
      const oldRoleName = oldRole.length ? oldRole[0].role : null;
      const newRoleName = newRole.length ? newRole[0].role : null;

      // Create LeadDetails record with old_data, new_data, and differences
      await LeadDetails.create({
          user_id: payload.user_id,
          status_id: payload.status_id,
          date_time: payload.updated_date,
          lead_id: lead_id,
          comments: payload.comments,
          old_data: {
              ...convertToPlainObject(previousLead),
              userName: oldUserUsername,
              statusName: oldStatusName,
              productName: oldProductName,
              sourceName: oldSourceName,
              roleName: oldRoleName
          },
          new_data: {
              ...convertToPlainObject(payload),
              userName: newUserUsername,
              statusName: newStatusName,
              productName: newProductName,
              sourceName: newSourceName,
              roleName: newRoleName


          },
          changes: differences, // Convert differences to string before storing
      });
     
      const updatedLead: ILead | null = await Lead.findById(lead_id);
        const updatedName = updatedLead?.name;
const notification = await notificationService.createNotificationN({lead_id:lead_id,lead_name:updatedName?.toString(),rules:'test rule',user_id:payload.loggedIn_user_id,
    operationType:OPERATION_TYPES.UPDATE });

      return SUCCESS_MESSAGE.LEAD_UPDATED;

  
  }
  throw new Error(ERROR_MESSAGE.LEAD_UPDATE_FAILED);
}

function convertToPlainObject(obj: any): any {
      return JSON.parse(JSON.stringify(obj));
  }
/**
 * Delete lead
 * @param leadId The ID of the lead to delete
 * @returns A success message if the delete was successful, otherwise throws an error
 */
export async function deleteLead(lead_id: string) {
    const deleteLead = await Lead.updateOne({ _id: lead_id },
        {
            $set: {
                is_deleted: true,
            }
        });

    if (deleteLead.modifiedCount > 0) {
        return SUCCESS_MESSAGE.LEAD_DELETED;
    }
    throw new Error(ERROR_MESSAGE.LEAD_DELETE_FAILED);
}
/**
 * Get leads by status
 * @param statusId The ID of the status to get the data
 * @returns A success message if the delete was successful, otherwise throws an error
 */
export async function findLeadByStatus(start_date: string, end_date: string, search?: string,productId?: string,userId?: string,sourceId?: string) {
    try {
        const statuses = await Status.find().lean().exec();
        let allStatus:StatusLayout[] | null = await Status.find();
        let data:string[]=allStatus.map(ele=>ele.status);

        const leadsByStatus = await Promise.all(
            statuses.map(async (status: any,i) => {
                const pipeline: any[] = []; // Define the type of pipeline as any[]
                pipeline.push({ $match: { status_id: new ObjectId(status._id),is_deleted: false } });
                  pipeline.push(  {
                      $addFields: {
                        age:{
                          $round: { $divide: [{$subtract: [ new Date(), `$`+`${status.status.replace(/[ \/]/g, '_')}_date` ] },( 24*60*60*1000)]
                        }
                        }
                      } 
                  })

                if (start_date && end_date) {
                    const startOfDay = new Date(start_date);
                    startOfDay.setUTCHours(0, 0, 0, 0); // Set time to the start of the day
                
                    const endOfDay = new Date(end_date);
                    endOfDay.setUTCHours(23, 59, 59, 999); // Set time to the end of the day


                    pipeline.push({
                        $match: {
                            lead_date: {
                                $gte: startOfDay,
                                $lte:endOfDay
                            }
                        }
                    });
                }

            // Add match stage for product ID
        if (productId) {
          pipeline.push({
            $match: {
            product_id: new ObjectId(productId)
            }
        });
        }   
        // ok
            // Add match stage for user ID
            if (userId) {
                pipeline.push({
                  $match: {
                  user_id: new ObjectId(userId)
                  }
              });
              }   
               // Add match stage for sourceId
            if (sourceId) {
              pipeline.push({
                $match: {
                  source_id: new ObjectId(sourceId)
                }
            });
            }  
                // Add match stage for search query
                if (search) {
                    const searchRegex = new RegExp(search, 'i');
                    pipeline.push({
                        $match: {
                            $or: [
                                { name: searchRegex },
                                { mobileNo: searchRegex },
                                { email_id: searchRegex },
                                { contactPerson: searchRegex },
                                { notes: searchRegex }
                            ]
                        }
                    });
                }

                // Lookup product details
                pipeline.push({
                    $lookup: {
                        from: 'products',
                        localField: 'product_id',
                        foreignField: '_id',
                        as: 'product'
                    }
                });
                const leads = await Lead.aggregate(pipeline).exec();

                return { [status.status]: leads };
            })
            
        );
        return leadsByStatus;
    } catch (error) {
        throw error;
    }
}

/**
 * Adds attachments to a lead and updates the `attachment` field.
 * @param {string} lead_id - The unique identifier of the lead to add attachments to.
 * @param {Array<any>} files - An array of file objects containing the attachments to be added.
 * @returns {Promise<{ urls: string[], message: string }>} - A Promise that resolves to an object containing the added attachment URLs and a success message.
 * @throws {Error} - Throws an error if any operation fails.
 */
export async function addAttachment(lead_id: string, files: any): Promise<{ urls: string[]; message: string; }> {
    const storage = Storage.getInstance();
    const urls: Array<string> = []
    for (let file of files) {
      await storage.save(`lead/${lead_id}/attachment/${file.originalname}`, file);
      const url = await storage.getUrl(`lead/${lead_id}/attachment/${file.originalname}`);
      urls.push(url);
    }
    await Lead.updateOne({ _id: new Types.ObjectId(lead_id) }, {
      $push: { 'attachments': { $each: urls } }
    });
    return { urls, message: SUCCESS_MESSAGE.ATTACHMENT_ADDED_SUCCESSFULLY };
  }

  export async function reminder(date:string,id:string) {
    try{
      let data = await  Lead.findOneAndUpdate({_id:id}, { $set: { reminderAt: new Date(date) } }, { new: true })
return data
      } catch (error) {
        throw error;
    }
}
export async function stopReminder(userId :string){
    try{
        let data = await  Lead.updateOne({_id:userId}, { $set: { reminder_viewed: true } })
  return data
        } catch (error) {
          throw error;
      }
}

export async function SalesRep(name:string,product:string,source:string,start_date: string, end_date: string,userId:string) {
  try {
    const pipeline: any[] = []; 
    pipeline.push({
      $match: {
        is_deleted:false
      }
    })
    if (start_date && end_date) {
      const startOfDay = new Date(start_date);
      startOfDay.setUTCHours(0, 0, 0, 0); // Set time to the start of the day
  
      const endOfDay = new Date(end_date);
      endOfDay.setUTCHours(23, 59, 59, 999); // Set time to the end of the day

      pipeline.push({
          $match: {
              lead_date: {
                  $gte: startOfDay,
                  $lte:endOfDay
              }
          }
      });
  }
  if(userId){
    pipeline.push(
      {
        $match: {
          user_id: new Types.ObjectId(userId)
        }
      }
    )
  }
  if(name){
    pipeline.push(  {
      '$lookup': {
        'from': 'users', 
        'localField': 'user_id', 
        'foreignField': '_id', 
        'as': 'user'
      }
    }, {
      '$unwind': '$user'
    }, {
      '$lookup': {
        'from': 'status', 
        'localField': 'status_id', 
        'foreignField': '_id', 
        'as': 'status'
      }
    }, {
      '$unwind': '$status'
    }, {
      '$group': {
        '_id': {
          'email_id': '$user.email_id', 
          'status': '$status.status'
        }, 
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        '_id': 0, 
        'name': '$_id.email_id', 
        'status': '$_id.status', 
        'count': 1
      }
    }, {
      '$sort': {
        'status': 1, 
        'name': 1
      }
    })
  }else if(product){
    pipeline.push( {
      '$lookup': {
        'from': 'products', 
        'localField': 'product_id', 
        'foreignField': '_id', 
        'as': 'product'
      }
    }, {
      '$unwind': '$product'
    }, {
      '$lookup': {
        'from': 'status', 
        'localField': 'status_id', 
        'foreignField': '_id', 
        'as': 'status'
      }
    }, {
      '$unwind': '$status'
    }, {
      '$group': {
        '_id': {
          'productName': '$product.name', 
          'status': '$status.status'
        }, 
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        '_id': 0, 
        'name': '$_id.productName', 
        'status': '$_id.status', 
        'count': 1
      }
    }, {
      '$sort': {
        'name': 1
      }
    })
  }else if (source){
    pipeline.push(
        {
          '$lookup': {
            'from': 'sources', 
            'localField': 'source_id', 
            'foreignField': '_id', 
            'as': 'source'
          }
        }, {
          '$unwind': '$source'
        }, {
          '$lookup': {
            'from': 'status', 
            'localField': 'status_id', 
            'foreignField': '_id', 
            'as': 'status'
          }
        }, {
          '$unwind': '$status'
        }, {
          '$group': {
            '_id': {
              'sourceName': '$source.name', 
              'status': '$status.status'
            }, 
            'count': {
              '$sum': 1
            }
          }
        }, {
          '$project': {
            '_id': 0, 
            'name': '$_id.sourceName', 
            'status': '$_id.status', 
            'count': 1
          }
        }, {
          '$sort': {
            'name': 1
          }
        }
    )
  }
      const result = await Lead.aggregate(pipeline);
      return result; // Return the first element of the result array
  } catch (error : any) {
      throw new Error("Error fetching lead: " + error.message);

  }
}
export async function getStatusWithValue(start_date: string, end_date: string, search?: string,productId?: string,userId?: string,sourceId?: string) {
  try {
    const pipeline: any[] = []; 
    pipeline.push({
      $match: {
        is_deleted:false
      }
    })
         // Add match stage for sourceId
  if (sourceId) {
    pipeline.push({
      $match: {
        source_id: new ObjectId(sourceId)
      }
  });
  }  
      // Add match stage for search query
      if (search) {
          const searchRegex = new RegExp(search, 'i');
          pipeline.push({
              $match: {
                  $or: [
                      { name: searchRegex },
                      { mobileNo: searchRegex },
                      { email_id: searchRegex },
                      { contactPerson: searchRegex },
                      { notes: searchRegex }
                  ]
              }
          });
      }
    if (start_date && end_date) {
      const startOfDay = new Date(start_date);
      startOfDay.setUTCHours(0, 0, 0, 0); // Set time to the start of the day
  
      const endOfDay = new Date(end_date);
      endOfDay.setUTCHours(23, 59, 59, 999); // Set time to the end of the day

      pipeline.push({
          $match: {
              lead_date: {
                  $gte: startOfDay,
                  $lte:endOfDay
              }
          }
      });
    } 
    pipeline.push(
      {
        $addFields: {
          value: {
            $toInt: "$value",
          },
        },
      },
      {
        $group: {
          _id: "$status_id",
          totalValue: {
            $sum: "$value",
          },
        },
      },
      {
        $lookup: {
          from: "status",
          localField: "_id",
          foreignField: "_id",
          as: "name",
        },
      },
      {
        $addFields: {
          name: {
            $arrayElemAt: ["$name", 0],
          },
        },
      },
      {
        $sort:
          /**
           * Provide any number of field/order pairs.
           */
          {
            "name._id": 1,
          },
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            totalValue: "$totalValue",
            name: "$name.status",
          },
      },
    )
    if (userId) {
      pipeline.push({
        $match: {
        user_id: new ObjectId(userId)
        }
    });
    }   

  const leads = await Lead.aggregate(pipeline);
  return leads; 
}catch (error) {
    console.error("Error occurred while aggregating leads:", error);
    throw error; 
  }
}

export async function saveNote(lead_id: string, payload: any, note_id?: string) {
  const storage = Storage.getInstance();
  const _urls: string[] = [];
  if (payload?.files?.length)
    for (let file of payload.files) {
      await storage.save(`lead/${lead_id}/attachment/notes/${file.originalname}`, file);
      const url = await storage.getUrl(`lead/${lead_id}/attachment/notes/${file.originalname}`);
      _urls.push(url);
    }

  if (note_id) {
    let updateQuery: any = {
      $set: {
        "internal_notes.$.text": payload.text,
        "internal_notes.$.updated_by": payload.created_by,
        "internal_notes.$.linked_to": payload.linked_to,
      },
    };

    if (payload?.deletedAttachments?.length) {
      updateQuery = {
        ...updateQuery,
        $pullAll: {
          "internal_notes.$.attachments": payload.deletedAttachments.split(","),
        },
      };
    }

    if (payload?.files?.length) {
      updateQuery = {
        ...updateQuery,
        $push: {
          "internal_notes.$.attachments": { $each: _urls },
        },
      };
    }

    await Lead.updateOne(
      {
        _id: new Types.ObjectId(lead_id),
        "internal_notes._id": new Types.ObjectId(note_id),
      },
      updateQuery
    );

    return SUCCESS_MESSAGE.NOTES_UPDATED_SUCCESSFULLY;
  }

  await Lead.updateOne(
    { _id: new Types.ObjectId(lead_id) },
    {
      $push: {
        internal_notes: {
          text: payload.text,
          created_by: payload.created_by,
          attachments: _urls,
          linked_to: payload.linked_to,
        },
      },
    }
  );

  return SUCCESS_MESSAGE.NOTES_ADDED_SUCCESSFULLY;
}

export async function getCalendarJobs(payload: calendarJobFilter) {
  let aggregation: any[] = [];
  const { start_date, end_date,userId } = payload;
                    const startOfDay = new Date(start_date);
                    startOfDay.setUTCHours(0, 0, 0, 0); // Set time to the start of the day
                
                    const endOfDay = new Date(end_date);
                    endOfDay.setUTCHours(23, 59, 59, 999); // Set time to the end of the day


                    let matches: any = {
                          is_deleted: false,
                            lead_date: {
                                $gte: startOfDay,
                                $lte:endOfDay
                            }
                      };
  if (userId) {
    matches["user_id"] =  new Types.ObjectId(userId);
  }

  aggregation = [
    {
      $match: matches
    }
    ,{
      $lookup: {
        from: "status",
        localField: "status_id",
        foreignField: "_id",
        as: "status",
      },
    }
    ,{
      $lookup: {
        from: "products",
        localField: "product_id",
        foreignField: "_id",
        as: "products",
      }
    }
    ,{
      $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user",
      }
    }
    ,{
    $lookup: {
    from: "roles",
    localField: "role_id",
    foreignField: "_id",
    as: "role",
    },
    }
   ,{
    $project: {
      _id: 1,
      lead_date:1,
      name:1,
     comments:1,
     status:{status:1,color_code:1},
     products:{name:1,description:1},
     user:{"email_id":1,
     "first_name":1,
     "last_name":1},
     role:{role:1}
    },
  }
  ];
  const jobs = await Lead.aggregate(aggregation);
  return jobs;
}

export async function getDetails(status:string,email:string,product:string,source:string) {
  try {
    const pipeline: any[] = []; 
    if(email){
      let {_id} = await User.findOne({email_id:email}) as IUser
        pipeline.push(
          {
            '$match': {
              'is_deleted': false,
              'user_id': _id
            }
          }
        ) 
    }
    if(status){
      pipeline.push(
        {
          '$match': {
            'is_deleted': false,
            'status_id': new Types.ObjectId(status)
          }
        }
      ) 
    }
    if(source){
      let {_id} = await Source.findOne({'name':source}) as ISource
        pipeline.push(
          {
            '$match': {
              'is_deleted': false,
              'source_id': _id
            }
          }
        )
    }
    if(product){
      let {_id} = await ProductModel.findOne({'name':product}) as ProductLayout
      pipeline.push(
        {
          '$match': {
            'is_deleted': false,
            'product_id': _id
          }
        }
      )
    }
    pipeline.push(
      {
        $lookup: {
          from: "status",
          localField: "status_id",
          foreignField: "_id",
          as: "status"
        }
      },
      {
        $unwind: "$status"
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$product"
      },
      {
        $lookup: {
          from: "sources",
          localField: "source_id",
          foreignField: "_id",
          as: "source"
        }
      },
      {
        $unwind: "$source"
      },
      {
        $project: {
          _id: 1,
          name: "$name",
          email_id: "$email_id",
          mobileno: "$mobileno",
          contactperson: "$contactperson",
          status: "$status.status",
          sources: "$source.name",
          value: "$value",
          product: "$product.name",
          mobileNo:'$mobileNo',
          lead_date:'$lead_date'          
        }
      }
    );
    const leads = await Lead.aggregate(pipeline);
    return leads;  
  }catch (error) {
    console.error("Error occurred while aggregating leads:", error);
    throw error; 
  }
}