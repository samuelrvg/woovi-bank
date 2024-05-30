import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';

export const authMiddleware = async (ctx, next) => {
  const token = ctx.headers.authorization;

  // if (!token) {
  //   ctx.status = 401;
  //   ctx.body = { error: 'No token provided' };
  //   return;
  // }

  // ctx.user = { id: '66579bba6213229fdadc4ef1' }
  // console.log('decode token', jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTc5YmJhNjIxMzIyOWZkYWRjNGVmMSIsImlhdCI6MTcxNzAzNDEyNX0.smy1Xx-TD29MDqkqPmgD7lmfpdRT_XnBNCR13h5tNO8'))

  // const decoded = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTc5YmJhNjIxMzIyOWZkYWRjNGVmMSIsImlhdCI6MTcxNzAzNDEyNX0.smy1Xx-TD29MDqkqPmgD7lmfpdRT_XnBNCR13h5tNO8', process.env.JWT_SECRET);
  // console.log('DECODED :: ', decoded)

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decoded', decoded)
      const user = await User.findById(decoded.id);
      ctx.user = user;
    } catch (error) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token' };
    }
  }
  await next();
};

// const authMiddleware = async (ctx, next) => {
//   const token = ctx.headers.authorization && ctx.headers.authorization.split(' ')[1];

//   if (!token) {
//     ctx.status = 401;
//     ctx.body = { error: 'No token provided' };
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, 'your_secret_key');
//     ctx.state.user = decoded;
//     await next();
//   } catch (error) {
//     ctx.status = 401;
//     ctx.body = { error: 'Invalid token' };
//   }
// };

// module.exports = authMiddleware;