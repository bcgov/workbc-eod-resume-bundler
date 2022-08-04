import { ErrorMessage, Field } from "formik"
import React from "react"

function EditJobFields() {
    return (
        <div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="employer">
                        Employer
                    </label>
                    <Field name="employer" type="text" className="form-control" />
                    <ErrorMessage name="employer" component="div" className="field-error" />
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="startDate">
                        Open Date
                    </label>
                    <Field name="startDate" type="date" className="form-control" />
                    <ErrorMessage name="startDate" component="div" className="field-error" />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="position">
                        Position
                    </label>
                    <Field name="position" type="text" className="form-control" />
                    <ErrorMessage name="position" component="div" className="field-error" />
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="deadline">
                        Deadline
                    </label>
                    <Field name="deadline" type="date" className="form-control" />
                    <ErrorMessage name="deadline" component="div" className="field-error" />
                </div>
            </div>
        </div>
    )
}

export default EditJobFields
