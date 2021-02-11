import { zEFieldTypeDB } from '../enums';

/**
 * Database Table.
 * @namespace Interfaces
 * @interface zITableDB
 * @property {string} tablename - Table Name
 * @property {zIFieldDB} tableFields - Fields contains in table
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zITableDB {
    tableName: string;
    tableFields: zIFieldDB[];
}

/**
 * Database field interface. Using to create database field.
 * @namespace Interfaces
 * @interface zIFieldDB
 * @property {string} fieldName - Field Name
 * @property {zEFieldTypeDB} - Field Type
 * @property {boolean} fieldPrimaryKey - Field is Primary key?
 * @property {boolean} fieldRequired - Field is Required?
 * @property {boolean} fieldAutoIncrement - Field is Auto Increment?
 * @property {boolean} fieldUnique - Field is Unique?
 * @property {string[] | string} fieldDefaultValue - Field default values?
 * @property {zIRelationDB} fieldRelation - Field Relation?
 * @property {number} fieldSize - Field Size?
 * @property {number} fieldPrecision - Field Precision?
 * @property {'tiny' | 'medium' | 'long'} fieldTextLength - Field Text Length?
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zIFieldDB {
    fieldName: string;
    fieldType: zEFieldTypeDB;
    fieldPrimaryKey: boolean;
    fieldRequired: boolean;
    fieldAutoIncrement?: boolean;
    fieldUnique?: boolean;
    fieldDefaultValue?: string[] | string;
    fieldRelation?: zIRelationDB;
    fieldSize?: number;
    fieldPrecision?: number;
    fieldTextLength?: 'tiny' | 'medium' | 'long';
}

/**
 * Database relation field.
 * @namespace Interfaces
 * @interface zIRelationDB
 * @property {string} tablename - Table Name
 * @property {string} fieldName - Field Name
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zIRelationDB {
    tableName: string;
    fieldName: string;
}
