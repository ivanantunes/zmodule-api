import dotenv from 'dotenv';
import { zIConfigDB } from './../interfaces/zIConfigs';

dotenv.config({
    path: '.env'
});

/**
 * Contains the values that are used to configure the database.
 * @constant {zIConfigDB} zConfigDB - Databse Config
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export const zConfigDB: zIConfigDB = {
    DB_DIALECT: String(process.env.DB_DIALECT || 'mysql'),
    DB_HOST: String(process.env.DB_HOST || 'localhost'),
    DB_NAME: String(process.env.DB_NAME || 'zmodule_api'),
    DB_PORT: Number(process.env.DB_PORT || 3306),
    DB_USER: String(process.env.DB_USER || 'root'),
    DB_PASSWORD: String(process.env.DB_PASSWORD || '')
};
