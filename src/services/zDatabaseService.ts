import { zConfigDB } from '../configs';
import { DataType, DataTypes, Dialect, Model, ModelCtor, Sequelize } from 'sequelize';
import { concat, from, Observable, of, throwError } from 'rxjs';
import { zIAttributeDB, zIAttributeObjectDB, zIConfigDB, zIFieldDB, zITableDB } from '../interfaces';
import { catchError, delay, map, retryWhen, switchMap, tap, toArray } from 'rxjs/operators';
import { zEFieldTypeDB } from '../enums';
import { zTranslateService } from './zTranslateService';

/**
 * Service that contains the functions related to the database.
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export class zDatabaseService {

  /**
   * Stores zDatabaseService Service Instance.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private static instance: zDatabaseService | null;

  /**
   * Sequelize instance containing the database connection.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private connection: Sequelize | null = null;

  /**
   * Stores if initialized service.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private isInitialized = false;

  /**
   * Stores instance zTranslateService.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private tService = zTranslateService.getInstance();

  /**
   * Executes the database connection function and stores it.
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private constructor() {
    this.connectionDatabase(zConfigDB).subscribe((con) => {
      this.connection = con;
      console.log(this.tService.t('lbl_db_connection'));
      this.isInitialized = true;
    }, (err) => {
      throw new Error(`$${this.tService.t('lbl_db_fail_connection')} ${err}`);
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
        return throwError(this.tService.t('lbl_db_fail_dialect'));
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
          logging: config.DB_LOG
        })).pipe(
          switchMap((con) => from(con.authenticate()).pipe(
            switchMap(() => of(con))
          ))
        );
      }));

  }

  /**
   * Function to get field type.
   * @param {zIFieldDB} field - Database Field
   * @returns Observable<DataType>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private getFieldType(field: zIFieldDB): Observable<DataType> {
    switch (field.fieldType) {
      case zEFieldTypeDB.INT:
        return of(
          DataTypes.INTEGER({
            length: field.fieldSize,
            precision: field.fieldPrecision
          })
        );
      case zEFieldTypeDB.BIGINT:
        return of(
          DataTypes.BIGINT({
            length: field.fieldSize
          })
        );
      case zEFieldTypeDB.VARCHAR:
        return of(
          DataTypes.STRING({
            length: field.fieldSize
          })
        );
      case zEFieldTypeDB.TEXT:
        return of(
          DataTypes.TEXT({
            length: field.fieldTextLength,
          })
        );
      case zEFieldTypeDB.FLOAT:
        return of(
          DataTypes.FLOAT({
            length: field.fieldSize,
            decimals: field.fieldPrecision
          })
        );
      case zEFieldTypeDB.BOOLEAN:
        return of(DataTypes.BOOLEAN);
      case zEFieldTypeDB.TIME:
        return of(DataTypes.TIME);
      case zEFieldTypeDB.DATE:
        return of(DataTypes.DATE({
          length: field.fieldSize
        }));
      case zEFieldTypeDB.ENUM:
        if (!field.fieldEnumValue) {
          return throwError(this.tService.t('lbl_db_fail_enum_type'));
        }

        return of(DataTypes.ENUM(...field.fieldEnumValue as string[]));
      case zEFieldTypeDB.BLOB:
        return of(DataTypes.BLOB({
          length: field.fieldTextLength
        }));
      default:
        return throwError(this.tService.t('lbl_db_fail_type_support'));
    }
  }

  /**
   * Function to generate attributes table.
   * @param {zITableDB | zIFieldDB} data - Table Generate Attributes | Field Generate Attributes
   * @returns Observable<zIAttributeDB[]>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private generateAttribute(data?: zITableDB | zIFieldDB): Observable<zIAttributeObjectDB | zIAttributeDB[]> {

    if (data) {
      if (Object.prototype.constructor(data).fieldName) {
        const field = data as zIFieldDB;

        return this.getFieldType(field).pipe(

          switchMap((fieldType) => {

            const baseAttribute: zIAttributeObjectDB = {
              type: fieldType,
              primaryKey: field.fieldPrimaryKey,
              autoIncrement: field.fieldAutoIncrement,
              allowNull: field.fieldAllowNull ? field.fieldAllowNull : false,
              validate: field.fieldValidate,
              defaultValue: field.fieldDefaultValue,
              unique: field.fieldUnique
            };

            if (field.fieldRelation) {
              baseAttribute.references = {
                model: field.fieldRelation.tableName,
                key: field.fieldRelation.fieldName
              };
            }

            return of(baseAttribute);
          })

        );
      }

      if (Object.prototype.constructor(data).tableName) {
        const table = data as zITableDB;

        return concat(...table.tableFields.map((f) => this.getFieldType(f).pipe(

          switchMap((fieldType) => {

            const baseAttribute: zIAttributeDB = {

              [`${f.fieldName}`]: {
                type: fieldType,
                validate: f.fieldValidate,
                defaultValue: f.fieldDefaultValue,
                allowNull: f.fieldAllowNull ? f.fieldAllowNull : false,
                unique: f.fieldUnique,
                primaryKey: f.fieldPrimaryKey,
                autoIncrement: f.fieldAutoIncrement,
              }

            };

            if (f.fieldRelation) {
              baseAttribute[f.fieldName].references = {
                model: f.fieldRelation.tableName,
                key: f.fieldRelation.fieldName
              };
            }

            return of(baseAttribute);
          })

        ))).pipe(
          toArray(),
          map((attributes) => {
            return attributes;
          })
        );
      }

      return throwError(this.tService.t('lbl_db_fail_generate_attr'));

    }

    return throwError(this.tService.t('lbl_db_fail_generate_attr_not_defined'));

  }

  /**
   * Function to check field in table.
   * @param {string} tableName - Table Name.
   * @param {string} fieldName - Field Name.
   * @returns Observable<boolean>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private checkField(tableName: string, fieldName: string): Observable<boolean> {
    return this.getConnection().pipe(

      switchMap((con) => from(con.getQueryInterface().describeTable(tableName)).pipe(

        catchError((err) => {
          return throwError(`${this.tService.t('lbl_db_fail_check_field')} ${err}`);
        }),

        map((fields) => {
          const keys = Object.keys(fields);

          if (keys.find((key) => key === fieldName || key === fieldName.toLowerCase() || key === fieldName.toUpperCase())) {
            return true;
          } else {
            return false;
          }

        })
      ))

    );

  }

  /**
   * Function to check table in database.
   * @param {string} tableName - Table Name.
   * @returns Observable<boolean>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private checkTable(tableName: string): Observable<boolean> {

    return this.getConnection().pipe(

      switchMap((con) => from(con.getQueryInterface().showAllTables()).pipe(

        catchError((err) => {
          return throwError(`${this.tService.t('lbl_db_fail_check_table')} ${err}`);
        }),

        map((tables: any[]) => {

          if (tables.find((t: { tableName: string, schema: string }) =>
            t.tableName === tableName ||
            t.tableName === tableName.toLowerCase() ||
            t.tableName === tableName.toUpperCase()
          )) {
            return true;
          } else {
            return false;
          }

        })

      ))

    );

  }

  /**
   * Function used to set table model.
   * @param {zITableDB} table - Table.
   * @returns Observable<ModelCtor<Model<any, any>>>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private setTableModel(table: zITableDB): Observable<ModelCtor<Model<any, any>>> {
    return this.getConnection().pipe(
      switchMap((con) => this.generateAttribute(table).pipe(

        switchMap((attribute) => {

          const model = con.define(
            table.tableName,
            Object.assign({}, ...(attribute as zIAttributeDB[]).map((attr) => attr)),
            {...table.tableOptions, timestamps: false, tableName: table.tableName}
          );

          table.tableFields.map((field) => {

            if (field.fieldRelation) {
              model.hasOne(
                con.models[field.fieldRelation.tableName],
                {
                  foreignKey: field.fieldRelation.fieldName,
                  sourceKey: field.fieldName,
                  onDelete: 'cascade'
                },
              );
            }

          });

          return of(model);

        }))
    ));
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
        return obs.error(this.tService.t('sys_db_fail_service'));
      }
    })).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }),
      retryWhen((err) => err.pipe(
        tap(() => console.log(this.tService.t('sys_db_fail_service_refresh'))),
        delay(5000)
      ))
    );
  }

  /**
   * Function to create tables and add columns.
   * @param {zITableDB} table - Table.
   * @returns Observable<unknown>
   * @author Ivan Antunes <ivanantnes75@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public createTable(table: zITableDB): Observable<unknown> {
    return this.getConnection().pipe(

      switchMap((con) => this.checkTable(table.tableName).pipe(

        catchError((err) => {
          console.log(`${this.tService.t('gnc_internal_server_error')} ${err}`);
          return of(false);
        }),

        switchMap((isTable) => {

          if (table.tableLogicalDelete) {
            table.tableFields.push({
              fieldName: 'IS_DELETED',
              fieldPrimaryKey: false,
              fieldRequired: true,
              fieldType: zEFieldTypeDB.BOOLEAN,
              fieldDefaultValue: '0',
            });
          }


          console.log(`${this.tService.t('gnc_lbl_table')} ${table.tableName} ${this.tService.t('gnc_lbl_exists')}: ${isTable}`);

          if (isTable) {

            return concat(...table.tableFields.map((field) => this.checkField(table.tableName, field.fieldName).pipe(

              catchError((err) => {
                console.log(`${this.tService.t('gnc_internal_server_error')} ${err}`);
                return of(false);
              }),

              switchMap((isField) => {
                console.log(`${this.tService.t('gnc_lbl_field')} ${field.fieldName} ${this.tService.t('gnc_lbl_exists')}: ${isField}`);

                if (isField) {
                  return of(1);
                }

                return this.generateAttribute(field).pipe(
                  switchMap((attr) => from(con.getQueryInterface().addColumn(
                    table.tableName,
                    field.fieldName,
                    attr as zIAttributeObjectDB,
                    table.tableOptions
                  )).pipe(

                    catchError((err) => {
                      return throwError(`${this.tService.t('lbl_db_fail_create_field')} ${err}`);
                    }),

                    tap(() => console.log(`${this.tService.t('lbl_db_create_field')} ${field.fieldName}`))

                  ))
                );

              })

            ))).pipe(
              toArray()
            );

          }

          return from(this.generateAttribute(table).pipe(

            switchMap((attributes) => from(con.getQueryInterface().createTable(
              table.tableName,
              Object.assign({}, ...(attributes as zIAttributeDB[]).map((attr) => attr)),
              table.tableOptions
            )).pipe(

              catchError((err) => {
                return throwError(`${this.tService.t('lbl_db_fail_create_table')} ${err}`);
              }),

              tap(() => console.log(`${this.tService.t('lbl_db_create_table')} ${table.tableName}`))

            ))

          ));

        }),

        switchMap(() => this.setTableModel(table).pipe(

          tap(() => console.log(`${this.tService.t('lbl_db_model_defined')} ${table.tableName}`))

        ))

      )),
    );

  }
}
