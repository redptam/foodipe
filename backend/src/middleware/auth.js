import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Fail-fast: refuse to start if JWT_SECRET is not set
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
}

export const protect = async (req, res, next) => {
    // Accept token from HttpOnly cookie (preferred) OR Bearer header (API clients)
    const token = req.cookies?.token || (
        req.headers.authorization?.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1]
            : null
    );

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        next();
    } catch (error) {
        console.error('[AUTH]', error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
