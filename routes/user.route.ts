import { Router } from "express";
import User from "../models/user.model";
import * as dotenv from 'dotenv'
dotenv.config()

const router = Router();

router.get('/users', async (req, res) => {
    try{
        const users = await User.find();
        res.send(users);
    }
    catch(error: any){
        res.send(error.message);
    }
})

router.get('/users/username', async (req, res) => {
    try{
        const usernames = await User.find().select('username -_id');
        res.send(usernames);
    }
    catch(error: any){
        res.send(error.message);
    }
})

export default router;