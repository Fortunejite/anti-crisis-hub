import { object, string } from 'zod';
import { NextFunction, Request, Response } from 'express';
import RequestModel from '@/models/Request';

const RequestBodySchema = object({
  resource: string({ message: 'Resource is required' }),
});

export const createRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requestBody = RequestBodySchema.parse(req.body);
    const request = new RequestModel({ seeker: req.user?.id, ...requestBody });
    await request.save();
    res.status(201).json({ message: 'Request made successfully' });
  } catch (e) {
    next(e);
  }
};

export const fetchRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { query } = req;
  // paginations
  const page = Number(query['page']) || 1;
  const limit = Number(query['limit']) || 10;
  const skip = (page - 1) * limit;

  try {
    const requests = await RequestModel.find({ seeker: req.user?.id })
      .skip(skip)
      .limit(limit)
      .populate('resource');

    res.json(requests);
  } catch (e) {
    next(e);
  }
};

export const fetchResourceRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { query, params } = req;
  // paginations
  const page = Number(query['page']) || 1;
  const limit = Number(query['limit']) || 10;
  const skip = (page - 1) * limit;

  const resource = params['resource'];
  try {
    const requests = await RequestModel.find({ resource })
      .skip(skip)
      .limit(limit)
      .populate('resource');

    res.json(requests);
  } catch (e) {
    next(e);
  }
};

export const approveRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { params } = req;
  const resource = params['resource'];

  try {
    await RequestModel.findOneAndUpdate({ resource }, { status: 'Fulfilled' });
    res.json({ message: 'Approved' });
  } catch (e) {
    next(e);
  }
};
