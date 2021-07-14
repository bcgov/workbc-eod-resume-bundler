import * as yup from 'yup'
import 'core-js/stable';

export const FormValidationSchema = yup.object().shape({
  emailTopics: yup.array()
    .of(
      yup.object().shape({
        topicLink: yup.string().url("URL is invalid, example: https://workbc.ca")
      })
    ),
  emailTo: yup.array()
    .transform(function (value, originalValue) {
      if (this.isType(value) && value !== null) {
        return value;
      }
      return originalValue ? originalValue.split(/[\s;]+/) : [];
    })
    .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
  emailCC: yup.array()
    .transform(function (value, originalValue) {
      if (this.isType(value) && value !== null) {
        return value;
      }
      return originalValue ? originalValue.split(/[\s;]+/) : [];
    })
    .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
  emailBCC: yup.array()
    .transform(function (value, originalValue) {
      if (this.isType(value) && value !== null) {
        return value;
      }
      return originalValue ? originalValue.split(/[\s;]+/) : [];
    })
    .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
  emailSubject: yup.string()
    .required("Subject for the email is required")
})