const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  text: { type: String, required: true },
  features: { type: [String], required: true },
  images: { type: [String], required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  coverInside: [{
    heading: String,
    text: String
  }],
  bonuses: [{
    heading: String,
    text: String,
    price: String
  }],
  whyAttend: [String]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
