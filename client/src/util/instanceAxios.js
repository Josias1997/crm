import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://213.32.78.171:8000/',
    headers: {
        Accept: 'application/json, text/plain, */*',
    },
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken'
});

export default instance;
