import { Router, Request, Response } from "express";
import User from "../models/user.model";
import jwt, { JwtPayload } from 'jsonwebtoken'

import {dictionary} from '../common/dictionary';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const user = await User.findByCredentials(username, password);

        const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET as string;

        const jwtPayload : JwtPayload = {
            username: user.username,
            fullName: user.fullname
        }

        const token = jwt.sign(jwtPayload, ACCESS_TOKEN_SECRET);

        res.json({token});
    }
    catch (err: any) {
        res.status(400).send(err.message);
    }
})

router.post('/register', async (req: Request, res: Response) => {
    try {
        const user = new User(req.body);

        await user.save();

        res.status(201).send({
            fullname:   user.fullname,
            username:   user.username,
            email:      user.email,
        });
    }
    catch (error: any) {
        if (error.message == dictionary.validator.register.error.user) {
            res.status(400).send(dictionary.validator.register.error.user);
        }
        else if (error.code == 11000) {
            res.status(400).send(dictionary.validator.register.error.email);
        }
        else {
            console.log(error)
            res.status(400).send({
                kind:       error.errors.email.name,
                message:    error.errors.email.message,
            });
        }
    }
})

router.get('/user/logout', async (req: Request, res: Response) => {
  res.send("log out...");
})
export default router;