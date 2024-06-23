const { ObjectId } = require('mongodb');

const { db } = require('../config/db');

class Follow {
  static async findById(id) {
    const follow = await db.collection('Follow').findOne({ _id: ObjectId.createFromHexString(id) });

    return follow;
  }

  static async findByFollowerIdAndFollowingId({ followerId, followingId }) {
    const follow = await db.collection('Follow').findOne({ followerId, followingId });

    return follow;
  }

  static async create({ followerId, followingId }) {
    const result = await db.collection('Follow').insertOne({
      followerId,
      followingId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return result;
  }

  static async deleteByFollowerIdAndFollowingId({ followerId, followingId }) {
    const result = await db.collection('Follow').deleteOne({ followerId, followingId });

    return result;
  }
}

module.exports = Follow;
