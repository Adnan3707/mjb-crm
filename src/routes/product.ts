import Express from "express"
import * as productController from "../controller/product.controller";
import { validateCreateProduct  } from "../helper/validator";
import * as auth from "../helper/jwt";

const productRoute = Express.Router();
productRoute.use(auth.verifyjwt)

productRoute.get('/product/getAllProduct',productController.allProduct)
productRoute.post('/product/create',productController.createProduct)
productRoute.get('/product/:id',productController.ProductByid)
productRoute.put('/product/update/:id',productController.updateProduct)
productRoute.delete('/product/delete/:id', productController.deleteProduct);
export default productRoute;