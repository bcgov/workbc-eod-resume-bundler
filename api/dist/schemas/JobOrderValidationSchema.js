"use strict";
var yup = require('yup');
var JobOrderValidationSchema = yup.object().shape({
    employer: yup.string().required(),
    position: yup.string().required(),
    startDate: yup.date().required(),
    deadline: yup.date().required(),
    location: yup.string().required(),
    vacancies: yup.number()
        .required()
        .typeError("vacancies must be a number"),
    catchments: yup.array().required().min(1, "there must be at least one catchment"),
    otherInformation: yup.string().max(1000, "the 'other information' field is 1000 characters max"),
    jobDescription: yup.object(),
    user: yup.string().required(),
    status: yup.string().required()
});
module.exports = JobOrderValidationSchema;
