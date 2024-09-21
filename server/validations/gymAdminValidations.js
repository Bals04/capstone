const yup = require('yup');

const gymAdminSchema = yup.object({
    firstname: yup.string().required('First name is required'),
    lastname: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
});

module.exports = gymAdminSchema;
