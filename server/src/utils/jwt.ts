import jwt, { Secret, SignOptions } from "jsonwebtoken";

function getAccessSecret(): string {
    const s = process.env.JWT_ACCESS_SECRET;
    if (!s) throw new Error("JWT_ACCESS_SECRET not defined in env");
    return s;
}

function getRefreshSecret(): string {
    const s = process.env.JWT_REFRESH_SECRET;
    if (!s) throw new Error("JWT_REFRESH_SECRET not defined in env");
    return s;
}

const JWT_ACCESS_SECRET: Secret = getAccessSecret();
const JWT_REFRESH_SECRET: Secret = getRefreshSecret();

const ACCESS_TOKEN_EXPIRES_IN = (process.env.ACCESS_TOKEN_EXPIRES_IN ||
    "15m") as SignOptions["expiresIn"];
const REFRESH_TOKEN_EXPIRES_IN = (process.env.REFRESH_TOKEN_EXPIRES_IN ||
    "7d") as SignOptions["expiresIn"];

export interface JwtPayload {
    id: number;
    email: string;
    tokenId?: string;
}

export function signAccessJwt(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRES_IN };
    return jwt.sign(payload as object, JWT_ACCESS_SECRET, options);
}

export function signRefreshJwt(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRES_IN };
    return jwt.sign(payload as object, JWT_REFRESH_SECRET, options);
}

export function verifyAccessJwt<T extends object = JwtPayload>(
    token: string
): T {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    if (!decoded || typeof decoded === "string")
        throw new Error("Invalid access token payload");
    return decoded as T;
}

export function verifyRefreshJwt<T extends object = JwtPayload>(
    token: string
): T {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    if (!decoded || typeof decoded === "string")
        throw new Error("Invalid refresh token payload");
    return decoded as T;
}
