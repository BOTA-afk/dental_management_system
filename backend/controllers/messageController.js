import Message from "../models/Message.js";

// Fetch messages for a specific chat room
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    // Added 'time' to the destructuring to receive the string from your frontend
    const { chatId, text, isDoctor, time } = req.body;

    const newMessage = new Message({
      chatId,
      // Check if req.user exists; fallback to null if authentication is missing
      sender: req.user ? req.user._id : null, 
      text,
      isDoctor: isDoctor || false,
      time: time, // Saving the string time (e.g., "10:30 AM")
      timestamp: new Date()
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("SendMessage Error:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};