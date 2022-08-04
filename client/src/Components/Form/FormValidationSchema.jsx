import "core-js/stable"
import * as yup from "yup"

const FormValidationSchema = yup.object().shape({
    emailTopics: yup.array().of(
        yup.object().shape({
            topicLink: yup.string().url("URL is invalid, example: https://workbc.ca")
        })
    ),
    emailTo: yup
        .array()
        .transform((value, originalValue) => {
            if (this.isType(value) && value !== null) {
                return value
            }
            return originalValue ? originalValue.split(/[\s;]+/) : []
        })
        .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
    emailCC: yup
        .array()
        .transform((value, originalValue) => {
            if (this.isType(value) && value !== null) {
                return value
            }
            return originalValue ? originalValue.split(/[\s;]+/) : []
        })
        .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
    emailBCC: yup
        .array()
        .transform((value, originalValue) => {
            if (this.isType(value) && value !== null) {
                return value
            }
            return originalValue ? originalValue.split(/[\s;]+/) : []
        })
        .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
    emailSubject: yup.string().required("Subject for the email is required")
})

export default FormValidationSchema
