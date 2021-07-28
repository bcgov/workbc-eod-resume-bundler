export const FORM_URL = {
    mainForm: '',
    previewForm: '',
    imageLinks: '',
    saveDraft: '',
}

if (process.env.NODE_ENV === 'development'){
    FORM_URL.mainForm = 'http://localhost:8000/api/createJobOrder/create'
} else if (process.env.NODE_ENV === 'production') {
    FORM_URL.mainForm = '/api/createJobOrder/create'
}