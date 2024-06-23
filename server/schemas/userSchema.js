const { GraphQLError } = require('graphql');

const { Follow, User } = require('../models');
const { comparePassword } = require('../utils/bcrypt');
const { signToken } = require('../utils/jwt');

const userTypeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String!
    imgUrl: String
    coverUrl: String
    email: String!
  }

  type UserProfile {
    _id: ID
    name: String
    username: String!
    imgUrl: String
    coverUrl: String
    email: String!
    followers: [User]
    followings: [User]
    posts: [Post]
  }

  type UserToken {
    token: String
  }

  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  input UserRegisterInput {
    name: String
    username: String!
    imgUrl: String
    coverUrl: String
    email: String!
    password: String!
  }

  input UserLoginInput {
    username: String!
    password: String!
  }

  type Query {
    searchUser(keyword: String!): [User]
    getUser(id: ID!): UserProfile
    getMe: UserProfile
  }

  type Mutation {
    register(payload: UserRegisterInput): User
    login(payload: UserLoginInput): UserToken
    follow(userId: ID!): Follow
  }
`;

const userResolvers = {
  Query: {
    searchUser: async (_, { keyword }) => {
      if (!keyword) {
        return [];
      }

      const users = await User.findByNameOrUsername(keyword);

      return users;
    },
    getUser: async (_, { id }) => {
      const user = await User.findById(id);

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            http: 404,
            code: 'NOT_FOUND',
          },
        });
      }

      return user;
    },
    getMe: async (_, __, { getLoggedUser }) => {
      const me = await getLoggedUser();
      const user = await User.findById(me._id.toHexString());

      return user;
    },
  },
  Mutation: {
    register: async (_, { payload }) => {
      const { insertedId } = await User.create(payload).catch((error) => {
        throw new GraphQLError(error.message, {
          extensions: {
            http: error.statusCode,
            code: error.code,
          },
        });
      });

      const user = await User.findById(insertedId.toHexString());

      return user;
    },
    login: async (_, { payload }) => {
      const user = await User.findByUsername(payload.username);

      if (!user || !(await comparePassword(payload.password, user.password))) {
        throw new GraphQLError('Invalid username or password', {
          extensions: {
            http: 401,
            code: 'UNAUTHENTICATED',
          },
        });
      }

      const token = signToken({ id: user._id, username: user.username });

      return { token };
    },
    follow: async (_, { userId }, { getLoggedUser }) => {
      const me = await getLoggedUser();

      const user = await User.findById(userId);

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            http: 404,
            code: 'NOT_FOUND',
          },
        });
      }

      const follow = await Follow.findByFollowerIdAndFollowingId({
        followerId: me._id,
        followingId: user._id,
      });

      if (follow) {
        await Follow.deleteByFollowerIdAndFollowingId({
          followerId: me._id,
          followingId: user._id,
        });

        return follow;
      }

      const { insertedId } = await Follow.create({
        followerId: me._id,
        followingId: user._id,
      });

      const updatedFollow = await Follow.findById(insertedId.toHexString());

      return updatedFollow;
    },
  },
};

module.exports = { userTypeDefs, userResolvers };
