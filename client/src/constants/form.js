export const FORM_URL = {
    mainForm: '',
    previewForm: '',
    imageLinks: '',
    saveDraft: '',
}

if (process.env.NODE_ENV === 'development'){
    FORM_URL.mainForm = 'http://localhost:8000/api/form'
} else if (process.env.NODE_ENV === 'production') {
    FORM_URL.mainForm = '/api/form'
}