import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { ApolloServer } from 'apollo-server-koa';
import { connectDatabase } from './mongoose.js';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './resolvers/resolvers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const app = new Koa();
const router = new Router();

// Conexão com MongoDB
await connectDatabase();

//https://qiita.com/kajima/items/2405a44a2c6f14de7919
async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  console.log(`🚀 Apollo Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
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