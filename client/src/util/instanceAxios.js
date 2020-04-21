import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        Accept: 'application/json, text/plain, */*',
    },
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken'
});

export default instance;