import conversationModel from '../models/conversation.model.js';
import { createError } from '../utils/error.handler.js';

export const createConversation = async (req, res, next) => {
  const newConversation = new conversationModel({
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(201).send(savedConversation);
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await conversationModel.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          readBySeller: true,
          readByBuyer: true,
        },
      },
      { new: true }
    );
    res.status(201).send(updatedConversation);
  } catch (error) {
    next(error);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await conversationModel.findOne({id: req.params.id})
    if(!conversation) return next(createError(404, 'Conversation not found!'))
    res.status(200).send(conversation)
  } catch (error) {
    next(error)
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await conversationModel.find(req.isSeller ? {sellerId: req.userId} : {buyerId: req.userId})
    if(!conversations) return next(createError(404, 'Conversation not found!'))
    res.status(200).send(conversations)
  } catch (error) {
    next(error)
  }
};

