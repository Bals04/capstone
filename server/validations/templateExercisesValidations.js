const yup = require('yup');

const exerciseSchema = yup.object({
    exercise_name: yup.string().required("Exercise name is required"),
    reps: yup.number()
        .typeError('Reps must be a valid number')
        .integer('Reps must be a whole number')
        .min(0, 'Reps cannot be negative') // Ensures reps are non-negative
        .required('Reps is required'),
    sets: yup.number()
        .typeError('Sets must be a valid number')
        .integer('Sets must be a whole number')
        .min(0, 'Sets cannot be negative') // Ensures sets are non-negative
        .required('Sets is required'),
    week_no: yup.string().required("Week number is required"),
    day_no: yup.string().required("Day number is required"),
});

module.exports = exerciseSchema;
