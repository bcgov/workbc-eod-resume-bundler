import React, { useState } from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'

function FormStep1() {
    return (
        <div className="form-group">
            <label className="control-label" htmlFor="textField">Text Field:</label>
            <Field
                name="textField"
                placeholder="Enter something"
                type="text"
                className="col-sm-10 form-control"
            />
            <ErrorMessage
                name="textField"
                component="div"
                className="field-error"
            />
        </div>
    )
}

export default FormStep1