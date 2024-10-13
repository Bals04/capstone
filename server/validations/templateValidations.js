const yup = require('yup');

const templateSchema = yup.object({
    template_name: yup.string().required("Template name is required"),
    description: yup.string().required("Template description is required"),
});

module.exports = templateSchema;
