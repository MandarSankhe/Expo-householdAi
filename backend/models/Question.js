const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Use email instead of userId
  householdSize: { type: String, required: true },
  specialDiet: [{ type: String }],
  mostCookedCuisine: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);
