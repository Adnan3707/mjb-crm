import { paginate } from "../utils/paginator";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constant/messages/lead";
import Source , {ISource} from "../model/source";

export async function create(payload: ISource) {
    const source = await Source.create(payload);
    return source;
}

export async function fetchAllSource() {
    const sources = await Source.find().sort({ name: 1 }).lean().exec();
    return sources;
}
export async function deleteSource(lead_id: string) {
const deleteSource = await Source.deleteOne({ _id: lead_id })
if (deleteSource.deletedCount > 0) {
    return SUCCESS_MESSAGE.SOURCE_DELETED;
}
throw new Error(ERROR_MESSAGE.LEAD_DELETE_FAILED);
}
export async function updateSource(lead_id: string, payload: ISource) {
    const ProductDetails = await Source.updateOne({ _id: lead_id }, payload);
    if (ProductDetails.modifiedCount > 0) {
        return "Source Updated successfully";
    }
    throw new Error(ERROR_MESSAGE.PRODUCT_UPDATE_FAILED);
}