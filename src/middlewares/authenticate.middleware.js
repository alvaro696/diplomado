import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) return res.sendStatus(401);
    const secret = process.env.JWT_SECRET
    jwt.verify(token, secret, (err,user)=>{
        if(err){

            return res.sendStatus(403);
        } 
        req.user = user;
        next();
    })
}