import ProductModel, { ProductLayout } from "../model/product.Model";
import { paginate } from "../utils/paginator";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constant/messages/lead";

/**
 * Creates a new leaddetails with the provided payload.
 * @param payload - The payload for creating a lead details.
 * @returns The created lead details.
 */
export async function create(payload: ProductLayout) {
    const leadDetails = await ProductModel.create(payload);
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
 export async function getAllProductDetails() {
    const ProductDetails = await ProductModel.find().sort({ name: 1 }).lean().exec();
    return ProductDetails;
}

export async function getProductDetailsById(product_id: string) {
    const ProductDetails = await ProductModel.findOne({ _id: product_id })
    return ProductDetails;
}

export async function updateProduct(lead_id: string, payload: ProductLayout) {
    const ProductDetails = await ProductModel.updateOne({ _id: lead_id }, payload);
    if (ProductDetails.modifiedCount > 0) {
        return SUCCESS_MESSAGE.PRODUCT_UPDATED;
    }
    throw new Error(ERROR_MESSAGE.PRODUCT_UPDATE_FAILED);
}


/**
 * Delete lead
 * @param leadId The ID of the lead to delete
 * @returns A success message if the delete was successful, otherwise throws an error
 */
export async function deleteProduct(lead_id: string) {
    const deleteProduct = await ProductModel.deleteOne({ _id: lead_id })
    if (deleteProduct.deletedCount > 0) {
        return SUCCESS_MESSAGE.LEAD_DELETED;
    }
    throw new Error(ERROR_MESSAGE.LEAD_DELETE_FAILED);
}