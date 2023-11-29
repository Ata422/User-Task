const express = require("express");
const router = express.Router();
const User = require("../Schema/User");

// api for creating user
router.post("/createuser", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      res.json({ message: "user with email already exist" });
    }
    const user = await User.create({
      name,
      email,
      role,
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error occured");
  }
});

// api for getting all users
router.get("/getusers", async (req, res) => {
  try {
    const getUser = await User.find({});
    res.json(getUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error occured");
  }
});

// api for deleting user
router.delete("/deleteuser/:id", async (req, res) => {
  try {
    const delUser = await User.findByIdAndDelete(req.params.id);
    if (!delUser) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json({ message: "user deleted successfuly" });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error occured");
  }
});
module.exports = router;
