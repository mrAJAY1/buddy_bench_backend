const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define user schema with required fields `username`, `password`, and `isVerified`
const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // add createdAt and updatedAt timestamps to each document
  }
);

// register pre-hook for the "save" event on the user schema
userSchema.pre('save', async function (next) {
  const user = this; // get the current user object

  // if the password hasn't been modified, skip hashing
  if (!user.isModified('password')) {
    return next(); // call the next middleware function
  }

  try {
    // generate a salt for the hash function
    const salt = await bcrypt.genSalt(10);

    // generate hash using the salt and user password
    const hash = await bcrypt.hash(user.password, salt);

    // replace user plaintext password with hashed password
    user.password = hash;

    next(); // call the next middleware function
  } catch (err) {
    return next(err); // pass any errors to the next middleware
  }
});

// create and export mongoose model from user schema
module.exports = mongoose.model('benchBuddyUser', userSchema);
