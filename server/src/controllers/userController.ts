import { Request, Response } from "express";

export const getUser = (req: Request, res: Response): void => {
  res.json(req.user);
};
