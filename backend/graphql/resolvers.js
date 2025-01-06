const User = require('../models/User');
const Question = require('../models/Question');

module.exports = {
  Query: {
    getUsers: async () => await User.find(),
    getQuestions: async (_, { email }) => await Question.find({ email }), // Query by email
  },
  Mutation: {
    registerUser: async (_, { username, email }) => {
      const newUser = new User({
        username,
        email,
        createdDate: new Date().toISOString(),
      });
      return await newUser.save();
    },
    addQuestion: async (
      _,
      { email, householdSize, specialDiet, mostCookedCuisine }
    ) => {
      const newQuestion = new Question({
        email, // Use email instead of userId
        householdSize,
        specialDiet,
        mostCookedCuisine,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return await newQuestion.save();
    },
  },
};
