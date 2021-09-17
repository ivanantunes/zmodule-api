import { zIMailConfig } from './../interfaces';
import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

/**
 * Contains mail settings.
 * @constant zConfigMail
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export const zConfigMail: zIMailConfig = {
    host: String(process.env.MAIL_HOST),
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: String(process.env.MAIL_USER),
        pass: String(process.env.MAIL_PASSWORD)
    },
    secure: Boolean(process.env.MAIL_SECURE === 'true' ? true : false),
    service: String(process.env.MAIL_SERVICE),
    tls: {
        rejectUnauthorized: Boolean(process.env.MAIL_TLS_REJECT === 'true' ? true : false),
    }
};
