import { switchMap, toArray } from 'rxjs/operators';
import { concat, from, Observable, of, throwError } from 'rxjs';
import { zDatabaseService } from './zDatabaseService';
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
   * Stores instance zDatabaseService.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private dbService = zDatabaseService.getInstance();

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

  /**
   * Function used to insert no values in a given table.
   * @param {any | any[]} obj - Values to Insert.
   * @param {string} tableName - Table Name contains in database.
   * @returns Observable<any[]> | contains the values entered with the id
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public create(obj: any | any[], tableName: string): Observable<any[]> {

    return this.dbService.getConnection().pipe(
      switchMap((con) => {

        if (Array.isArray(obj)) {
          return concat(...obj.map((o) => from(con.models[tableName].create(o, {isNewRecord: true})))).pipe(
            toArray()
          ).pipe(
            switchMap((rows) => {
              const arrRows = rows.map((row) => row.get());

              return of(arrRows);

            })
          );
        } else {
          return from(con.models[tableName].create(obj, {isNewRecord: true})).pipe(
            switchMap((row) => of([row.get()]))
          );
        }

      })
    );

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
