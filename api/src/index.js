import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import logger from 'koa-logger';
import { ApolloServer } from 'apollo-server-koa';
import { connectDatabase } from './mongoose.js';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './resolvers/resolvers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { config } from './config.js'

const app = new Koa();
const router = new Router();

app.use(json());
app.use(logger());

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
  console.log(`🚀 Apollo Server ready at http://localhost:${config.PORT}${apolloServer.graphqlPath}`);
}

startServer();

app.use(router.routes());
app.use(bodyParser());
app.use(authMiddleware);

app.on('error', (err) => {
  console.error('Server error', err);
});

// router.get('/api', authMiddleware, (ctx) => {})
router.get('/api', (ctx) => {
  ctx.body = { message: 'Hello, Koa API!' };
});

app.listen({ port: config.PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.PORT}`)
);

// export default app;
// module.exports = app;