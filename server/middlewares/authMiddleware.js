const { GraphQLError } = require('graphql');

const { User } = require('../models');
const { verifyToken } = require('../utils/jwt');

const authN = async (req) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith('Bearer ')) {
    throw new GraphQLError('You are not authenticated', {
      extensions: {
        http: 401,
        code: 'UNAUTHENTICATED',
      },
    });
  }

  const token = authorization.split(' ')[1];
  const payload = verifyToken(token);
  const user = await User.findById(payload.id);

  if (!user) {
    throw new GraphQLError('You are not authenticated', {
      extensions: {
        http: 401,
        code: 'UNAUTHENTICATED',
      },
    });
  }

  return { _id: user._id, username: user.username };
};

module.exports = { authN };
