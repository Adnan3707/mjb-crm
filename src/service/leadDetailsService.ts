import LeadDetails, { ILeadDetails } from "../model/leadDetails";
import { paginate } from "../utils/paginator";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constant/messages/lead";
import mongoose, { Types } from "mongoose";

/**
 * Creates a new leaddetails with the provided payload.
 * @param payload - The payload for creating a lead details.
 * @returns The created lead details.
 */
export async function create(payload: ILeadDetails) {
    const leadDetails = await LeadDetails.create(payload);
    return leadDetails;
}
/** 
 *Fetch all lead details With Pagination
 * @param page The page number
 * @param limit The number of results per page
 * @param search The search string
 * @param sortBy The field to sort by
 * @param sortOrder The sort order ("asc" or "desc")
 * @returns Lead details
 */
 export async function getAllLeadDetails(page: number, limit: number, search?: string, searchFields?: string[], sortBy?: string, sortOrder?: string) {
    const leadDetails = await paginate({ collection: LeadDetails, aggregation: [], page, limit, search, sortBy, sortOrder, searchFields })
    return leadDetails;
}
export async function getLeadDetailsById(lead_id: string) {
    const leadDetails = await LeadDetails.aggregate([
        {
            $match: {
                lead_id: new mongoose.Types.ObjectId(lead_id) // Convert lead_id to ObjectId
            }

        },
        {
            $sort: { date_time: -1 }
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

    ]);

    return leadDetails;
}