const { GraphQLError } = require('graphql');

const { Post } = require('../models');

const postTypeDefs = `#graphql
  type Comment {
    content: String!
    username: String!
    author: User
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String!
    author: User
    createdAt: String
    updatedAt: String
  }

  type Post {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    author: User
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  input PostInput {
    content: String!
    tags: [String]
    imgUrl: String
  }

  type Query {
    getPosts: [Post]
    getPost(id: ID!): Post
  }

  type Mutation {
    addPost(payload: PostInput): Post
    commentPost(id: ID!, content: String!): Post
    likePost(id: ID!): Post
  }
`;

const postResolvers = {
  Query: {
    getPosts: async () => {
      const posts = await Post.findAll();

      return posts;
    },
    getPost: async (_, { id }) => {
      const post = await Post.findById(id);

      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: {
            http: 404,
            code: 'NOT_FOUND',
          },
        });
      }

      return post;
    },
  },
  Mutation: {
    addPost: async (_, { payload }, { getLoggedUser }) => {
      const me = await getLoggedUser();

      const { insertedId } = await Post.create({ ...payload, authorId: me._id }).catch((error) => {
        throw new GraphQLError(error.message, {
          extensions: {
            http: error.statusCode,
            code: error.code,
          },
        });
      });

      const post = await Post.findById(insertedId.toHexString());

      return post;
    },
    commentPost: async (_, { id, content }, { getLoggedUser }) => {
      const me = await getLoggedUser();

      await Post.createComment(id, { content, username: me.username }).catch((error) => {
        throw new GraphQLError(error.message, {
          extensions: {
            http: error.statusCode,
            code: error.code,
          },
        });
      });

      const post = await Post.findById(id);

      return post;
    },
    likePost: async (_, { id }, { getLoggedUser }) => {
      const me = await getLoggedUser();
      const post = await Post.findById(id);
      const isLiked = post.likes.some((like) => like.username === me.username);

      if (isLiked) {
        await Post.deleteLike(id, { username: me.username }).catch((error) => {
          throw new GraphQLError(error.message, {
            extensions: {
              http: error.statusCode,
              code: error.code,
            },
          });
        });

        return post;
      }

      await Post.createLike(id, { username: me.username }).catch((error) => {
        throw new GraphQLError(error.message, {
          extensions: {
            http: error.statusCode,
            code: error.code,
          },
        });
      });

      const updatedPost = await Post.findById(id);

      return updatedPost;
    },
  },
};

module.exports = { postTypeDefs, postResolvers };
