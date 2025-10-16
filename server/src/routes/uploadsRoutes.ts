import { Router } from "express";
import multer from "multer";
import upload from "../../uploads/upload";

const router = Router();

router.post("/", (req, res) => {
    upload.single("file")(req as any, res as any, (err?: any) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                console.error("MulterError:", err.code, err.message);
                return res
                    .status(400)
                    .json({ success: false, message: err.message });
            }
            console.error("Upload middleware error:", err);
            return res
                .status(500)
                .json({ success: false, message: "Upload failed" });
        }

        try {
            const reqFile = (req as any).file;
            if (!reqFile) {
                return res
                    .status(400)
                    .json({ success: false, message: "No file uploaded" });
            }

            const filename = reqFile.filename;
            const protocol = req.protocol;
            const host = req.get("host");
            const url = `${protocol}://${host}/uploads/${filename}`;

            return res.status(200).json({ success: true, url });
        } catch (err) {
            console.error("Multer/Route Error:", err);
            return res
                .status(500)
                .json({ success: false, message: "Server error" });
        }
    });
});

export { router as uploadsRoutes };
