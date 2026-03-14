import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const secret: jwt.Secret = JWT_SECRET;

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function createToken(
  payload: TokenPayload,
  expiresIn: number | string = "1h",
): string {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return { id: decoded.id, email: decoded.email, role: decoded.role };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
}
