import { Observable, of, throwError } from 'rxjs';
import { zTranslateService } from './zTranslateService';

/**
 * Service that contains the functions related to the crud (create, read, update, delete).
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export class zCrudService {

  /**
   * Stores zCrudService Service Instance.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private static instance: zCrudService | null;

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
   * Function used to get instance of zCrudService
   * @returns zCrudService
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public static getInstance(): zCrudService {

    if (!zCrudService.instance) {
      zCrudService.instance = new zCrudService();
    }

    return zCrudService.instance;

  }

  /**
   * Function used to destroy instance of zCrudService.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public static destroyInstance(): void {

    zCrudService.instance = null;

  }

  public create(): Observable<any> {
    return throwError('Method is not Implemented.');
  }

  public update(): Observable<any> {
    return throwError('Method is not Implemented.');
  }

  public delete(): Observable<any> {
    return throwError('Method is not Implemented.');
  }

  public find(): Observable<any> {
    return throwError('Method is not Implemented.');
  }

  public findByIndex(): Observable<any> {
    return throwError('Method is not Implemented.');
  }

  public findAll(): Observable<any> {
    return throwError('Method is not Implemented.');
  }

  public findAndCountAll(): Observable<any> {
    return throwError('Method is not Implemented.');
  }

}
