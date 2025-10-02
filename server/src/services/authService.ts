import prisma from "../models";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";
import { JwtPayload } from "../utils/jwt";

interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

interface UserSafe {
    id: number;
    username: string;
    email: string;
}

interface AuthResult {
    user: UserSafe;
    token: string;
}

class AuthService {
    public async registerUser(data: RegisterInput): Promise<AuthResult> {
        try {
            const hashed = await hashPassword(data.password);

            const newUser = await prisma.user.create({
                data: {
                    username: data.username,
                    email: data.email,
                    password_hash: hashed,
                },
            });

            const token = signJwt({ id: newUser.id, email: newUser.email });

            const { password_hash, ...safeUser } = newUser;
            return { user: safeUser, token };
        } catch (error) {
            throw new Error(`Failed to register user: ${error}`);
        }
    }

    public async loginUser(data: LoginInput): Promise<AuthResult> {
        try {
            const user = await prisma.user.findUnique({
                where: { email: data.email },
            });
            if (!user) throw new Error("User not found");

            const isMatch = await comparePassword(
                data.password,
                user.password_hash
            );
            if (!isMatch) throw new Error("Invalid credentials");

            const token = signJwt({ id: user.id, email: user.email });

            const { password_hash, ...safeUser } = user;
            return { user: safeUser, token };
        } catch (error) {
            throw new Error(`Failed to login user: ${error}`);
        }
    }

    public async getCurrentUser(payload: JwtPayload) {
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatar_url: true,
            },
        });

        if (!user) throw new Error("User not found");
        return user;
    }
}

export const authService = new AuthService();
