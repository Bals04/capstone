const { addPaymentRecord: addPaymentRecordToDb } = require('../models/database');

module.exports = {
    handleAddPaymentRecord: async (admin_id, gym_id, subscription_id, amount, payment_status) => {
        try {
            const result = await addPaymentRecordToDb(admin_id, gym_id, subscription_id, amount, payment_status);

            console.log("Database result:", result); // Log the result

            // Check if result is in expected format
            if (result && result.affectedRows > 0) {
                return { success: true, message: "Payment record added successfully" };
            } else {
                return { success: false, message: "Failed to add payment record" };
            }
        } catch (error) {
            console.error("Error adding payment record:", error);
            throw new Error("Internal Server Error");
        }
    }
};
