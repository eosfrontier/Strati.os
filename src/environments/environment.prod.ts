const SERVER_URL = 'http://localhost:5000';
const API_BASE = `${SERVER_URL}api/`;

export const environment = {
  production: false,
  API_URL: API_BASE,
  WEATHER: {
    API_URL: `${API_BASE}weather/`
  },
  SOCKET: {
    API_URL: `${API_BASE}io/`
  }
};
