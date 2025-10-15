import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";

const COOKIE_MAX_AGE_ACCESS = 1000 * 60 * 15;
const COOKIE_MAX_AGE_REFRESH = 1000 * 60 * 60 * 24 * 7;

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

function fullUrlFor(req: Request, avatarPath?: string | null) {
    if (!avatarPath) return DEFAULT_AVATAR;
    if (avatarPath.startsWith("http")) return avatarPath;
    const protocol = req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}${avatarPath}`;
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
            maxAge: COOKIE_MAX_AGE_ACCESS,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE_REFRESH,
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
            maxAge: COOKIE_MAX_AGE_ACCESS,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE_REFRESH,
        });
        res.status(200).json({ message: "Successfully logged in", data: user });
    } catch (error) {
        next(error);
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const rawRefresh = (req as any).cookies?.refreshToken;
        await authService.logoutUser(rawRefresh);
        res.clearCookie("accessToken", { path: "/" });
        res.clearCookie("refreshToken", { path: "/" });
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
        const rawRefresh = (req as any).cookies?.refreshToken;
        if (!rawRefresh)
            return res.status(401).json({ message: "No refresh token" });
        const { user, accessToken, refreshToken } =
            await authService.refreshTokens(rawRefresh);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE_ACCESS,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE_REFRESH,
        });
        res.status(200).json({ message: "Tokens refreshed", data: user });
    } catch (error) {
        next(error);
    }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
    try {
        const authUser = (req as any).user;
        if (!authUser || !authUser.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await authService.getMe(authUser.id);
        const avatar_url = fullUrlFor(req, user.avatar_url ?? null);

        res.status(200).json({
            message: "Fetched current user",
            data: { ...user, avatar_url },
        });
    } catch (error) {
        next(error);
    }
}
