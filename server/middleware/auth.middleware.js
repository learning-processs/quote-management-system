import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authMiddleware = async(req , resp , next)=>{
    try {

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer')){
            return resp.status(401).json({success : false , message : 'Not authorized...No Token...'})
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if(!user){
            return resp.status(401).json({success: false , message : 'User no longer exists...'})
        }

        if (user.isBanned) {
            return resp.status(403).json({ success: false, message: 'Your account has been banned.' });
        }

        req.user = user;
        next();
        
    } catch (error) {
        return resp.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
}

export default authMiddleware;