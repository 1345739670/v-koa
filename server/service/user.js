const mongoose = require('mongoose');
const User = mongoose.model('User');


export const checkPassword = async (email, password) => {
  let match = false
  const user = await User.findOne({ email })

  if (user) {
    match = await comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}


