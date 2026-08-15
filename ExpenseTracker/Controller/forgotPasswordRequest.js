// Controller/passwordController.js
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const {BrevoClient} = require('@getbrevo/brevo')
const nodemailer = require('nodemailer');
const User = require('../Model/UserdataSetCreation');
const ForgotPasswordRequest = require('../Model/forgotPassword');


exports.sendResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(200).json({ message: 'If this email is registered, a reset link will arrive shortly.' });
        }

        // 1. Generate unique UUID string tracking transaction
        const requestId = uuidv4();

        // 2. Log request state to relationship table
        await ForgotPasswordRequest.create({ 
            id: requestId,
            userId: user.id,
            isActive: true
        });

        // 3. Initialize Modern Brevo Client
        const brevo = new BrevoClient({ 
            apiKey: process.env.BREVO_API_KEY 
        });

        const resetUrl = `http://localhost:3000/password/resetpassword/${requestId}?id=${requestId}`;

        // 4. Send via modern Namespaced Client Promise
        await brevo.transactionalEmails.sendTransacEmail({
            subject: "Password Reset Instructions",
            htmlContent: `
                <h3>Reset Your Password</h3>
                <p>We received a request to update your account access credentials.</p>
                <p>Click the secure authorization link below to choose a new password:</p>
                <a href="${resetUrl}" target="_blank">${resetUrl}</a>
                <p><em>If you did not make this request, ignore this message safely.</em></p>
            `,
            sender: { 
                name: "ExpenseTracker Support", 
                email: process.env.SENDER_EMAIL 
            },
            to: [{ email: email }]
        });

        return res.status(200).json({ message: 'Reset instructions dispatched successfully.' });

    } catch (error) {
        console.error('Brevo API pipeline crash:', error);
        return res.status(500).json({ error: 'Failed to process email dispatch request.' });
    }
};

// B. Finalize database adjustments
exports.updatePasswordInDB = async (req, res) => {  // it use for  reset password srored in db
    try {
        const { id, newPassword } = req.body;

        // 1. Find request record entry 
        const resetRequest = await ForgotPasswordRequest.findOne({ where: { id: id } });

        if (!resetRequest) {
            return res.status(404).json({ message: 'Invalid token request reference.' });
        }

        // 2. Validate current operational structural flag
        if (!resetRequest.isActive) {
            return res.status(400).json({ message: 'Forbidden access: This reset link has expired or has already been used.' });
        }

        // 3. Collect specific assigned user entity
        const user = await User.findOne({ where: { id: resetRequest.userId } });
        if (!user) {
            return res.status(404).json({ message: 'Target profile structure missing.' });
        }

        // 4. Encrypt raw plaintext inputs securely
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // 5. Apply modifications and close state transactional windows
        user.password = hashedPassword;
        await user.save();

        resetRequest.isActive = false; // 🔒 Flips state to prevent future re-use attacks
        await resetRequest.save();

        return res.status(200).json({ message: 'Password updated successfully!' });

    } catch (error) {
        console.error('Finalization mapping mismatch:', error);
        return res.status(500).json({ error: 'Internal system fault recording parameters.' });
    }
};