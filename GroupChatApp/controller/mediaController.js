
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");
const Message = require('../model/message');
const sharp = require('sharp')

console.log("Checking AWS Key ID Presence:", !!process.env.AWS_ACCESS_KEY_ID);
console.log("Checking AWS Secret Key Presence:", !!process.env.AWS_SECRET_ACCESS_KEY);


const s3 = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1", 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
    }

});

async function runTest() {
    // console.log("Checking Region:", process.env.AWS_REGION || "ap-south-1");
    // console.log("Checking Access Key ID:", process.env.AWS_ACCESS_KEY_ID ? "FOUND" : "MISSING");
    
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME || "chatboxappmediabuckets",
            Key: "test-connection-file.txt",
            Body: "Connection Test Successful",
            ContentType: "text/plain"
        });
        
        await s3.send(command);
        console.log("✅ Success! Your credentials and bucket configuration are working perfectly.");
    } catch (err) {
        console.error("❌ S3 Test Failed!");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
    }
}

runTest();


exports.uploadMediaMessage = async (req, res) => {
    try {
        const file = req.file;
        const senderId = req.user.id;
        const { receiverId = null } = req.body;

        if (!file) {
            return res.status(400).json({ success: false, message: "No multimedia asset provided." });
        }

        // Generate an un-clashable unique filename hash
        const isImage = file.mimetype.startsWith('image/');
        const fileExtension = isImage ? '.jpg' : path.extname(file.originalname).toLowerCase();
        const uniqueFileName = `${crypto.randomBytes(16).toString("hex")}${fileExtension}`;
        const region = process.env.AWS_REGION || "ap-south-1";
        const normalizedReceiverId = receiverId && Number(receiverId) !== 0 ? Number(receiverId) : 0;

        let optimizedFileBuffer = file.buffer

        if (isImage) {
            optimizedFileBuffer = await sharp(file.buffer)
                .resize({width:800, withoutEnlargement:true})
                .jpeg({quality:80})
                .toBuffer()
        }
       
        // Build S3 Put Command Payload
        // Determine actual content type based on file
        let actualContentType = file.mimetype;
        if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/jpeg') {
            actualContentType = 'image/jpeg'; // Converted to JPEG by sharp
        }
        
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME || "chatboxappmediabuckets",
            Key: `uploads/${uniqueFileName}`,
            Body: optimizedFileBuffer,
            ContentType: actualContentType
        };

        // Command dispatch transaction block
        await s3.send(new PutObjectCommand(uploadParams));

        // Construct public cloud read URL location
        const s3MediaUrl = `https://${uploadParams.Bucket}.s3.${region}.amazonaws.com/${uploadParams.Key}`;

        // Save file location URL pointer directly to database message row text attribute
        const newMessage = await Message.create({
            text: s3MediaUrl, // Stored as the message body
            senderId: senderId,
            senderRole: req.user.role || 'user',
            receiverId: normalizedReceiverId
        });

        // Broadcast downstream automatically via system WebSockets instance setup
        const io = req.app.get('io');
        if (io) {
            let targetRoom = 'global';
            if (receiverId && Number(receiverId) !== 0) {
                const sortedIds = [Number(senderId), Number(receiverId)].sort((a, b) => a - b);
                targetRoom = `private-${sortedIds[0]}-${sortedIds[1]}`;
            }

            const mediaPayload = {
                id: newMessage.id,
                roomId: receiverId && Number(receiverId) !== 0 ? targetRoom : 'global',
                text: newMessage.text, // This is our structural S3 URL location string
                senderId: newMessage.senderId,
                senderName: req.user.name || 'You',
                isMedia: true,
                fileType: file.mimetype,
                createdAt: newMessage.createdAt
            };

            io.to(targetRoom).emit('new_message', mediaPayload);

            if (receiverId && Number(receiverId) !== 0) {
                io.to(String(receiverId)).emit('new_message', mediaPayload);
                io.to(String(receiverId)).emit('new_notification', {
                    type: 'personal',
                    senderId: newMessage.senderId,
                    senderName: req.user.name || 'You',
                    title: `New attachment from ${req.user.name || 'You'}`,
                    message: 'Sent you a file',
                    timestamp: new Date()
                });
            }
        }
        return res.status(201).json({ 
            success: true, 
            message: "File uploaded and sent successfully",
            url: s3MediaUrl,
            messageId: newMessage.id
        });

    } catch (error) {
        console.error("AWS S3 Transmission pipeline system fault:", error);
        console.error("Error details:", error.message, error.code);
        
        // Specific error messages
        if (error.message.includes('NoSuchBucket')) {
            return res.status(400).json({ success: false, message: "AWS bucket not found. Check AWS_BUCKET_NAME." });
        }
        if (error.message.includes('AccessDenied') || error.message.includes('InvalidAccessKeyId')) {
            return res.status(403).json({ success: false, message: "AWS credentials invalid or insufficient permissions." });
        }
        if (error.message.includes('ENOENT') || error.message.includes('file')) {
            return res.status(400).json({ success: false, message: "File processing failed. Try again." });
        }
        
        return res.status(500).json({ success: false, message: "Cloud multi-part media upload failed.", error: error.message });
    }
}