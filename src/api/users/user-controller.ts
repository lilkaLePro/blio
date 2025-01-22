import { Request, Response } from 'express';
import { authentication, random } from '../../helpers';
import {
  createUser,
  getUserByEmail,
  getUserBySessionToken,
  getUsers,
  updateUserById,
} from './user-schema';
const key = process.env.SECRETE || '';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getUserByToken = async (req: Request, res: Response) => {
  try {
    let token = req.cookies[key];
    if (!token) {
      res.sendStatus(400).json({ msg: 'token not found' });
    }

    const user = await getUserBySessionToken(token);
    if (!user) {
      res.sendStatus(400).json({ msg: 'token non disponible' });
    }
    if (user?.sessionTokenExpiresAt && user?.sessionTokenExpiresAt < new Date()) {
      return res.status(401).json({ msg: 'connexion expiré, reconnectez-vous' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json(' server error ');
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, firstname, lastname, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: 'user exist deja' });
    }

    const saltString = random();
    const user = await createUser({
      email,
      firstname,
      lastname,
      password: authentication(saltString, password),
      sessionToken: null,
      sessionTokenExpiresAt: null,
      salt: saltString,
    });
    const id = user?._id as string;
    const sessionToken = authentication(saltString, id.toString() );
    let token = user?.sessionToken;
    token = sessionToken.toUpperCase();

    const expirationDuration = 24 * 60 * 60 * 1000;
    const sessionTokenExpiresAt = new Date(expirationDuration + Date.now());
    let expireAt = user?.sessionTokenExpiresAt;
    expireAt = sessionTokenExpiresAt;

    await updateUserById(id, { sessionToken, sessionTokenExpiresAt });

    if (key) {
      return res.cookie(key, sessionToken, { domain: 'localhost', path: '/' });
    }

    return res.status(200).json({ msg: 'user created successfully', user, token, expireAt });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500).json({ error: 'user creation failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const verifedEmail = await getUserByEmail(email);
    if (!verifedEmail) {
      return res.status(404).json('user doesn t exist');
    }
    
    const userData = {
      sessioToken: verifedEmail?.sessionToken,
      password: verifedEmail?.password,
      salt: verifedEmail?.salt,
    };
    const verifedPassword = authentication(userData?.salt, password);
    if (userData?.password !== verifedPassword) {
      return res.status(403).json('Password incorrect');
    }
    const salt = random();
    const id = verifedEmail?._id;
    if (id) {
      userData.sessioToken = authentication(salt, id.toString());
      const sessionToken = authentication(salt, id.toString());
      await updateUserById(id.toString(), { sessionToken });
    }

    return res.status(200).json({ success: 'connected sucessfully', verifedEmail });

  } catch (error) {
    return res.status(500).json('login failed');
  }
};