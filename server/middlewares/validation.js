const validation = (schema) => async (req, res, next) => {
    const body = req.body;
    try {
        await schema.validate(body, { abortEarly: false }); // Ensuring that all validation errors are caught, not just the first one
        return next();
    } catch (error) {
        // Return only the error message
        const errorMessage = error.errors ? error.errors[0] : 'Validation failed'; // Taking the first error message
        return res.status(400).json({ message: errorMessage });
    }
};

module.exports = validation;