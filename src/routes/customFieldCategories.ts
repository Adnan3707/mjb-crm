import express from "express"
import e, { NextFunction, Request, Response } from 'express';
import { getAllCategories, createCustomFieldCategory } from "../controller/customFieldCategories"
import CustomFieldCategory from "../model/customFieldCategories"

const customFieldCatergoryRouter = express.Router()

customFieldCatergoryRouter.get("/custom_field_categories", getAllCategories)
customFieldCatergoryRouter.post("/custom_field_category", createCustomFieldCategory)
customFieldCatergoryRouter.delete("/custom_field_category/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id; // Get the id from the request parameters
        await CustomFieldCategory.deleteOne({ _id: id }); // Assuming _id is the property for the id field in your model
        res.status(200).json({ "msg": "deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

export default customFieldCatergoryRouter;