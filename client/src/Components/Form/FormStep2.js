import React, { useState } from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'

function FormStep2() {
    return (
        <div className="form-group">
            <label className="control-label" htmlFor="textArea">Text Area:</label>
            <Field
                name="textArea"
                placeholder="Enter something"
                type="text"
                as="textarea"
                className="col-sm-10 form-control"
            />
            <ErrorMessage
                name="textArea"
                component="div"
                className="field-error"
            />
        </div>
    )
}

export default FormStep2