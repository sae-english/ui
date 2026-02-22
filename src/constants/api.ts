/**
 * Set to true to send all API requests to local backend.
 * false = production https://sae-polyglot.ru
 */
export const LOCAL = false;

const PRODUCTION_BASE_URL = 'https://sae-polyglot.ru';
const LOCAL_BASE_URL = 'http://localhost:808';

export const API_BASE_URL = LOCAL ? LOCAL_BASE_URL : PRODUCTION_BASE_URL;
