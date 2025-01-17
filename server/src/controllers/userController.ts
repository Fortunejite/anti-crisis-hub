import { Request, Response } from "express";

export const getUser = (req: Request, res: Response): void => {
  res.send({ message: "User fetched successfully" });
};
