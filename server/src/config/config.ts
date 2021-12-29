export const Config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8080,
    MODE: process.env.MODE || 'noCluster',
    DB_NAME: process.env.DB_NAME || 'ecommerce',
    ALTAS_DB_USER: process.env.ATLAS_DB_USER || 'user',
    ATLAS_DB_PASSWORD: process.env.ATLAS_DB_PASSWORD || 'password',
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || 'asdfg1234',
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || '1234asdfg',
}