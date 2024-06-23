import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($payload: UserRegisterInput) {
    register(payload: $payload) {
      _id
      name
      username
      imgUrl
      coverUrl
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($payload: UserLoginInput) {
    login(payload: $payload) {
      token
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    follow(userId: $userId) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($payload: PostInput) {
    addPost(payload: $payload) {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        _id
        name
        username
        imgUrl
        email
      }
      comments {
        content
        username
        author {
          _id
          name
          username
          imgUrl
          email
        }
        createdAt
        updatedAt
      }
      likes {
        username
        author {
          _id
          name
          username
          imgUrl
          email
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const COMMENT_POST = gql`
  mutation CommentPost($postId: ID!, $content: String!) {
    commentPost(id: $postId, content: $content) {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        _id
        name
        username
        imgUrl
        email
      }
      comments {
        content
        username
        author {
          _id
          name
          username
          imgUrl
          email
        }
        createdAt
        updatedAt
      }
      likes {
        username
        author {
          _id
          name
          username
          imgUrl
          email
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(id: $postId) {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        _id
        name
        username
        imgUrl
        email
      }
      comments {
        content
        username
        author {
          _id
          name
          username
          imgUrl
          email
        }
        createdAt
        updatedAt
      }
      likes {
        username
        author {
          _id
          name
          username
          imgUrl
          email
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
