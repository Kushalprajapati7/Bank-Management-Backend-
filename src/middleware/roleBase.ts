import { Request, Response, NextFunction } from 'express';
import CustomRequest from '../types/customRequest';

const authorize = (roles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as CustomRequest).userId;
        const role = (req as CustomRequest).role;

        if (!userId || !role) {
            return res.status(401).send({ message: 'Access denied' });
        }

        if (roles.length && !roles.includes(role)) {
            return res.status(403).send({ message: 'Access Denied For Your Role' });
        }

        next();
    };
};

export default authorize;
