import axios from 'axios';

const apiUrl = process.env.API_URL;

const apiClientBlob = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Ensure cookies are sent with requests
  responseType: 'blob',
});

// No need to manually handle cookies in localStorage
apiClientBlob.interceptors.response.use(
  (response) => {
    // Response handling logic
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClientBlob.interceptors.request.use(
  (config) => {
    // Request configuration logic
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClientBlob;
