const yup = require('yup');

const trainerSchema = yup.object({
    gymid: yup.string().required('Gym ID is required'),
    firstname: yup.string().required('First name is required'),
    lastname: yup.string().required('Last name is required'),
    bio: yup.string().required('Bio is required'),
    experience: yup.number()
        .typeError('Experience must be a valid number') // Custom message for type error
        .integer('Experience must be a whole number')   // Custom message for integer validation
        .required('Experience is required'),
    rates: yup.number()
        .typeError('Rates must be a valid number')      // Custom message for type error
        .integer('Rates must be a whole number')        // Custom message for integer validation
        .required('Rates are required'),
    trainerType: yup.string().required('Trainer type is required'),
});

module.exports = trainerSchema;
