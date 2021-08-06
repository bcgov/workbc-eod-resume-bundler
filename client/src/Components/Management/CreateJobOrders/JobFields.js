import React, { useState } from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'

function JobFields() {
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
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="startDate">Open Date</label>
                    <Field
                        name="startDate"
                        type="date"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="startDate"
                        component="div"
                        className="field-error"
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="deadline">Deadline</label>
                    <Field
                        name="deadline"
                        type="date"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="deadline"
                        component="div"
                        className="field-error"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="location">Location (City)</label>
                    <Field
                        name="location"
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="location"
                        component="div"
                        className="field-error"
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="vacancies">Vacancies</label>
                    <Field
                        name="vacancies"
                        type="number"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="vacancies"
                        component="div"
                        className="field-error"
                    />
                </div>
            </div>
        </div>
    )
}

export default JobFields