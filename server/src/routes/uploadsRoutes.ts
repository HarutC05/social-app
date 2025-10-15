import { Router, Request, Response, NextFunction } from "express";
import upload from "../../uploads/upload";

const router = Router();

router.post(
    "/",
    upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file)
                return res.status(400).json({ message: "No file uploaded" });
            const filename = req.file.filename;
            const protocol = req.protocol;
            const host = req.get("host");
            const url = `${protocol}://${host}/uploads/${filename}`;
            return res.status(200).json({ url });
        } catch (err) {
            next(err);
        }
    }
);

export { router as uploadsRoutes };
