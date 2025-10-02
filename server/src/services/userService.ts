import prisma from "../models";

interface UpdateUserInput {
    id: number;
    data: Partial<{
        username: string;
        email: string;
        bio: string;
        avatar_url: string;
    }>;
}

interface AuthenticatedUser {
    id: number;
    username: string;
    email: string;
    bio?: string | null;
    avatar_url?: string | null;
}

class UserService {
    public async findUserById(
        userId: number
    ): Promise<AuthenticatedUser | null> {
        try {
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
        } catch (error) {
            throw new Error(`Failed to find user by ID: ${error}`);
        }
    }

    public async updateUser({
        id,
        data,
    }: UpdateUserInput): Promise<AuthenticatedUser> {
        try {
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
        } catch (error) {
            throw new Error(`Failed to update user: ${error}`);
        }
    }

    public async findUserByEmail(
        email: string
    ): Promise<AuthenticatedUser | null> {
        try {
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
        } catch (error) {
            throw new Error(`Failed to find user by email: ${error}`);
        }
    }

    public async deleteUser(userId: number): Promise<AuthenticatedUser> {
        try {
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
        } catch (error) {
            throw new Error(`Error deleting user: ${error}`);
        }
    }
}

export const userService = new UserService();
