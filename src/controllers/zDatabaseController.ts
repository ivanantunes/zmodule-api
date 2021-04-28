import { concat, Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { zITableDB } from '../interfaces';
import { zDatabaseService } from '../services/';

/**
 * Controller that contains the functions related to the database.
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export class zDatabaseController {

    /**
     * Stores zDatabaseController Service Instance.
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    private static instance: zDatabaseController | null;

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
     * Function used to get instance of zDatabaseController
     * @returns zDatabaseController
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public static getInstance(): zDatabaseController {
        if (!zDatabaseController.instance) {
            zDatabaseController.instance = new zDatabaseController();
        }

        return zDatabaseController.instance;
    }

    /**
     * Function used to destroy instance of zDatabaseController.
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public static destroyInstance(): void {
        zDatabaseController.instance = null;
    }

    /**
     * Create Tables to Database
     * @param {zITableDB[]} tables - Tables
     * @returns Observable
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public createTables(tables: zITableDB[]): Observable<unknown> {
        return concat(tables.map((table) => this.dbService.createTable(table))).pipe(toArray());
    }

}
