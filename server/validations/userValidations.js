const yup = require('yup');

const userSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().min(5,"The password must be atleast 5 characters long").max(12).required(),
});

module.exports = userSchema;
