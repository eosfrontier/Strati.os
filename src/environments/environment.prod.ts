const SERVER_URL = 'https://cic.eosfrontier.space/';
const API_BASE = `${SERVER_URL}api/`;

export const environment = {
  production: true,
  SERVER_URL: SERVER_URL,
  API_URL: API_BASE,
  WEATHER: {
    API_URL: `${API_BASE}weather/`
  },
  SOCKET: {
    API_URL: `${API_BASE}io/`
  },
  DATETIME: {
    API_URL: `${API_BASE}time/`
  },
  FOB: {
    API_URL: `${API_BASE}fob/`
  },
  MISSIONS: {
    API_URL: `${API_BASE}missions/`
  },
};
