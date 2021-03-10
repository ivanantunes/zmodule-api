import { zIMailOptions } from './../interfaces';
import { zIMailConfig } from './../interfaces';
const nodemailer = require('nodemailer');

/**
 * Module mailing service.
 * @author Gabriel Alves <gbrextreme@hotmail.com>
 * @copyright Ivan Antunes 2021
 */

export class zMailService {
    /**
     * Stores zMailService Instance.
     * @author Gabriel Alves <gbrextreme@hotmail.com>
     * @copyright Ivan Antunes 2021
     */
    private static instance: zMailService | null;

    /**
     * @author Gabriel Alves <gbrextreme@hotmail.com>
     * @copyright Ivan Antunes 2021
     */
    private constructor() {}

    /**
     * Function used to get instance of zMailService
     * @author Gabriel Alves <gbrextreme@hotmail.com>
     * @copyright Ivan Antunes 2021
     */
    public static getInstance(): zMailService {
        if (!zMailService.instance) {
            zMailService.instance = new zMailService();
        }
        return zMailService.instance;
    }

    /**
     * Function used to destroy instance of zMailService
     * @author Gabriel Alves <gbrextreme@hotmail.com>
     * @copyright Ivan Antunes 2021
     */
    public static destroyInstance(): void {
        zMailService.instance = null;
    }

    /**
     *
     * @author Gabriel Alves <gbrextreme@hotmail.com>
     * @copyright Ivan Antunes 2021
     */
    public sendMail(mailOptions: zIMailOptions, transport: zIMailConfig | string): void {
        const transporter = nodemailer.createTransport(transport);
        transporter.sendMail(mailOptions, (err: any, res: any) => {
            if (err) {
                return console.log('error ' + err.message);
            }
            console.log('Mensage sent ' + res.response);
        });
    }
}
