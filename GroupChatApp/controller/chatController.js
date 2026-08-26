// controllers/chatController.js
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
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

        return res.status(200).json({ success: true, messages: combinedUnifiedHistory });
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

        // Query the database by email or name
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: query.trim() },
                    { name: query.trim() },
                    ...(Number.isInteger(Number(query.trim())) ? [{ id: Number(query.trim()) }] : [])
                ]
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User matching footprint was not found." });
        }

        // Return exactly what your frontend structure expects
        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Backend user search error:", error);
        return res.status(500).json({ success: false, message: "Internal server registry error." });
    }
};