import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { hashPassword, comparePassword } from "../utils/hash";
import path from "path";

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

export async function getUserById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await userService.findUserById(Number(req.params.id));
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "Successfully fetched user",
            data: { ...user, avatar_url: user.avatar_url || DEFAULT_AVATAR },
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

        res.status(200).json({
            message: "Successfully updated user",
            data: { ...user, avatar_url: user.avatar_url || DEFAULT_AVATAR },
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

        const avatar_url = `/uploads/avatars/${req.file.filename}`;
        const user = await userService.updateUser({
            id: Number(req.params.id),
            data: { avatar_url },
        });

        res.status(200).json({
            message: "Avatar uploaded successfully",
            avatar_url: user.avatar_url || DEFAULT_AVATAR,
        });
    } catch (error) {
        next(error);
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

        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: "Missing password fields" });
            return;
        }

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
        res.status(200).json({
            message: "Successfully fetched user by email",
            data: { ...user, avatar_url: user?.avatar_url || DEFAULT_AVATAR },
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
