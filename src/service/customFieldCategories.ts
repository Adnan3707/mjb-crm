import CustomFieldCategory, { ICustomFieldCategory } from "../model/customFieldCategories";
// @ts-ignore
async function getAll() {
    const categories = await CustomFieldCategory.find()
    return categories
}

async function createCustomFieldCategory(payload: ICustomFieldCategory) {
    const docCounts = await CustomFieldCategory.findOne().sort('-id');
    const newId = docCounts ? docCounts.id + 1 : 1;

    const category = await CustomFieldCategory.create({ ...payload, id: newId })
    return category;
}

async function getByName(name:string) {
    const categories = await CustomFieldCategory.findOne({category_name:name})
    return categories?._id.toString().substring(0, 24);
}



export { getAll, createCustomFieldCategory,getByName }