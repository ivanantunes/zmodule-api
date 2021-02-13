/**
 * Database Configuration Interface.
 * @namespace Interfaces
 * @interface zIConfigDB
 * @property {string} DB_DIALECT - Database Type
 * @property {string} DB_HOST - Database Host
 * @property {string} DB_NAME - Database Name
 * @property {number} DB_PORT - Database Port
 * @property {string} DB_USER - Database User
 * @property {string} DB_PASSWORD - Database Password
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zIConfigDB {
    DB_DIALECT: string;
    DB_HOST: string;
    DB_NAME: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
}

/**
 * Module Configuration Interface.
 * @namespace Interfaces
 * @interface zIConfigModule
 * @property {string} MOD_LANG - Language system
 * @author Lucas Zaia <lucas.zaia30@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zIConfigModule {
    MOD_LANG: string;
}
