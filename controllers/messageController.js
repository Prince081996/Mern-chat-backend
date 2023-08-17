const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Thread = require("../models/threadModel")

const populateQuery = [
  { path: "participants", select: "_id name", options: { lean: true } },
];

const findThread = async(req,res) => {
  const {sender_id,receiver_id} = req.query
  console.log(receiver_id,"wokring",sender_id)
  const threadPayload = {
    participants:[receiver_id,sender_id]
  }
  const thread = await Thread.findOne({participants:{$all:threadPayload.participants}})
  if(thread) {
    return res.sendStatus(200).json(thread)
  }
  return res.status(200).send({ is_thread_created:false})


}
const getOrcreateThread = async(req,res) => {
  const { sender_id,thread_id,is_thread_created, receivers} = req.body
  let threadPayload = {
    participants:[...receivers,sender_id]
  }
  let thread
  try {

    
  } catch (error) {
   return res.send(400).message("error ") 
  }




  // const thread = await Thread.create()
}
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, is_thread_created,thread_id } = req.body;
  console.log(is_thread_created,"isthread")

  if (!content || !chatId || !is_thread_created || !thread_id) {
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  if(!is_thread_created){
    thread = await Thread.create(threadPayload).populate("_id")
      return thread
    } else {
      thread = await Thread.findById(thread_id).populate("_id")
        .lean();
    }
    return res.status(200).send(thread)
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } 
  catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "name pic email"
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = { allMessages, sendMessage,findThread };
