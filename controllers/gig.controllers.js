import gigModel from "../models/gig.model.js";
import { createError } from "../utils/error.handler.js";

export const createGig = async (req, res, next) => {
  if(!req.isSeller) return next(createError(403, 'seller verification failed!'));
  const newGig = new gigModel({userId: req.userId, ...req.body});
  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig)
  } catch (error) {
    next(error)
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await gigModel.findById(req.params.id);
    if(!gig) return next(createError(404, 'cannot find any gig!'))
    if(req.userId !== gig.userId) return next(createError(403, 'you can delete only your gig!'))
    await gigModel.findByIdAndDelete(req.params.id);
    res.status(201).send('gig deleted!')
  } catch (error) {
    next(error)
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await gigModel.findById(req.params.id);
    if(!gig) return next(createError(404, 'cannot find any gig!'));
    res.status(201).json(gig)
  } catch (error) {
    next(error)
  }
};
export const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && {userId: q.userId}),
    ...(q.cat && {cat: q.cat}),
    ...((q.min || q.max) && {price: {...(q.min && {$gt: q.min}), ...(q.max && {$lt: q.max})}}),
    ...(q.search && {title: {$regex: q.search, $options: 'i'}})
  }
  try {
    const gigs = await gigModel.find(filters).sort({[q.sort]: -1})
    res.status(201).json(gigs)
  } catch (error) {
    next(error)
  }
};
