import { Request, Response, NextFunction } from "express";
import { verifyJwt, JwtPayload } from "../utils/jwt";

function getTokenFromRequest(req: Request): string | undefined {
    const cookieToken = (req as any).cookies?.accessToken;
    if (cookieToken) return cookieToken;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return undefined;
}

export function auth(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            res.status(401).json({ message: "No token found" });
            return;
        }

        const payload = verifyJwt<JwtPayload>(token);

        if (!payload || typeof payload === "string") {
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }

        (req as Request & { user?: JwtPayload }).user = payload;

        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
}
