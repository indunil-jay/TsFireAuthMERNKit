import { Request, Response, NextFunction } from "express";

export const signup = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  res.status(200).json({ status: "success", message: "end point is working" });
};
