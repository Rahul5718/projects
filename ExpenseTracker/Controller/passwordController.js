// Controller/passwordController.js

exports.verifyResetLink = async (req, res) => {
    try {
        const { id } = req.params; // The UUID from the URL

        const resetRequest = await ForgotPasswordRequest.findOne({ where: { id: id } });

        if (!resetRequest) {
            return res.status(404).send('<h1>Error: Invalid password reset link.</h1>');
        }

        // 🚨 CHECK IF ACTIVE
        if (!resetRequest.isActive) {
            return res.status(400).send('<h1>This link has already been used and is no longer active.</h1>');
        }

        // If active, redirect them to your frontend resetpassword.html form page 
        // passing the id along so the form knows which request to finalize
        return res.redirect(`/resetpassword.html?id=${id}`);

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

