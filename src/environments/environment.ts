const SERVER_URL = 'http://localhost:5000/';
const API_BASE = `${SERVER_URL}api/`;

export const environment = {
  production: false,
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
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
