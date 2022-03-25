const { User } = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// all users
router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// single user
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  //
  if (!user) {
    res
      .status(500)
      .json({ message: 'The user with the given ID was not found!' });
  }
  res.status(200).send(user);
});

// register user
router.post('/', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) {
    return res.status(400).send('The user cannot be registered!');
  }

  res.send(user);
});

module.exports = router;
