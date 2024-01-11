const { AuthenticationError } = require('./utils/errors');

const resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.accountsAPI.getUser(id);
      if (!user) {
        throw new Error('No user found for this Id');
      }
      return user;
    },
    me: async (_, __, { dataSources, userId }) => {
      if (!userId) {
        throw AuthenticationError();
      }
      return await dataSources.accountsAPI.getUser(userId);
    },
  },
  Mutation: {
    updateProfile: async (_, { updateProfileInput }, { dataSources, userId }) => {
      if (!userId) throw AuthenticationError();
      try {
        const updatedUser = await dataSources.accountsAPI.updateUser({ userId, userInfo: updateProfileInput });
        return {
          code: 200,
          success: true,
          message: 'Profile successfully updated!',
          user: updatedUser,
        };
      } catch (err) {
        return {
          code: 400,
          success: false,
          message: err.message,
        };
      }
    },
  },
  Host: {
    __resolveReference: (user, { dataSources }) => dataSources.accountsAPI.getUser(user.id),
  },
  Guest: {
    __resolveReference: (user, { dataSources }) => dataSources.accountsAPI.getUser(user.id),
  },
  User: {
    __resolveType(user) {
      return user.role;
    },
  },
};

module.exports = resolvers;
