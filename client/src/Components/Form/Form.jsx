import { Form, Formik } from "formik"
import React, { useState } from "react"
import { useHistory, withRouter } from "react-router-dom"
import FORM_URL from "../../constants/form"
import FormStep1 from "./FormStep1"
import FormStep2 from "./FormStep2"
import FormValidationSchema from "./FormValidationSchema"
import ProgressTracker from "./ProgressTrackers"

function ComposeEmail() {
    const h = useHistory()
    const [step, setStep] = useState(1)

    const initialValues = {}

    const _next = () => {
        if (step >= 2) {
            setStep(2)
        } else {
            setStep(step + 1)
        }
    }

    const _prev = () => {
        if (step <= 1) {
            setStep(1)
        } else {
            setStep(step - 1)
        }
    }

    const previousButton = () => {
        const currentStep = step
        if (currentStep !== 1) {
            return (
                <button className="btn btn-secondary" type="button" onClick={() => _prev()}>
                    Previous
                </button>
            )
        }
        return null
    }

    const nextButton = () => {
        if (step < 2) {
            return (
                <button className="btn btn-primary float-right" type="button" onClick={() => _next()}>
                    Next
                </button>
            )
        }
        return null
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>ELMSD Form Sample</h1>
                    {console.log(step)}
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values, { setErrors, setSubmitting }) => {
                            fetch(FORM_URL.mainForm, {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(values)
                            })
                                .then((res) => res.json())
                                .then((resp) => {
                                    console.log(resp)
                                    if (resp.err) {
                                        setErrors(resp.err)
                                        setSubmitting(false)
                                    } else {
                                        setSubmitting(false)
                                        h.push("/successForm")
                                    }
                                })
                        }}
                        validationSchema={FormValidationSchema}
                    >
                        {() => (
                            <div>
                                <ProgressTracker currentStep={step} />
                                <Form>
                                    {step === 1 && <FormStep1 />}
                                    {step === 2 && <FormStep2 />}

                                    {nextButton()}
                                    {previousButton()}
                                </Form>
                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default withRouter(ComposeEmail)
