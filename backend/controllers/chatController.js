import Chat from "../models/Chat.js";

export const getMyChats = async (req, res) => {
  try {
    // 1. Safety Check: If middleware failed to set req.user
    if (!req.user) {
      return res.status(401).json({ message: "User not found, please login again." });
    }

    console.log("Searching for chats for user ID:", req.user._id);

    // 2. Query using the user ID
    const chats = await Chat.find({ participants: req.user._id });
    
    // 3. Log results
    console.log("Found these chats:", chats);
    
    res.status(200).json(chats);
  } catch (error) {
    console.error("Chat fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};