import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";

export async function getUserById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await userService.findUserById(Number(req.params.id));
        res.status(200).json({
            message: "Successfully fetched user",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await userService.updateUser({
            id: Number(req.params.id),
            data: req.body,
        });
        res.status(200).json({
            message: "Successfully updated user",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await userService.findUserByEmail(req.body.email);
        res.status(200).json({
            message: "Successfully fetched user by email",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
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
