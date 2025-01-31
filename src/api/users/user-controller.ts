import { Request, Response } from 'express';
import { authentication, random } from '../../helpers';
import {
  createUser,
  getUserByEmail,
  getUserBySessionToken,
  getUsers,
  updateUserById,
} from './user-schema';
const key = 'BLIUSER';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const userByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ msg: 'connot get user' });
  }
};

export const getUserByToken = async (req: Request, res: Response) => {
  try {
    let token = req.cookies[key];
    if (!token) {
      return res.status(403).json({ msg: 'token not found' });
    }
    const user = await getUserBySessionToken(token);
    if (!user) {
      return res.status(400).json({ msg: 'token non disponible' });
    }
    if (
      user?.sessionTokenExpiresAt &&
      user?.sessionTokenExpiresAt < new Date()
    ) {
      return res
        .status(401)
        .json({ msg: 'connexion expiré, reconnectez-vous' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ msg: 'error, user ' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    if (!email || !firstname || !lastname || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: 'user exist deja' });
    }
    const saltString = random();
    const hashedPw = await authentication(saltString, password);
    const user = await createUser({
      email,
      firstname,
      lastname,
      password: hashedPw,
      sessionToken: null,
      sessionTokenExpiresAt: null,
      salt: saltString,
    });
    const id = user?._id as string;
    if (!id) {
      throw new Error('User ID is missing');
    }
    const sessionToken = await authentication(saltString, id.toString());
    let token = user?.sessionToken;
    token = sessionToken;

    const expirationDuration = 24 * 60 * 60 * 1000;
    const sessionTokenExpiresAt = new Date(expirationDuration + Date.now());
    let expireAt = user?.sessionTokenExpiresAt;
    expireAt = sessionTokenExpiresAt;

    await updateUserById(id, { sessionToken, sessionTokenExpiresAt });

    if (key) {
      res.cookie(key, sessionToken, { domain: 'localhost', path: '/' });
    }

    return res
      .status(200)
      .json({ user, token, expireAt });
  } catch (error) {
    console.log(error);
    return res.status(500).json('user creation failed');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    const verifedEmail = await getUserByEmail(email);
    if (!verifedEmail) {
      return res.status(404).json('user doesn t exist');
    }
    const expirationDuration = 24 * 60 * 60 * 1000;
    const userData = {
      sessioToken: verifedEmail?.sessionToken,
      password: verifedEmail?.password,
      salt: verifedEmail?.salt,
    };

    const verifedPassword = await authentication(userData?.salt, password);
    if (userData?.password !== verifedPassword) {
      return res.status(403).json('Password incorrect');
    }
    const salt = random();
    const id = verifedEmail?._id as unknown as string;
    if (!id) {
      throw new Error('User ID is missing');
    }    
    userData.sessioToken = await authentication(salt, id.toString());
    const sessionToken = userData?.sessioToken;
    const sessionTokenExpiresAt = new Date(expirationDuration + Date.now());

    const user = await updateUserById(id, { sessionToken, sessionTokenExpiresAt });

    if (key) {
      res.cookie(key, sessionToken, { domain: 'localhost', path: '/', expires: verifedEmail?.sessionTokenExpiresAt });
    }

    return res
      .status(200)
      .json({ user, sessionToken });
  } catch (error) {
    return res.status(500).json({ error: 'login failed' });
  }
};
