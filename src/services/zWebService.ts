import { zConfigModule } from '../configs';
import { Observable, of, throwError } from 'rxjs';
import { zTranslateService } from './zTranslateService';
import { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import express from 'express';
import { catchError, delay, retryWhen, tap } from 'rxjs/operators';

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

      this.server = currentApp;

      this.server.listen(zConfigModule.MOD_SERVER_PORT, () => {
        console.log('Servidor Rodando na Porta: ' + zConfigModule.MOD_SERVER_PORT);
        this.isInitialized = true;
      });

    }, (err) => {
      throw new Error('Falha ao Iniciar Servidor: ' + err);
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

  // TODO: Colocar Docs

  private setConfigServer(app: Express): Observable<Express> {
    app.use(cors({maxAge: 86000}));

    app.use(helmet());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    return of(app);
  }

  public startWebService(): Observable<Express> {
    // TODO: Add Translate
    return (new Observable<Express>((obs) => {

      if (this.isInitialized) {
        obs.next(this.server as Express);
        return obs.complete();
      } else {
        return obs.error('Servidor Ainda Não Inicializado.');
      }

    })).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }),
      retryWhen((err) => err.pipe(
        tap(() => console.log('Tentanto Iniciar O Servidor em 5 Segundos.')),
        delay(5000)
      ))
    );
  }


}
