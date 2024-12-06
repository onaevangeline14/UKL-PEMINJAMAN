import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";

export const verifyToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    return response
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const secretKey = SECRET || "";
    const decoded = verify(token, secretKey) as {
      id: string;
      name: string;
      username: string;
      role: string;
    };
    (request as any).user = decoded;
    next();
  } catch (error) {
    return response.status(401).json({ message: "Invalid Token" });
  }
};

export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(403).json({ message: "No User Information Available" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(
          ", "
        )}.`,
      });
    }

    next();
  };
};
