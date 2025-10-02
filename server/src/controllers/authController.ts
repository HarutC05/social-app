import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { JwtPayload } from "../utils/jwt";

const COOKIE_MAX_AGE = 1000 * 60 * 60;

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { user, token } = await authService.registerUser(req.body);

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: COOKIE_MAX_AGE,
        });

        res.status(201).json({
            message: "Successfully registered",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { user, token } = await authService.loginUser(req.body);

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: COOKIE_MAX_AGE,
        });

        res.status(200).json({ message: "Successfully logged in", data: user });
    } catch (error) {
        next(error);
    }
}

export async function logout(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({
            message: "Successfully logged out",
            data: null,
        });
    } catch (error) {
        next(error);
    }
}

export async function getMe(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const payload = req.user as JwtPayload;

        const user = await authService.getCurrentUser(payload);

        res.status(200).json({
            message: "Fetched current user",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}
