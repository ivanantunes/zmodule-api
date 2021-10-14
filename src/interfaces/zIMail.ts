/**
 * Module Mail Config Transporter Interface.
 * @interface zIMailConfig
 * @property {string} service - Mail service
 * @property {string} host - Mail host
 * @property {string} port - Mail port
 * @property {string} secure - Mail options to use authentication
 * @property {zIMailLogin} auth - Mail username and password
 * @property {zIMailTls} tls - Mail Transport Layer Security Options
 * @author Gabriel Alves <gbrextreme@hotmail.com>
 * @copyright Ivan Antunes 2021
 */

export interface zIMailConfig {
    service?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    auth: zIMailLogin;
    tls?: zIMailTls;
}

/**
 * Mail Login Options
 * @interface zIMailLogin
 * @property {string} user - Mail User
 * @property {string} pass - Mail Password
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zIMailLogin {
    user: string;
    pass: string;
}

/**
 * Transport Layer Security Options
 * @interface zIMailTls
 * @property {boolean} rejectUnauthorized - Unauthorized reject?
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zIMailTls {
    rejectUnauthorized: boolean;
}
