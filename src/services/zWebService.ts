import { zConfigModule } from '../configs';
import { Observable, of, throwError } from 'rxjs';
import { zTranslateService } from './zTranslateService';
import { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import express from 'express';
import { catchError, delay, retryWhen, tap } from 'rxjs/operators';
import httpServer from 'http';
import { Server } from 'socket.io';

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
   * Express instance containing the server.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private server: Express | null = null;

  /**
   * Socket instance containing the server.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private socket: Server | null = null;

  /**
   * Http instance containing the server.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2022
   */
  private http: httpServer.Server | null = null;

  /**
   * Stores if initialized service.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private isInitialized = false;

  /**
   * Start Server in Service
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private constructor() {
    const app = express();

    this.setConfigServer(app).subscribe((currentApp) => {

      this.http = httpServer.createServer(currentApp);
      this.socket = new Server(this.http);

      this.server = currentApp;

      this.http.listen(zConfigModule.MOD_SERVER_PORT, () => {
        console.log(`${this.tService.t('web_server_start')} ${zConfigModule.MOD_SERVER_PORT}`);
        this.isInitialized = true;
      });

    }, (err) => {
      throw new Error(`${this.tService.t('web_server_failed')} ${err}`);
    });

  }

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

  /**
   * Configure server settings
   * @param {Express} server - Server instance
   * @returns Observable<Express>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private setConfigServer(server: Express): Observable<Express> {
    server.use(cors({maxAge: 86000}));

    server.use(helmet());

    server.use(express.json({limit: '100mb'}));
    server.use(express.urlencoded({
      extended: true,
      limit: '100mb'
    }));

    return of(server);
  }

  /**
   * Start the server
   * @returns Observable<Express>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public startWebService(): Observable<Express> {

    return (new Observable<Express>((obs) => {

      if (this.isInitialized) {
        obs.next(this.server as Express);
        return obs.complete();
      } else {
        return obs.error(this.tService.t('web_server_not_initialized'));
      }

    })).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }),
      retryWhen((err) => err.pipe(
        tap(() => console.log(this.tService.t('web_server_try_again'))),
        delay(5000)
      ))
    );
  }

  /**
   * Get Instance of Sockets
   * @returns Observable<Express>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public socketInstance(): Observable<Server> {

    return (new Observable<Server>((obs) => {

      if (this.isInitialized) {
        obs.next(this.socket as Server);
        return obs.complete();
      } else {
        return obs.error(this.tService.t('web_socket_not_initialized'));
      }

    })).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }),
      retryWhen((err) => err.pipe(
        tap(() => console.log(this.tService.t('web_server_try_again'))),
        delay(5000)
      ))
    );

  }

  /**
   * Get Instance of Http
   * @returns Observable<Express>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public httpInstance(): Observable<httpServer.Server> {
    return (new Observable<httpServer.Server>((obs) => {

      if (this.isInitialized) {
        obs.next(this.http as httpServer.Server);
        return obs.complete();
      } else {
        return obs.error(this.tService.t('web_http_not_initialized'));
      }

    })).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }),
      retryWhen((err) => err.pipe(
        tap(() => console.log(this.tService.t('web_server_try_again'))),
        delay(5000)
      ))
    );

  }

}
