import { zTranslateService } from './zTranslateService';

/**
 * Service that contains the functions related to the web service.
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export class zWebService {

  /**
   * Stores zWebService Service Instance.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private static instance: zWebService | null;


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
   * Function used to get instance of zWebService
   * @returns zWebService
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public static getInstance(): zWebService {

    if (!zWebService.instance) {
      zWebService.instance = new zWebService();
    }

    return zWebService.instance;

  }

  /**
   * Function used to destroy instance of zWebService.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public static destroyInstance(): void {

    zWebService.instance = null;

  }

}
