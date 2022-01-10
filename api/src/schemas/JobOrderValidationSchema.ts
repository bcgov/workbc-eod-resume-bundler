var yup = require('yup');

export const JobOrderValidationSchema = yup.object().shape({
    employer: yup.string().required({ key: "employer", value: "employer is required field" }),
    position: yup.string().required({ key: "position", value: "position is a required field" }),
    startDate: yup.date().typeError({ key: "startDate", value: "a start date must be selected" }),
    deadline: yup.date().typeError({ key: "deadline", value: "a deadline must be selected" }),
    location: yup.string().required({ key: "location", value: "location is a required field" }),
    vacancies: yup.number()
        .required()
        .typeError("vacancies must be a number"),
    catchments: yup.array().min(1, { key: "catchment", value: "there must be at least one catchment chosen" }), //TODO: ensure it's a string array
    otherInformation: yup.string().max(1000, { key: "otherInformation", value: "the 'other information' field is 1000 characters max" }),
    jobDescription: yup.object(),
    user: yup.string().required()
});