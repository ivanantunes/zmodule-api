import { Observable } from 'rxjs';
import { zIMailConfig } from './../interfaces';
import { zConfigMail } from '../configs';
import { zTranslateService } from './zTranslateService';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { zLoggerUtil } from '../utils';

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
     * Stores instance zTranslateService.
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    private tService = zTranslateService.getInstance();

    /**
     * @author Gabriel Alves <gbrextreme@hotmail.com>
     * @copyright Ivan Antunes 2021
     */
    private constructor() { }

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
     * Function to send custom mail
     * @author Ivam Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public sendCustomMail(mail: SendMailOptions, config: zIMailConfig): Observable<void> {
        return new Observable<void>((obs) => {
            const transport = nodemailer.createTransport({...config});

            if (mail.html && mail.text !== '') {
                mail.html = `${mail.text} <br><br><br> ${mail.html}`;
            }

            transport.sendMail(mail, (err: any, res: any) => {
                if (err) {
                    zLoggerUtil.error(err, `${this.tService.t('gnc_error_send_mail')}`);
                    obs.error(err.message);
                    obs.complete();
                } else {
                    obs.next();
                    obs.complete();
                }
            });
        });
    }

    /**
     * Function to send mail
     * @author Gabriel Alves <gbrextreme@hotmail.com>
     * @copyright Ivan Antunes 2021
     */
    public sendMail(mail: SendMailOptions): Observable<void> {
        return new Observable<void>((obs) => {
            const transport = nodemailer.createTransport(zConfigMail);

            if (mail.html && mail.text !== '') {
                mail.html = `${mail.text} <br><br><br> ${mail.html}`;
            }

            transport.sendMail(mail, (err: any, res: any) => {
                if (err) {
                    zLoggerUtil.error(err, `${this.tService.t('gnc_error_send_mail')}`);
                    obs.error(err.message);
                    obs.complete();
                } else {
                    obs.next();
                    obs.complete();
                }
            });
        });
    }
}
