import jwt, { JwtPayload } from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

const authTokenMiddleware = (req: any, res: any, next: any) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

    try{
        const decodedJwt = jwt.verify(req.token , ACCESS_TOKEN_SECRET) as JwtPayload;
        req.username = decodedJwt.username;
        next();
    }
    catch(error: any){
        res.status(401).send(error.message);
    }
}

export { authTokenMiddleware }