const { ObjectId } = require('mongodb');

const { db } = require('../config/db');
const { hashPassword } = require('../utils/bcrypt');

class User {
  static async findByNameOrUsername(keyword) {
    const users = await db
      .collection('User')
      .find(
        {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { username: { $regex: keyword, $options: 'i' } },
          ],
        },
        { projection: { password: 0 } }
      )
      .toArray();

    return users;
  }

  static async findById(id) {
    const user = await db
      .collection('User')
      .aggregate([
        { $match: { _id: ObjectId.createFromHexString(id) } },
        {
          $lookup: {
            from: 'Follow',
            localField: '_id',
            foreignField: 'followerId',
            as: 'followings',
          },
        },
        {
          $lookup: {
            from: 'Follow',
            localField: '_id',
            foreignField: 'followingId',
            as: 'followers',
          },
        },
        {
          $lookup: {
            from: 'User',
            localField: 'followings.followingId',
            foreignField: '_id',
            as: 'followings',
          },
        },
        {
          $lookup: {
            from: 'User',
            localField: 'followers.followerId',
            foreignField: '_id',
            as: 'followers',
          },
        },
        {
          $lookup: {
            from: 'Post',
            localField: '_id',
            foreignField: 'authorId',
            as: 'posts',
            pipeline: [
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
            ],
          },
        },
        {
          $project: {
            password: 0,
            'followings.password': 0,
            'followers.password': 0,
          },
        },
      ])
      .next();

    return user;
  }

  static async findByUsername(username) {
    const user = await db.collection('User').findOne({
      username: {
        $regex: new RegExp(`^${username}$`, 'i'),
      },
    });

    return user;
  }

  static async findByEmail(email) {
    const user = await db.collection('User').findOne({ email });

    return user;
  }

  static async create({ name, username, email, password }) {
    if (!username) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Username is required' };
    }

    if (!email) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Email is required' };
    }

    if (!password) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Password is required' };
    }

    if (!!(await this.findByUsername(username))) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Username already exists' };
    }

    if (!!(await this.findByEmail(email))) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Email already exists' };
    }

    if (password.length < 5) {
      throw {
        code: 'BAD_REQUEST',
        statusCode: 400,
        message: 'Password must be at least 5 characters',
      };
    }

    // Reference: https://piyush132000.medium.com/mastering-email-validation-in-javascript-multiple-approaches-ae718546160b
    if (!/^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      throw { code: 'BAD_REQUEST', statusCode: 400, message: 'Invalid email format' };
    }

    password = await hashPassword(password);

    const result = await db.collection('User').insertOne({ name, username, email, password });

    return result;
  }
}

module.exports = User;
