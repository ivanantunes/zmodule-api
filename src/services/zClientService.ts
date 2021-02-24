import { zTranslateService } from './zTranslateService';
import http from 'superagent';
import { Observable } from 'rxjs';

/**
 * Service that contains the functions related to the http client service.
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export class zClientService {

  /**
   * Stores zClientService Service Instance.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private static instance: zClientService | null;

  /**
   * Array with success status codes.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private statusCodeSuccess: number[] = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];


  /**
   * Stores instance zTranslateService.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private tService = zTranslateService.getInstance();

  /**
   *
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private constructor() { }

  /**
   * Function used to get instance of zClientService
   * @returns zClientService
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public static getInstance(): zClientService {

    if (!zClientService.instance) {
      zClientService.instance = new zClientService();
    }

    return zClientService.instance;

  }

  /**
   * Function used to destroy instance of zClientService.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public static destroyInstance(): void {

    zClientService.instance = null;

  }

  /**
   * Function Client Resquest.
   * @param {string} url - Url Request
   * @param {'GET' | 'POST'} type - Type Request.
   * @param {any} obj - Object Values
   * @param {any} customHeader - Object Custom Header Example { TOKEN: '1234', NAME: 'zModule' }
   * @returns Observable<{text: string, body: any}>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public request(url: string, type: 'GET' | 'POST', obj?: any, customHeader?: any): Observable<{ text: string, body: any }> {

    return new Observable<{ text: string, body: any }>((obs) => {
      let request: http.SuperAgentRequest;

      switch (type) {
        case 'GET':
          request = http.get(url).query(obj);
          break;
        case 'POST':
          request = http.post(url).send(obj);
          break;
        default:
          return obs.error(this.tService.t('gnc_lbl_type_not_found'));
      }

      if (customHeader) {
        Object.keys(customHeader).forEach((key) => {
          request.set(key, customHeader[key]);
        });
      }

      request.end((err, res) => {
        if (err) {
          return obs.error({
            text: err.response.text,
            body: err.response.body
          });
        }

        if (!this.statusCodeSuccess.find((status) => status === res.status)) {
          return obs.error({
            text: `${this.tService.t('gnc_internal_server_error')} ${this.tService.t('gnc_lbl_status_invalid')} ${res.status}`,
            body: res.body
          });
        }

        return obs.next({
          text: res.text,
          body: res.body
        });
      });
    });

  }

}
