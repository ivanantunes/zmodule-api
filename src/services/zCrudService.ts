import { switchMap, toArray } from 'rxjs/operators';
import { concat, from, Observable, of } from 'rxjs';
import { zDatabaseService } from './zDatabaseService';
import { zTranslateService } from './zTranslateService';
import { zIFilterDataDB, zIRelationDB, zITableDB } from '../interfaces';
import { Model, ModelCtor, Transaction, Op } from 'sequelize';

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
   * Function used to generate inner joins and left joins to select in database.
   * @param {zITableDB} table - Object Table
   * @returns Observable<{model: ModelCtor<Model<any, any>>, required: boolean}[]>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private generateInnerJoin(table: zITableDB): Observable<{ model: ModelCtor<Model<any, any>>, required: boolean }[]> {

    return this.dbService.getConnection().pipe(
      switchMap((con) => concat(...table.tableFields.filter((f) => f.fieldRelation).map((field) => {

        return of({
          model: con.models[(field.fieldRelation as zIRelationDB).tableName],
          required: field.fieldRequired
        });

      })).pipe(
        toArray()
      ))
    );

  }

  /**
   * Function used to insert values in a given table.
   * @param {any | any[]} obj - Values to Insert.
   * @param {string} tableName - Table Name contains in database.
   * @returns Observable<any[]> | contains the values entered with the id
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public create(obj: any | any[], tableName: string, transaction?: Transaction): Observable<any[]> {

    return this.dbService.getConnection().pipe(
      switchMap((con) => {
        if (Array.isArray(obj)) {
          return concat(...obj.map((o) => from(con.models[tableName].create(o, { isNewRecord: true, transaction })))).pipe(
            toArray()
          ).pipe(
            switchMap((rows) => {
              const arrRows = rows.map((row) => row.get());

              return of(arrRows);

            })
          );
        } else {
          return from(con.models[tableName].create(obj, { isNewRecord: true, transaction })).pipe(
            switchMap((row) => of([row.get()]))
          );
        }

      })
    );

  }

  /**
   * Function used to update values in a given table.
   * @param {any} obj - Values to Update.
   * @param {number} id - Update id.
   * @param {string} fieldName - Field Name which is primary key
   * @param {string} tableName - Table Name contains in database.
   * @returns Observable<number> | contains the number of lines changed.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public update(obj: any, id: number, fieldName: string, tableName: string, transaction?: Transaction): Observable<number> {

    return this.dbService.getConnection().pipe(

      switchMap((con) => from(con.models[tableName].update(obj, { where: { [fieldName]: id }, transaction })).pipe(
        switchMap((rows) => of(rows[0]))
      ))

    );

  }

  /**
   * Function used to delete values in a given table.
   * @param {number} id - Delete id.
   * @param {string} fieldName - Field Name which is primary key
   * @param {string} tableName - Table Name contains in database.
   * @param {boolean} isLogical - Use logical delete on the table?
   * @returns Observable<number> | contains the number of lines changed.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public delete(id: number, fieldName: string, tableName: string, isLogical?: boolean, transaction?: Transaction): Observable<number> {

    return this.dbService.getConnection().pipe(

      switchMap((con) => {

        if (isLogical) {

          return this.update({ IS_DELETED: true }, id, fieldName, tableName, transaction);

        } else {

          return from(con.models[tableName].destroy({ where: { [fieldName]: id }, transaction }));

        }

      })

    );
  }

  /**
   * Function used to find and count and filter data to dababase return values in a given table.
   * @param {zIFilterDataDB} filter - Filter Data Object
   * @param {any} customWhere - If the search has any conditions, use an object with the filter values.
   * @returns Observable<{rows: any[], count: number}> | contains the values.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public find(filter: zIFilterDataDB, customWhere?: any): Observable<{rows: any[], count: number}> {
    const filterLike: any[] = [];

    filter.table.tableFields.forEach((field) => {

      if (field.fieldRequired) {

        filterLike.push({
          [field.fieldName]: {
            [Op.like]: `%${filter.search}%`
          }
        });

      }

    });


    return this.dbService.getConnection().pipe(
      switchMap((con) => this.generateInnerJoin(filter.table).pipe(

        switchMap((joins) => from(con.models[filter.table.tableName].findAndCountAll(
          {
            where: {
              [Op.or]: filterLike,
              ...customWhere
            },
            include: joins,
            order: [[filter.columnSort, filter.sort]],
            limit: filter.pageSize,
            offset: (filter.page * filter.pageSize)
          }
        )))

      ))
    ).pipe(
      switchMap((rows) => {

        if (rows && rows.rows.length === 0) {
          return of({
            rows: [],
            count: 0
          });
        }

        const arrRows = rows.rows.map((row) => row.get());

        filter.table.tableFields.filter((f) => f.fieldRelation).map((field) => {

          arrRows.map((row) => {
            row[(field.fieldRelation as zIRelationDB).tableName] = row[(field.fieldRelation as zIRelationDB).tableName].dataValues;
          });

        });

        return of({
          rows: arrRows,
          count: rows.count
        });

      })
    );
  }

  /**
   * Function used to find all values in a given table.
   * @param {zITableDB} table - Object Table
   * @param {any} where - If the search has any conditions, use an object with the filter values.
   * @returns Observable<any[]> | contains the values.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public findAll(table: zITableDB, where?: any): Observable<any[]> {

    return this.dbService.getConnection().pipe(
      switchMap((con) => this.generateInnerJoin(table).pipe(

        switchMap((joins) => from(con.models[table.tableName].findAll({
          where,
          include: joins
        })))

      ))
    ).pipe(
      switchMap((rows) => {

        if (rows.length === 0) {
          return of([]);
        }

        const arrRows = rows.map((row) => row.get());

        table.tableFields.filter((f) => f.fieldRelation).map((field) => {

          arrRows.map((row) => {
            row[(field.fieldRelation as zIRelationDB).tableName] = row[(field.fieldRelation as zIRelationDB).tableName].dataValues;
          });

        });

        return of(arrRows);

      })
    );
  }

  /**
   * Function used to find and count all values in a given table.
   * @param {zITableDB} table - Object Table
   * @param {any} where - If the search has any conditions, use an object with the filter values.
   * @returns Observable<{rows: any[], count: number}> | contains the values.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public findAndCountAll(table: zITableDB, where?: any): Observable<{ rows: any[], count: number }> {
    return this.dbService.getConnection().pipe(
      switchMap((con) => this.generateInnerJoin(table).pipe(

        switchMap((joins) => from(con.models[table.tableName].findAndCountAll({
          where,
          include: joins
        })))

      ))
    ).pipe(
      switchMap((rows) => {

        if (rows && rows.rows.length === 0) {
          return of({
            rows: [],
            count: 0
          });
        }

        const arrRows = rows.rows.map((row) => row.get());

        table.tableFields.filter((f) => f.fieldRelation).map((field) => {

          arrRows.map((row) => {
            row[(field.fieldRelation as zIRelationDB).tableName] = row[(field.fieldRelation as zIRelationDB).tableName].dataValues;
          });

        });

        return of({
          rows: arrRows,
          count: rows.count
        });

      })
    );
  }

}
