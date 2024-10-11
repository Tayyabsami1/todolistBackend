const User = require("../models/UserModel");
const bcrypt = require('bcrypt')

async function updateUserDetails(req, res) {
  const { userId, username, email } = req.body;
  //   const userId = req.cookies.jwt.userId;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: username, email: email },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "User details updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error occurred while updating user details",
      error: err.message,
    });
  }
}

async function changePassword(req, res){
  //   const userId = req.cookies.jwt.userId;
    const{userId, currPassword, newPassword, newConfirmPassword} = req.body;
    try{
        const user = await User.findById(userId);
        const auth = bcrypt.compare(currPassword,user.password);
        if(!auth){
            throw Error('Incorrect Password');
        }
        if (newPassword !== newConfirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }
        user.password = newPassword; // The password will be hashed by the pre-save hook
        await user.save();

        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error changing password', error: err.message });
    }
}
module.exports = {
    updateUserDetails,
    changePassword
}
