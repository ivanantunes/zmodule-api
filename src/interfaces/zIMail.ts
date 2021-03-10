/**
 * Module Mail Config Data Interface.
 * @interface zIMailOptions
 * @property {string} from - Mail sender
 * @property {string} to - Mail reciver
 * @property {string} subject - Mail subject
 * @property {string} text - Mail body
 * @property {string} html - Mail body html
 * @author Gabriel Alves <gbrextreme@hotmail.com>
 * @copyright Ivan Antunes 2021
 */

export interface zIMailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
}

/**
 * Module Mail Config Transporter Interface.
 * @interface zIMailConfig
 * @property {string} service - Mail service
 * @property {string} host - Mail host
 * @property {string} port - Mail port
 * @property {string} secure - Mail options to use authentication
 * @property {any} auth - Mail username and password
 * @property {any} tls - Mail reject unauthorized
 * @author Gabriel Alves <gbrextreme@hotmail.com>
 * @copyright Ivan Antunes 2021
 */

export interface zIMailConfig {
    service?: string;
    host: string;
    port?: string;
    secure?: boolean;
    auth: {
        user: string;
        pass: string;
    };
    tls?: {
        rejectUnauthorized: boolean;
    };
}
