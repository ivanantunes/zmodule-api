import { zConfigDB } from '../configs';
import { Dialect, Sequelize } from 'sequelize';
import { from, Observable, of, throwError } from 'rxjs';
import { zIConfigDB } from '../interfaces';
import { catchError, delay, retryWhen, switchMap, tap } from 'rxjs/operators';

/**
 * Serviço que contém as funções relacionada ao banco de dados.
 * @namespace Services
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export class zDatabaseService {

  /**
   * Stores zDatabaseService Service Instance.
   * @var {zDatabaseService | null} instance
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private static instance: zDatabaseService | null;

  /**
   * Sequelize instance containing the database connection.
   * @var {Sequelize | null} connection
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private connection: Sequelize | null = null;

  /**
   * Stores if initialized service.
   * @var {boolean} isInitialized
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private isInitialized = false;

  /**
   * @constructor Executes the database connection function and stores it.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private constructor() {
    this.connectionDatabase(zConfigDB).subscribe((con) => {
      this.connection = con;
      // TODO: Add Translate
      console.log('Connected to the database successfully.');
      this.isInitialized = true;
    }, (err) => {
      // TODO: add Translate
      throw new Error(`Failed Conncection Database: ${err}`);
    });
  }

  /**
   * Function used to get instance of zDatabaseService
   * @returns zDatabaseService
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public static getInstance(): zDatabaseService {

    if (!zDatabaseService.instance) {
      zDatabaseService.instance = new zDatabaseService();
    }

    return zDatabaseService.instance;

  }

  /**
   * Function used to destroy instance of zDatabaseService
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public static destroyInstance(): void {

    zDatabaseService.instance = null;

  }

  /**
   * Function to take the selected bank type in addition to checking if it is valid.
   * @param {string} dialect - Database type.
   * @returns Observable<Dialect>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private getDialectDatabase(dialect: string): Observable<Dialect> {

    switch (dialect) {
      case 'mysql':
        return of('mysql');
      case 'postgres':
        return of('postgres');
      case 'mariadb':
        return of('mariadb');
      case 'mssql':
        return of('mssql');
      default:
        // TODO: Add Translate.
        return throwError('Dialect is not Supported.');
    }

  }

  /**
   * Function responsible for connecting to the database and testing the connection.
   * @param {zIConfigDB} config - Database Configs
   * @returns Observable<Sequelize>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private connectionDatabase(config: zIConfigDB): Observable<Sequelize> {

    return this.getDialectDatabase(config.DB_DIALECT).pipe(
      switchMap((currentDialect) => {
        return of(new Sequelize({
          database: config.DB_NAME,
          username: config.DB_USER,
          host: config.DB_HOST,
          dialect: currentDialect,
          password: config.DB_PASSWORD,
          port: config.DB_PORT,
        })).pipe(
          switchMap((con) => from(con.authenticate()).pipe(
            switchMap(() => of(con))
          ))
        );
      }));

  }

  /**
   * Function to pick up the connection.
   * @returns Observable<Sequelize>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public getConnection(): Observable<Sequelize> {
    return (new Observable<Sequelize>((obs) => {
      if (this.isInitialized) {
        obs.next(this.connection as Sequelize);
        return obs.complete();
      } else {
        // TODO: Add Translate
        return obs.error('Service Not Initialized.');
      }
    })).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }),
      retryWhen((err) => err.pipe(
        // TODO: Add Translate
        tap(() => console.log('Trying to get the connection again in 5 seconds')),
        delay(5000)
      ))
    );
  }
}