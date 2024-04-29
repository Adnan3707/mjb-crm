import { Request } from 'express';
import multer from 'multer'

export const multerMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req: Request, file: any, cb: any) => {
        // Implement any file filter logic if needed
        cb(null, true);
    },
    limits: { fileSize: 8000000 }
});