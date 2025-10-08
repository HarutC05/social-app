import crypto from "crypto";
import prisma from "../models";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJwt, JwtPayload } from "../utils/jwt";

const REFRESH_TOKEN_EXPIRES_DAYS = 30;
const ACCESS_TOKEN_EXPIRES_SECONDS = 60 * 60;

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
    bio?: string | null;
    avatar_url?: string | null;
}

interface AuthResult {
    user: UserSafe;
    accessToken: string;
    refreshToken?: string;
}

function createRandomToken(): string {
    return crypto.randomBytes(64).toString("hex");
}

function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

class AuthService {
    public async registerUser(data: RegisterInput): Promise<AuthResult> {
        const hashed = await hashPassword(data.password);

        const newUser = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password_hash: hashed,
            },
        });

        const accessToken = signJwt({ id: newUser.id, email: newUser.email });
        const userSafe = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        };

        const refreshPlain = createRandomToken();
        const refreshHash = hashToken(refreshPlain);
        const expiresAt = new Date(
            Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
        );
        await prisma.refreshToken.create({
            data: {
                userId: newUser.id,
                tokenHash: refreshHash,
                expiresAt,
            },
        });

        return { user: userSafe, accessToken, refreshToken: refreshPlain };
    }

    public async loginUser(data: LoginInput): Promise<AuthResult> {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) throw new Error("User not found");

        const isMatch = await comparePassword(
            data.password,
            user.password_hash
        );
        if (!isMatch) throw new Error("Invalid credentials");

        const accessToken = signJwt({ id: user.id, email: user.email });

        const refreshPlain = createRandomToken();
        const refreshHash = hashToken(refreshPlain);
        const expiresAt = new Date(
            Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
        );

        await prisma.refreshToken.create({
            data: { userId: user.id, tokenHash: refreshHash, expiresAt },
        });

        const { password_hash, ...safeUser } = user;
        return {
            user: safeUser as UserSafe,
            accessToken,
            refreshToken: refreshPlain,
        };
    }

    public async refreshToken(refreshTokenPlain: string) {
        const refreshHash = hashToken(refreshTokenPlain);
        const stored = await prisma.refreshToken.findFirst({
            where: { tokenHash: refreshHash },
            include: { user: true },
        });

        if (!stored) throw new Error("Refresh token not found");
        if (stored.expiresAt < new Date()) {
            await prisma.refreshToken.delete({ where: { id: stored.id } });
            throw new Error("Refresh token expired");
        }

        const user = stored.user;
        await prisma.refreshToken.delete({ where: { id: stored.id } });
        const newPlain = createRandomToken();
        const newHash = hashToken(newPlain);
        const newExpires = new Date(
            Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
        );

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: newHash,
                expiresAt: newExpires,
            },
        });

        const accessToken = signJwt({ id: user.id, email: user.email });
        const userSafe = {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio ?? null,
            avatar_url: user.avatar_url ?? null,
        };

        return { accessToken, refreshToken: newPlain, user: userSafe };
    }

    public async revokeAllRefreshTokensForUser(userId: number) {
        await prisma.refreshToken.deleteMany({ where: { userId } });
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
