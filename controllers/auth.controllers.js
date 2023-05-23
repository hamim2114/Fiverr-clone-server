import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { createError } from '../utils/error.handler.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  
  try {
    const hashed = bcrypt.hashSync(req.body.password, 10);
    const newUser = new userModel({ ...req.body, password: hashed });
    await newUser.save();
    res.status(200).send('User Created!');
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await userModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (!user) return next(createError(404, 'user not found!'));

    const comparePass = await bcrypt.compare(req.body.password, user.password);
    if (!comparePass) return next(createError(401, 'incorrect password!'));

    const { password, ...others } = user._doc;

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    next(error);
  }
};
export const logout = (req, res, next) => {
  res
    .clearCookie('access_token', {
      sameSite: 'none',
      secure: true,
    })
    .status(200)
    .send('logout success!');
};
