import jwt, { Secret, SignOptions } from "jsonwebtoken";

function getAccessSecret(): string {
    const s = process.env.JWT_ACCESS_SECRET;
    if (!s) throw new Error("JWT_ACCESS_SECRET not defined in env");
    return s;
}

const JWT_ACCESS_SECRET: Secret = getAccessSecret();
const ACCESS_TOKEN_EXPIRES_IN = (process.env.ACCESS_TOKEN_EXPIRES_IN ||
    "1h") as SignOptions["expiresIn"];

export interface JwtPayload {
    id: number;
    email: string;
}

export function signJwt(payload: JwtPayload): string {
    try {
        const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRES_IN };

        return jwt.sign(payload as object, JWT_ACCESS_SECRET, options);
    } catch {
        throw new Error("Could not sign JWT");
    }
}

export function verifyJwt<T extends object = JwtPayload>(token: string): T {
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        if (!decoded || typeof decoded === "string") {
            throw new Error("Invalid token payload");
        }
        return decoded as T;
    } catch {
        throw new Error("JWT verification failed");
    }
}
