import { Model, model, Schema, Types } from "mongoose";
import bcrypt from 'bcrypt'
import validator from 'validator'
import {dictionary} from "../common/dictionary";

export interface IUser {
    username:   string,
    email:      string,
    password:   string,
    fullname:   string,
}

interface UserModel extends Model<IUser> {
    findByCredentials(username: string, password: string): any;
    findByUsername(username: string): any;
}

const userSchema = new Schema<IUser, UserModel>({
    username: { type: String, required: true, trim: true, unique: true, },
    fullname: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: (value: string) => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email address');
            }
        }
    },
    password: { type: String, required: true, trim: true },
});


userSchema.pre('save', async function (next) {
    const SALT_WORK_FACTOR = 10;

    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
});

userSchema.statics.findByCredentials = async (username: string, password: string) => {
    const user = await User.findOne({ username })
    if (!user) {
        throw new Error(dictionary.validator.credentials.error.wrongUser)
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error(dictionary.validator.credentials.error.wrongPassword)
    }
    return user;
}

userSchema.statics.findByUsername = async (username: string) => {
    return await User.findOne({ username });
}

const User = model<IUser, UserModel>('User', userSchema);

export default User;
