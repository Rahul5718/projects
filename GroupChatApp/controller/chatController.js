// controllers/chatController.js
const jwt = require('jsonwebtoken');
const sequelize = require('../util/Database');
const {QueryTypes, where}= require('sequelize')
const Message = require('../model/message')
const { Op } = require('sequelize')
const OldMessage = require('../model/oldMessage')
const User = require('../model/user')

const JWT_SECRET = '98745632'; // must match ScriptController


function extractBearerToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return null;
  return parts[1];
}

function requireAuth(req, res) {
  const token = extractBearerToken(req);
  if (!token) {
    res.status(401).json({ success: false, message: 'Access token missing' });
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (e) {
    res.status(403).json({ success: false, message: 'Invalid or expired token' });
    return null;
  }
}

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const senderId = req.user.id;
    const senderName = req.user.name || 'Anonymous';
    const senderRole = req.user.role || 'user';
    let receiverId = req.body.receiverId;

    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User context not found' });
    }

    if (receiverId === undefined || receiverId === null || receiverId === 'null' || receiverId === '' || Number(receiverId) === 0) {
      receiverId = 0;
    } else {
      receiverId = Number(receiverId);
    }

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message content cannot be blank' });
    }

    // Save message to MySQL
    const newMessage = await Message.create({
      senderId: senderId,
      receiverId: receiverId,
      text: text.trim(),
      senderRole: senderRole,
      createdAt: new Date()
    });

    const io = req.app.get('io');

    if (io) {
      let targetRoom = 'global';
      if (receiverId !== 0) {
        const sortedIds = [Number(senderId), Number(receiverId)].sort((a, b) => a - b);
        targetRoom = `private-${sortedIds[0]}-${sortedIds[1]}`;
      }

      const messagePayload = {
        id: newMessage.id,
        text: newMessage.text,
        senderId: senderId,
        receiverId: receiverId,
        roomId: targetRoom,
        type: receiverId === 0 ? 'group' : 'personal',
        senderName: senderName,
        senderRole: senderRole,
        createdAt: newMessage.createdAt
      };

      // 1. Emit to the room (global or private room)
      io.to(targetRoom).emit('new_message', messagePayload);

      // 2. Extra direct user push for private chats (for alerts/sidebars)
      if (receiverId !== 0) {
        io.to(String(receiverId)).emit('new_message', messagePayload);
        io.to(String(receiverId)).emit('new_notification', {
          type: 'personal',
          senderId,
          senderName,
          title: `New message from ${senderName}`,
          message: text.trim(),
          roomId: targetRoom,
          timestamp: new Date()
        });
      }
    }

    return res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    console.error('Database Write Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to record chat message' });
  }
};

exports.getChatHistory = async (req, res) => {
    try {
       const currentUserId = req.user.id
       const targetId = req.query.with

       let queryFilter = {receiverId :0}

       if(targetId){
           queryFilter ={
            [Op.or]:[
                {
                    senderId:currentUserId,receiverId:Number(targetId)
                },
                {
                    senderId:Number(targetId),receiverId:currentUserId
                }
            ]
        }
       }

       const [archivedHistory, activeHistory] = await Promise.all([
            OldMessage.findAll({
                where: queryFilter,
                order: [['createdAt', 'ASC']]
            }),
            Message.findAll({
                where: queryFilter,
                order: [['createdAt', 'ASC']]
            })
        ])

         const combinedUnifiedHistory = [...archivedHistory, ...activeHistory]
         const senderIds = [...new Set(combinedUnifiedHistory.map(message => message.senderId))]
         const users = await User.findAll({
           where: { id: { [Op.in]: senderIds } },
           attributes: ['id', 'name']
         })
         const senderNames = new Map(users.map(user => [user.id, user.name]))
         const messagesWithSenderNames = combinedUnifiedHistory.map(message => ({
           ...message.toJSON(),
           senderName: senderNames.get(message.senderId) || 'User'
         }))

         return res.status(200).json({ success: true, messages: messagesWithSenderNames });
    } catch (err) {
        console.error('Database Extraction Query Fault:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

exports.searchUser = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search footprint target is required." });
        }

        const searchValue = query.trim();
        const users = await User.findAll({
          where: {
            [Op.or]: [
              { email: { [Op.like]: `%${searchValue}%` } },
              { name: { [Op.like]: `%${searchValue}%` } },
              ...(Number.isInteger(Number(searchValue)) ? [{ id: Number(searchValue) }] : [])
            ]
          },
          attributes: ['id', 'name', 'email'],
          order: [['name', 'ASC']],
          limit: 20
        });

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "User matching footprint was not found." });
        }

        const matchingUsers = [...new Map(users.map(user => [user.id, {
          id: user.id,
          name: user.name,
          email: user.email
        }])).values()];
        const normalizedSearchValue = searchValue.toLowerCase();
        matchingUsers.sort((leftUser, rightUser) => {
          const leftIsExactEmail = leftUser.email.toLowerCase() === normalizedSearchValue;
          const rightIsExactEmail = rightUser.email.toLowerCase() === normalizedSearchValue;
          if (leftIsExactEmail !== rightIsExactEmail) return leftIsExactEmail ? -1 : 1;
          return leftUser.name.localeCompare(rightUser.name);
        });

        return res.status(200).json({
            success: true,
          user: matchingUsers[0],
          users: matchingUsers
        });

    } catch (error) {
        console.error("Backend user search error:", error);
        return res.status(500).json({ success: false, message: "Internal server registry error." });
    }
};