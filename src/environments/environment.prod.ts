const SERVER_URL = 'https://cic.eosfrontier.space/';
const API_BASE = `${SERVER_URL}api/`;
const API_ORTHANC = `https://api.eosfrontier.space/orthanc/`

export const environment = {
  production: true,
  SERVER_URL,
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
  SHUTTLE: {
    API_URL: `${API_ORTHANC}v2/shuttlebay/`
  }
};
