import CustomError from '@/@types/customError';
import Resource from '@/models/Resource';
import { NextFunction, Request, Response } from 'express';
import { array, date, number, object, string } from 'zod';

const ResourceRequestBodySchema = object({
  type: string({ message: 'Resource type is reqired' }),
  description: string().min(3, {
    message: 'Description must be at least 3 characters',
  }),
  quantity: number({ message: 'Quantity is required' }),
  location: array(number()).length(2, 'Enter a valid location'),
  images: array(string()),
  expirationDate: date().optional(),
});

export const fetchResources = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { query } = req;
  // paginations
  const page = Number(query['page']) || 1;
  const limit = Number(query['limit']) || 10;

  // filters
  const long = Number(query['long']);
  const lat = Number(query['lat']);
  const type = query['type'];

  const radiusInMeters = Number(query['radiusInMeters']);
  console.log(radiusInMeters);

  if (!long || !lat) {
    const error = new CustomError("Person's location is required", 400);
    error.statusCode = 400;
    next(error);
    return;
  }

  const skip = (page - 1) * limit;

  try {
    const availableResources = await Resource.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [long, lat], // Person's location
          },
          distanceField: 'distance', // Field to store computed distance
          spherical: true, // Use spherical distance calculation
          ...(radiusInMeters && { maxDistance: radiusInMeters }), // Optional: Maximum distance in meters (e.g., 5km)
          query: { ...(type && { type }), availability: true }, // Optional: Additional filters for resources
        },
      },
    ])
      .skip(skip)
      .limit(limit);

    res.json(availableResources);
  } catch (e) {
    next(e);
  }
};

export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body, user } = req;
    const resourceBody = ResourceRequestBodySchema.parse(body);
    const location = {
      type: 'Point',
      coordinates: resourceBody.location,
    };
    const resource = new Resource({ provider: user?.id, ...resourceBody });
    resource.location = location;
    await resource.save();
    res.status(201).json({ message: 'Resources created successfully' });
  } catch (e) {
    next(e);
  }
};
