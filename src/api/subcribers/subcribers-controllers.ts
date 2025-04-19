import { Request, Response } from 'express';
import { createSubscriber, findSubscriberByNumber, getSubcribersByUser, getSubscriberById } from './subcriber-schema';

export const getAllSubscribersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const subscriber = await getSubcribersByUser(userId);
    if (!subscriber) {
      console.error(`user with id ${userId} not found`);
      return res.status(403);
    }
    return res.status(200).json(subscriber);
  } catch (error) {
    return res.status(500);
  }
};

export const getoneSubcribersById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscriber = await getSubscriberById(id.toString());
    if (!subscriber) {
      return res.status(403);
    }
    return res.status(200).json(subscriber);
  } catch (error) {
    return res.status(500);
  }
};

export const addSubscriber = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, phoneNumber, job } = req.body;
    const { userId } = req.params;

    const isSubscriberExist = await findSubscriberByNumber(phoneNumber);
    if (isSubscriberExist) {
      return res
        .status(403)
        .json(`phone number ${phoneNumber} already exist !`);
    }
    const subscriber = await createSubscriber({
      email,
      firstname,
      job,
      lastname,
      phoneNumber,
      userId: userId.toString(),
    });

    return res
      .status(200)
      .json(subscriber);
  } catch (error) {
    return res.status(500).json({ 'error': error });
  }
};
