/**
 * In DEV only: set to true to send API requests to local backend.
 * In PROD this flag is ignored — always uses production URL.
 */
export const LOCAL = true;

const PRODUCTION_BASE_URL = 'https://sae-polyglot.ru';
const LOCAL_BASE_URL = 'http://127.0.0.1:8080';

export const API_BASE_URL =
  import.meta.env.PROD ? PRODUCTION_BASE_URL : (LOCAL ? LOCAL_BASE_URL : PRODUCTION_BASE_URL);
