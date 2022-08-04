import * as yup from "yup"

const SubmissionValidationSchema = yup.object().shape({
    catchment: yup.number().required("catchment is required field"),
    centre: yup.number().required("centre is a required field"),
    applicants: yup.array().of(
        yup.object({
            applicantID: yup.number(),
            clientName: yup.string().required(),
            clientCaseNumber: yup.string().required(),
            consent: yup.boolean().oneOf([true]),
            resume: yup.object({
                buffer: yup.string().required(),
                fileName: yup.string().required(),
                fileType: yup.string().required()
            })
        })
    )
})

export default SubmissionValidationSchema
