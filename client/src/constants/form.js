export const FORM_URL = {
    mainForm: '',
    previewForm: '',
    imageLinks: '',
    saveDraft: '',
}

if (process.env.NODE_ENV === 'development'){
    FORM_URL.JobOrders = 'http://localhost:8000/JobOrders'
    FORM_URL.Submissions = 'http://localhost:8000/Submissions'
} else if (process.env.NODE_ENV === 'production') {
    FORM_URL.JobOrders = '/JobOrders/'
    FORM_URL.Submissions = '/Submissions/'
}