import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      _id
      name
      username
      imgUrl
      coverUrl
      email
      followers {
        _id
        name
        username
        imgUrl
        email
      }
      followings {
        _id
        name
        username
        imgUrl
        email
      }
      posts {
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
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($keyword: String!) {
    searchUser(keyword: $keyword) {
      _id
      name
      username
      imgUrl
      email
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    getMe {
      _id
      name
      username
      imgUrl
      coverUrl
      email
      followers {
        _id
        name
        username
        imgUrl
        email
      }
      followings {
        _id
        name
        username
        imgUrl
        email
      }
      posts {
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
  }
`;

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
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

export const GET_POST = gql`
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
