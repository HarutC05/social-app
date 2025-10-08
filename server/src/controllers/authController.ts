import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { JwtPayload } from "../utils/jwt";

const COOKIE_MAX_AGE = 1000 * 60 * 60;
const REFRESH_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { user, accessToken, refreshToken } =
            await authService.registerUser(req.body);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: REFRESH_COOKIE_MAX_AGE,
        });

        res.status(201).json({
            message: "Successfully registered",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { user, accessToken, refreshToken } = await authService.loginUser(
            req.body
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: REFRESH_COOKIE_MAX_AGE,
        });

        res.status(200).json({ message: "Successfully logged in", data: user });
    } catch (error) {
        next(error);
    }
}

export async function logout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        try {
            const token = (req as any).cookies?.refreshToken;
            if (token) {
            }
            if (req.user) {
                await authService.revokeAllRefreshTokensForUser(req.user.id);
            }
        } catch (_) {}

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        res.status(200).json({
            message: "Successfully logged out",
            data: null,
        });
    } catch (error) {
        next(error);
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = (req as any).cookies?.refreshToken;
        if (!refreshToken)
            return res.status(401).json({ message: "No refresh token" });

        const {
            accessToken,
            refreshToken: newRefresh,
            user,
        } = await authService.refreshToken(refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
        });

        res.cookie("refreshToken", newRefresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: REFRESH_COOKIE_MAX_AGE,
        });

        res.status(200).json({ message: "Token refreshed", data: user });
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
        res.status(200).json({ message: "Fetched current user", data: user });
    } catch (error) {
        next(error);
    }
}
