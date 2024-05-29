import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';

export const authMiddleware = async (ctx, next) => {
  const token = ctx.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      ctx.user = user;
    } catch (err) {
      console.error(err);
    }
  }
  await next();
};