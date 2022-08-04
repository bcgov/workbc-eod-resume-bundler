import * as yup from "yup"

const JobOrderValidationSchema = yup.object().shape({
    employer: yup.string().required("employer is required field"),
    position: yup.string().required("position is a required field"),
    startDate: yup.date().typeError("a start date must be selected"),
    deadline: yup.date().typeError("a deadline must be selected"),
    location: yup.string().required("location is a required field"),
    vacancies: yup.number().required().typeError("vacancies must be a number"),
    catchments: yup.array().min(1, "there must be at least one catchment chosen"), // TODO: ensure it's a string array
    otherInformation: yup.string().max(1000, "the 'other information' field is 1000 characters max"),
    jobDescription: yup.object(),
    user: yup.string().required()
})

export default JobOrderValidationSchema
