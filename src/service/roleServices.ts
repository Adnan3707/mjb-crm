import RoleModel, { RoleLayout } from "../model/role.Model";
import { paginate } from "../utils/paginator";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constant/messages/lead";

/**
 * Creates a new leaddetails with the provided payload.
 * @param payload - The payload for creating a lead details.
 * @returns The created lead details.
 */
export async function create(payload: RoleLayout) {
    const RoleDetails = await RoleModel.create(payload);
    return RoleDetails;
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
 export async function getAllProductDetails() {
    const RoleDetails = await RoleModel.find().lean().exec();
    return RoleDetails;
}

export async function getProductDetailsById(product_id: string) {
    const RoleDetails = await RoleModel.findOne({ _id: product_id })
    return RoleDetails;
}
export async function updateRole(lead_id: string, payload: RoleLayout) {
    const RoleDetails = await RoleModel.updateOne({ _id: lead_id }, payload);
    if (RoleDetails.modifiedCount > 0) {
        return SUCCESS_MESSAGE.LEAD_UPDATED;
    }
    throw new Error(ERROR_MESSAGE.LEAD_UPDATE_FAILED);
}

/**
 * Delete lead
 * @param leadId The ID of the lead to delete
 * @returns A success message if the delete was successful, otherwise throws an error
 */
export async function deleteRole(lead_id: string) {
    const deleteRole = await RoleModel.deleteOne({ _id: lead_id })
    if (deleteRole.deletedCount > 0) {
        return SUCCESS_MESSAGE.LEAD_DELETED;
    }
    throw new Error(ERROR_MESSAGE.LEAD_DELETE_FAILED);
}