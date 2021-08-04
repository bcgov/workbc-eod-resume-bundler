import React, { useState } from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'

function EditJobFields() {
    return (
        <div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="employer">Employer</label>
                    <Field
                        name="employer"
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="employer"
                        component="div"
                        className="field-error"
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="startDate">Start Date</label>
                    <Field
                        name="startDate"
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="startDate"
                        component="div"
                        className="field-error"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="position">Position</label>
                    <Field
                        name="position"
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="position"
                        component="div"
                        className="field-error"
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="closingDate">Closing Date</label>
                    <Field
                        name="closingDate"
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="closingDate"
                        component="div"
                        className="field-error"
                    />
                </div>
            </div>
        </div>
    )
}

export default EditJobFields