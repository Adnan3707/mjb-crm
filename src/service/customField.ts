import { Types } from "mongoose";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constant/messages/customField";
import CustomField, { ICustomField } from "../model/custom_fields";
import { getbyName } from "../controller/customFieldCategories";

async function getAllCustomFields(search?: string) {

    if (!search) {
        const customFields = await CustomField.aggregate([
            {
                $lookup: {
                    from: "custom_field_categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            }
        ])
        return customFields
    }
    const customFields = await CustomField.aggregate([
        {
            $match: {
                applies_to: { $regex: new RegExp(search, 'i') },
            },
        },
        {
            $lookup: {
                from: "custom_field_categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        }
    ])
    return customFields;
}


async function getCustomField(customFieldId: string) {
    const customField = await CustomField.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(customFieldId)
            },

        }, {
            $lookup: {
                from: "custom_field_categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        }

    ])

    return customField
}


async function createCustomField(payload: ICustomField) {
    payload.applies_to = 'New Lead'
    const customField = await CustomField.create(payload);
    return customField;
}


async function updateCustomField(customFieldId: string, payload: ICustomField) {
    // console.log(await getbyName(payload.category))
    payload.category =  await getbyName(payload.category) as string
    const customField = await CustomField.updateOne({ _id: customFieldId }, payload);
    if (customField.modifiedCount > 0) {
        return SUCCESS_MESSAGE.CUSTOM_FIELD_UPDATED;
    }
    throw new Error(ERROR_MESSAGE.CUSTOM_FIELD_UPDATE_FAILED);
}


async function deleteCustomField(customFieldId: string) {
    const deleteCustomField = await CustomField.deleteOne({ _id: new Types.ObjectId(customFieldId) });
    if (deleteCustomField.deletedCount > 0) {
        return SUCCESS_MESSAGE.CUSTOM_FIELD_DELETED;
    }
    throw new Error(ERROR_MESSAGE.CUSTOM_FIELD_DELETE_FAILED);
}


export {
    getAllCustomFields, getCustomField, createCustomField, updateCustomField, deleteCustomField
}