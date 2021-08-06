export const FORM_URL = {
    mainForm: '',
    previewForm: '',
    imageLinks: '',
    saveDraft: '',
}

if (process.env.NODE_ENV === 'development'){
    FORM_URL.JobOrders = 'http://localhost:8000/JobOrders'
} else if (process.env.NODE_ENV === 'production') {
    FORM_URL.JobOrders = '/JobOrders'
}