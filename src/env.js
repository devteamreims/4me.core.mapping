/**
 * Wrapper around 4me.env
 */
import {} from 'dotenv/config';
import getEnv from '4me.env';

const env = getEnv(process.env.FOURME_ENV);

export default env;

export const clients = env.clients;
export const sectors = env.sectors;
