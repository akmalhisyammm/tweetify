if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const { connect } = require('./config/db');
const { userTypeDefs, userResolvers } = require('./schemas/userSchema');
const { postTypeDefs, postResolvers } = require('./schemas/postSchema');
const { authN } = require('./middlewares/authMiddleware');

const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs],
  resolvers: [userResolvers, postResolvers],
  introspection: true,
});

(async () => {
  await connect();

  const { url } = await startStandaloneServer(server, {
    listen: PORT,
    context: async ({ req }) => {
      return { getLoggedUser: async () => await authN(req) };
    },
  });

  console.log(`Server is running on ${url} 🚀`);
})();
