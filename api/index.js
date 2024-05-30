import 'dotenv/config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { ApolloServer } from 'apollo-server-koa';
import mongoose from 'mongoose';
import { typeDefs } from './src/schemas/typeDefs.js';
import { resolvers } from './src/resolvers/resolvers.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

const app = new Koa();
const router = new Router();

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

//https://qiita.com/kajima/items/2405a44a2c6f14de7919
async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  console.log(':: ', apolloServer.graphqlPath)
  apolloServer.applyMiddleware({ app });
}

startServer();

app.use(router.routes());
app.use(bodyParser());
app.use(authMiddleware);

// router.get('/api', authMiddleware, (ctx) => {})
router.get('/api', (ctx) => {
  ctx.body = { message: 'Hello, Koa API!' };
});

app.listen({ port: process.env.PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`)
);