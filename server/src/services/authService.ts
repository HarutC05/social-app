import prisma from "../models";
import { signAccessJwt, JwtPayload } from "../utils/jwt";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const REFRESH_TOKEN_EXPIRY_DAYS = Number(
    process.env.REFRESH_TOKEN_EXPIRY_DAYS || 7
);

function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

async function generateTokens(userId: number, email: string) {
    const rawRefreshToken = crypto.randomBytes(48).toString("hex");
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(
        Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    const refreshRecord = await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
        },
    });

    const accessToken = signAccessJwt({
        id: userId,
        email,
        tokenId: refreshRecord.id.toString(),
    });

    return { accessToken, refreshToken: rawRefreshToken };
}

interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

class AuthService {
    public async registerUser(data: RegisterInput) {
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { username: data.username }] },
        });
        if (existing) throw new Error("Email or username already in use");

        const password_hash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: { username: data.username, email: data.email, password_hash },
            select: {
                id: true,
                username: true,
                email: true,
                avatar_url: true,
                bio: true,
            },
        });

        const tokens = await generateTokens(user.id, user.email);
        return { user, ...tokens };
    }

    public async loginUser(data: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) throw new Error("Invalid credentials");

        const valid = await bcrypt.compare(data.password, user.password_hash);
        if (!valid) throw new Error("Invalid credentials");

        const tokens = await generateTokens(user.id, user.email);
        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar_url,
            bio: user.bio,
        };
        return { user: safeUser, ...tokens };
    }

    public async getMe(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                avatar_url: true,
                bio: true,
            },
        });

        if (!user) throw new Error("User not found");
        return user;
    }

    public async refreshTokens(rawRefreshToken: string) {
        if (!rawRefreshToken) throw new Error("No refresh token");

        const hashed = hashToken(rawRefreshToken);

        const stored = await prisma.refreshToken.findFirst({
            where: { tokenHash: hashed },
        });
        if (!stored) throw new Error("Invalid refresh token");
        if (stored.expiresAt < new Date()) {
            await prisma.refreshToken.delete({ where: { id: stored.id } });
            throw new Error("Refresh token expired");
        }

        const user = await prisma.user.findUnique({
            where: { id: stored.userId },
        });
        if (!user) throw new Error("User not found");

        await prisma.refreshToken.delete({ where: { id: stored.id } });

        const tokens = await generateTokens(user.id, user.email);
        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar_url,
            bio: user.bio,
        };
        return { user: safeUser, ...tokens };
    }

    public async logoutUser(rawRefreshToken?: string) {
        if (!rawRefreshToken) return;
        const hashed = hashToken(rawRefreshToken);
        await prisma.refreshToken.deleteMany({ where: { tokenHash: hashed } });
    }
}

export const authService = new AuthService();
