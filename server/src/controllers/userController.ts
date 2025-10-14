import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import path from "path";

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

function fullUrlFor(req: Request, avatarPath?: string | null) {
    if (!avatarPath) return DEFAULT_AVATAR;
    if (avatarPath.startsWith("http")) return avatarPath;
    const protocol = req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}${avatarPath}`;
}

export async function getUserById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await userService.findUserById(Number(req.params.id));
        if (!user) return res.status(404).json({ message: "User not found" });
        const avatar_url = fullUrlFor(req, user.avatar_url ?? null);
        res.status(200).json({
            message: "Successfully fetched user",
            data: { ...user, avatar_url },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await userService.updateUser({
            id: Number(req.params.id),
            data: req.body,
        });
        const avatar_url = fullUrlFor(req, user.avatar_url ?? null);
        res.status(200).json({
            message: "Successfully updated user",
            data: { ...user, avatar_url },
        });
    } catch (error) {
        next(error);
    }
}

export async function uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.file)
            return res.status(400).json({ message: "No file uploaded" });
        const avatar_path = `/uploads/avatars/${req.file.filename}`;
        const user = await userService.updateUser({
            id: Number(req.params.id),
            data: { avatar_url: avatar_path },
        });
        const avatar_url = fullUrlFor(req, user.avatar_url ?? null);
        res.status(200).json({
            message: "Avatar uploaded successfully",
            data: { avatar_url },
        });
    } catch (err) {
        next(err);
    }
}

export async function changePassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = Number(req.params.id);
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword)
            return res.status(400).json({ message: "Missing password fields" });
        await userService.changePassword(userId, currentPassword, newPassword);
        res.status(200).json({ message: "Password updated", data: null });
    } catch (error) {
        next(error);
    }
}

export async function getUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await userService.findUserByEmail(req.params.email);
        const avatar_url = user
            ? fullUrlFor(req, user.avatar_url ?? null)
            : DEFAULT_AVATAR;
        res.status(200).json({
            message: "Successfully fetched user by email",
            data: { ...user, avatar_url },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await userService.deleteUser(Number(req.params.id));
        res.status(200).json({
            message: "Successfully deleted user",
            data: null,
        });
    } catch (error) {
        next(error);
    }
}
