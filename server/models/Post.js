const { ObjectId } = require('mongodb');

const { db } = require('../config/db');
const redis = require('../config/redis');

class Post {
  static async findAll() {
    const postsCache = await redis.get('posts');

    if (postsCache) {
      return JSON.parse(postsCache);
    }

    const posts = await db
      .collection('Post')
      .aggregate([
        {
          $lookup: {
            from: 'User',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            'author.password': 0,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    await redis.set('posts', JSON.stringify(posts));

    return posts;
  }

  static async findById(id) {
    const post = await db
      .collection('Post')
      .aggregate([
        { $match: { _id: ObjectId.createFromHexString(id) } },
        {
          $lookup: {
            from: 'User',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
        // Reference: https://www.mongodb.com/community/forums/t/lookup-populate-objects-in-array/201331/9
        {
          $lookup: {
            from: 'User',
            localField: 'comments.username',
            foreignField: 'username',
            as: 'commentAuthors',
          },
        },
        {
          $addFields: {
            comments: {
              $map: {
                input: '$comments',
                in: {
                  $mergeObjects: [
                    '$$this',
                    {
                      author: {
                        $arrayElemAt: [
                          '$commentAuthors',
                          { $indexOfArray: ['$commentAuthors.username', '$$this.username'] },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            commentAuthors: '$$REMOVE',
          },
        },
        {
          $lookup: {
            from: 'User',
            localField: 'likes.username',
            foreignField: 'username',
            as: 'likeAuthors',
          },
        },
        {
          $addFields: {
            likes: {
              $map: {
                input: '$likes',
                in: {
                  $mergeObjects: [
                    '$$this',
                    {
                      author: {
                        $arrayElemAt: [
                          '$likeAuthors',
                          { $indexOfArray: ['$likeAuthors.username', '$$this.username'] },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            likeAuthors: '$$REMOVE',
          },
        },
        {
          $project: {
            'author.password': 0,
            'comments.author.password': 0,
            'likes.author.password': 0,
          },
        },
      ])
      .next();

    return post;
  }

  static async create({ content, tags, imgUrl, authorId }) {
    if (!content) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Content is required' };
    }

    if (!authorId) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Author is required' };
    }

    const result = await db.collection('Post').insertOne({
      content,
      tags,
      imgUrl,
      authorId,
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await redis.del('posts');

    return result;
  }

  static async createComment(id, { content, username }) {
    if (!content) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Content is required' };
    }

    if (!username) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Username is required' };
    }

    const result = await db.collection('Post').updateOne(
      { _id: ObjectId.createFromHexString(id) },
      {
        $push: {
          comments: {
            content,
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
    );

    await redis.del('posts');

    return result;
  }

  static async createLike(id, { username }) {
    if (!username) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Username is required' };
    }

    const result = await db.collection('Post').updateOne(
      { _id: ObjectId.createFromHexString(id) },
      {
        $push: {
          likes: {
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
    );

    await redis.del('posts');

    return result;
  }

  static async deleteLike(id, { username }) {
    if (!username) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Username is required' };
    }

    const result = await db.collection('Post').updateOne(
      { _id: ObjectId.createFromHexString(id) },
      {
        $pull: {
          likes: { username },
        },
      }
    );

    await redis.del('posts');

    return result;
  }
}

module.exports = Post;
