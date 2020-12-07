const Room = require("../models/room");
const Message = require("../models/message");
const Product = require("../models/product");

exports.sendMessage = async ({ product_id, user_id, customer_id, message }) => {
  try {
    let room = await Room.create({
      channel: `${product_id}${user_id}${customer_id}`,
      product: product_id,
      seller: user_id,
      customer: customer_id,
      isAdmin: true,
    });
    let message = await Message.create({
      message: message,
      sender: customer_id,
      recepient: seller_id,
      room: room._id,
    });
    room.lastMessage = message.message;
    room.save();
  } catch (err) {
    return next(err);
  }
};

exports.createMessage = async (req, res, next) => {
  try {
    let { seller_id, user_id, product_id } = req.params;
    let product = await Product.findById(product_id);
    let roomExist = await Room.findOne({
      channel: `${product_id}${seller_id}${user_id}`,
    });
    if (roomExist) {
      let message = await Message.create({
        message: req.body.message,
        sender: user_id,
        recepient: seller_id,
        room: roomExist._id,
      });
      product.bids += 1;
      product.save();
      roomExist.lastMessage = message.message;
      roomExist.sellerToRead += 1;
      roomExist.save()
      return res.status(200).json(message);
    } else {
      let room = await Room.create({
        channel: `${product_id}${seller_id}${user_id}`,
        product: product_id,
        seller: seller_id,
        customer: user_id,
      });
      let message = await Message.create({
        message: req.body.message,
        sender: user_id,
        recepient: seller_id,
        room: room._id,
      });
      room.lastMessage = message.message;
      room.sellerToRead += 1;
      room.save();
      product.bids += 1;
      product.save();
      return res.status(200).json(message);
    }
  } catch (err) {
    return next(err);
  }
};

exports.getRooms = async (req, res, next) => {
  try {
    let { user_id } = req.params;
    let rooms = await Room.find({
      $or: [{ seller: user_id }, { customer: user_id }],
    })
      .sort({ updatedAt: -1 })
      .populate("seller", "firstName lastName username isBusiness profilePicture")
      .populate("customer", "firstName lastName username isBusiness profilePicture")
      .lean()
      .exec();
    return res.status(200).json(rooms);
  } catch (err) {
    return next(err);
  }
};

exports.getLastRooms = async (req, res, next) => {
  try {
    let { user_id } = req.params;
    let rooms = await Room.find({
      $or: [{ seller: user_id }, { customer: user_id }],
    })
      .sort({ updatedAt: -1 })
      .populate("seller", "firstName lastName username isBusiness profilePicture")
      .populate("customer", "firstName lastName username isBusiness profilePicture")
      .limit(6)
      .lean()
      .exec();
    return res.status(200).json(rooms);
  } catch (err) {
    return next(err);
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    let { room_id } = req.params;
    let room = await Room.findById(room_id)
      .populate("seller", "firstName lastName username isBusiness profilePicture department faculty averageRating")
      .populate("customer", "firstName lastName username isBusiness profilePicture department faculty averageRating")
      .populate("product", "title images quantity isPaused")
      .lean()
      .exec()
      return res.status(200).json(room);
  } catch (err) {
    return next(err);
  }
};

exports.getMessageHistory = async (req, res, next) => {
  try {
    let { room_id, user_id } = req.params;
    let room = await Room.findById(room_id)
    let messages = await Message.find({
      room: room_id,
    })
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName username isBusiness profilePicture")
      .populate("recepient", "firstName lastName username isBusiness profilePicture")
      .lean()
      .exec();

    if(user_id === room.seller){
      room.sellerToRead = 0
      await room.save()
    } else {
      room.customerToRead = 0
      await room.save()
    }
    
    return res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
};

exports.replyMessage = async (req, res, next) => {
  try {
    let { room_id, user_id, recepient_id } = req.params;
    let room = await Room.findById(room_id);
    if (!req.body.offer) {
      let message = await Message.create({
        message: req.body.message,
        sender: user_id,
        recepient: recepient_id,
        room: room._id,
      });
      let theMessage = await Message.findById(message._id)
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName username isBusiness profilePicture")
      .populate("recepient", "firstName lastName username isBusiness profilePicture")
      .lean()
      .exec();
      if(user_id === room.seller){
        room.customerToRead += 1;
      } else {
        room.sellerToRead += 1;
      }
      room.lastMessage = message.message;
      room.save();
      return res.status(200).json(theMessage);
    } else {
      let message = await Message.create({
        message: "This is my offer",
        sender: user_id,
        recepient: recepient_id,
        room: room._id,
        offer: req.body.offer,
        containsOffer: true,
      });
      room.lastMessage = message.message;
      room.save();
      let theMessage = await Message.findById(message._id)
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName username isBusiness profilePicture")
      .populate("recepient", "firstName lastName username isBusiness profilePicture")
      .lean()
      .exec();
      return res.status(200).json(theMessage);
    }
  } catch (err) {
    return next(err);
  }
};
