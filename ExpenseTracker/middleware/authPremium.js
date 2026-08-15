exports.verifyPremium = async (req, res, next) => {
    try {
        // Assuming your standard auth middleware attaches the user object to req.user
        const user = req.user; 

        if (!user || !user.isPremiumUser) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: This is a premium feature." 
            });
        }

        next(); // User is premium, proceed to the controller
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
