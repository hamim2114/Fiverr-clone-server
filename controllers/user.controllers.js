import userModel from "../models/user.model.js"
import { createError } from "../utils/error.handler.js";

export const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if(req.userId !== user._id.toString()) return next(createError(403, 'you can delete only your account!'))
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).send('user deleted!')
  } catch (error) {
    next(error)
  }
}

export const findUser = async (req,res,next) => {
  try {
    const user = await userModel.findById(req.params.id)
    user.password = undefined
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}