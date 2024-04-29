import StatusModel, { StatusLayout } from "../model/status.Model";
import { paginate } from "../utils/paginator";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constant/messages/lead";

/**
 * Creates a new leaddetails with the provided payload.
 * @param payload - The payload for creating a lead details.
 * @returns The created lead details.
 */
export async function create(payload: StatusLayout) {
    const StatusDetails = await StatusModel.create(payload);
    return StatusDetails;
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
 export async function getAllStatusDetails() {
    const StatusDetails = await StatusModel.find().sort({ status: 1 }).lean().exec();
    return StatusDetails;
}

export async function getStatusDetailsById(product_id: string) {
    const StatusDetails = await StatusModel.findOne({ _id: product_id })
    return StatusDetails;
}
export async function updateStatus(lead_id: string, payload: StatusLayout) {
    const StatusDetails = await StatusModel.updateOne({ _id: lead_id }, payload);
    if (StatusDetails.modifiedCount > 0) {
        return SUCCESS_MESSAGE.LEAD_UPDATED;
    }
    throw new Error(ERROR_MESSAGE.LEAD_UPDATE_FAILED);
}

/**
 * Delete lead
 * @param leadId The ID of the lead to delete
 * @returns A success message if the delete was successful, otherwise throws an error
 */
export async function deleteStatus(lead_id: string) {
    const deleteStatus= await StatusModel.deleteOne({ _id: lead_id })
    if (deleteStatus.deletedCount > 0) {
        return SUCCESS_MESSAGE.LEAD_DELETED;
    }
    throw new Error(ERROR_MESSAGE.LEAD_DELETE_FAILED);
}