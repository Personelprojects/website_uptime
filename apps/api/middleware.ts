import type { NextFunction, Request, Response } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return; // Ensure it doesn't continue execution
  }

  // Simulate user authentication (Replace this with actual JWT decoding logic)
  req.userId = "6"; // 👈 This might need a type fix (explained below)

  next();
}
