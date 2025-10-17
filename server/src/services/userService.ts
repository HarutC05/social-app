import prisma from "../models";
import { hashPassword, comparePassword } from "../utils/hash";

interface UpdateUserInput {
    id: number;
    data: Partial<{
        username: string;
        email: string;
        bio: string;
        avatar_url: string | null;
    }>;
}

interface AuthenticatedUser {
    id: number;
    username: string;
    email: string;
    bio?: string | null;
    avatar_url?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}

interface GetUsersOptions {
    page?: number;
    limit?: number;
}

class UserService {
    public async findUserById(
        userId: number
    ): Promise<AuthenticatedUser | null> {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatar_url: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    public async updateUser({
        id,
        data,
    }: UpdateUserInput): Promise<AuthenticatedUser> {
        return await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatar_url: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    public async changePassword(
        userId: number,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        const isMatch = await comparePassword(
            currentPassword,
            user.password_hash
        );
        if (!isMatch) throw new Error("Current password is incorrect");

        const hashed = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password_hash: hashed },
        });
    }

    public async findUserByEmail(
        email: string
    ): Promise<AuthenticatedUser | null> {
        return await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatar_url: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    public async deleteUser(userId: number): Promise<AuthenticatedUser> {
        await prisma.like.deleteMany({ where: { userId } });
        await prisma.comment.deleteMany({ where: { authorId: userId } });
        await prisma.post.deleteMany({ where: { authorId: userId } });
        await prisma.refreshToken.deleteMany({ where: { userId } });

        return await prisma.user.delete({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatar_url: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    public async getUsers(
        options?: GetUsersOptions
    ): Promise<{ users: AuthenticatedUser[]; total: number }> {
        const page = options?.page && options.page > 0 ? options.page : 1;
        const limit = options?.limit && options.limit > 0 ? options.limit : 10;
        const skip = (page - 1) * limit;

        const [total, users] = await Promise.all([
            prisma.user.count(),
            prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    bio: true,
                    avatar_url: true,
                    created_at: true,
                    updated_at: true,
                },
                orderBy: { created_at: "desc" },
                skip,
                take: limit,
            }),
        ]);

        return { users, total };
    }

    public async countUsers(): Promise<number> {
        return await prisma.user.count();
    }
}

export const userService = new UserService();
