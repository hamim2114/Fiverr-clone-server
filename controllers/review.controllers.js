import gigModel from "../models/gig.model.js";
import reviewModel from "../models/review.model.js"
import { createError } from "../utils/error.handler.js";

export const addReview = async (req,res,next) => {
  if(req.isSeller) return next(createError(403, 'seller can not create review!'));
  const {gigId, star, desc} = req.body;
  const newReview = new reviewModel({
    userId: req.userId,
    gigId: gigId,
    star: star,
    desc: desc
  });
  try {
    const review = await reviewModel.findOne({gigId: gigId, userId: req.userId});
    if(review) return next(createError(403, 'you already give review!'))
    const savedReview = await newReview.save();
    await gigModel.findByIdAndUpdate(gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 }
    })
    res.status(201).json(savedReview)
  } catch (error) {
    next(error)
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await reviewModel.find({gigId: req.params.id})
    res.status(201).json(reviews)
  } catch (error) {
    next(error)
  }
}