import { ErrorMessage, Field } from "formik"
import React from "react"

function JobFields() {
    return (
        <div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="employer">
                        Employer
                    </label>
                    <Field name="employer" type="text" className="form-control" />
                    <ErrorMessage name="employer" className="field-error">
                        {(msg) => <div style={{ color: "red", weight: "bold" }}>{msg.toUpperCase()}</div>}
                    </ErrorMessage>
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="position">
                        Position
                    </label>
                    <Field name="position" type="text" className="form-control" />
                    <ErrorMessage name="position" className="field-error">
                        {(msg) => <div style={{ color: "red", weight: "bold" }}>{msg.toUpperCase()}</div>}
                    </ErrorMessage>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="startDate">
                        Open Date
                    </label>
                    <Field name="startDate" type="date" className="form-control" defaultValue={null} />
                    <ErrorMessage name="startDate" component="div" className="field-error">
                        {(msg) => <div style={{ color: "red", weight: "bold" }}>{msg.toUpperCase()}</div>}
                    </ErrorMessage>
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="deadline">
                        Deadline
                    </label>
                    <Field name="deadline" type="date" className="form-control" defaultValue={null} />
                    <ErrorMessage name="deadline" component="div" className="field-error">
                        {(msg) => <div style={{ color: "red", weight: "bold" }}>{msg.toUpperCase()}</div>}
                    </ErrorMessage>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="location">
                        Location (City)
                    </label>
                    <Field name="location" type="text" className="form-control" />
                    <ErrorMessage name="location" component="div" className="field-error">
                        {(msg) => <div style={{ color: "red", weight: "bold" }}>{msg.toUpperCase()}</div>}
                    </ErrorMessage>
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="vacancies">
                        Vacancies
                    </label>
                    <Field name="vacancies" type="number" className="form-control" />
                    <ErrorMessage name="vacancies" component="div" className="field-error">
                        {(msg) => <div style={{ color: "red", weight: "bold" }}>{msg.toUpperCase()}</div>}
                    </ErrorMessage>
                </div>
            </div>
        </div>
    )
}

export default JobFields
