const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/CustomerSupportAgent', {
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection error', error);
  }
}

module.exports = {
  connect
};
