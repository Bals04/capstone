const yup = require('yup');

const gymSchema = yup.object({
    admin_id: yup.string().required('Gym ID is required'),
    gymname: yup.string().required('Gym name is required'),
    daily_rate: yup.number()
        .typeError('Daily rate must be a valid number')
        .integer('Daily rate must be a whole number')
        .required('Daily rate is required'),
    monthly_rate: yup.number()
        .typeError('Monthly rate must be a valid number')
        .integer('Monthly rate must be a whole number')
        .required('Monthly rate is required'),
    contact_no: yup.number()
        .typeError('Contact number must be a valid number')
        .integer('Contact number must be a whole number') 
        .required('Contact number is required'),
    street_address: yup.string().required('Street Address is required'),
});

module.exports = gymSchema;
