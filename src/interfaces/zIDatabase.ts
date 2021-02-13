import { DataType, ModelValidateOptions, QueryInterfaceCreateTableOptions } from 'sequelize/types';
import { zEFieldTypeDB } from '../enums';

/**
 * Database Table.
 * @interface zITableDB
 * @property {string} tablename - Table Name.
 * @property {zIFieldDB} tableFields - Fields contains in table.
 * @property {QueryInterfaceCreateTableOptions} tableOptions - Options cantains in table?
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zITableDB {
    tableName: string;
    tableFields: zIFieldDB[];
    tableOptions?: QueryInterfaceCreateTableOptions;
}

/**
 * Database field interface. Using to create database field.
 * @interface zIFieldDB
 * @property {string} fieldName - Field Name
 * @property {zEFieldTypeDB} - Field Type
 * @property {boolean} fieldPrimaryKey - Field is Primary key?
 * @property {boolean} fieldRequired - Field is Required?
 * @property {boolean} fieldAllowNull - Field is Allow Null?
 * @property {boolean} fieldAutoIncrement - Field is Auto Increment?
 * @property {boolean} fieldUnique - Field is Unique?
 * @property {string} fieldDefaultValue - Field default values?
 * @property {string[]} fieldEnumValue - Field enum values?
 * @property {zIRelationDB} fieldRelation - Field Relation?
 * @property {number} fieldSize - Field Size?
 * @property {number} fieldPrecision - Field Precision?
 * @property {'tiny' | 'medium' | 'long'} fieldTextLength - Field Text Length?
 * @property {ModelValidateOptions} fieldValidate - Field Validate?
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zIFieldDB {
    fieldName: string;
    fieldType: zEFieldTypeDB;
    fieldPrimaryKey: boolean;
    fieldRequired: boolean;
    fieldAllowNull?: boolean;
    fieldAutoIncrement?: boolean;
    fieldUnique?: boolean;
    fieldDefaultValue?: string;
    fieldEnumValue?: string[];
    fieldRelation?: zIRelationDB;
    fieldSize?: number;
    fieldPrecision?: number;
    fieldTextLength?: 'tiny' | 'medium' | 'long';
    fieldValidate?: ModelValidateOptions;
}

/**
 * Database relation field.
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

/**
 * Database Attribute field.
 * @interface zIAttributeDB
 * @property {zIAttributeObjectDB} attr - Attribute Name
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zIAttributeDB {
    [attr: string]: zIAttributeObjectDB;
}

/**
 * Database Attribute Object field.
 * @interface zIAttributeObjectDB
 * @property {DataType} type - Type Field
 * @property {boolean} primaryKey - Field Primary Key
 * @property {ModelValidateOptions} validate - Field Validade?
 * @property {string} defaultValue - Field Default Value?
 * @property {boolean} allowNull - Field Allow Null?
 * @property {boolean} unique - Field Unique?
 * @property {object} references - Field References?
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export interface zIAttributeObjectDB {
    type: DataType;
    primaryKey: boolean;
    validate?: ModelValidateOptions;
    defaultValue?: string;
    allowNull?: boolean;
    unique?: boolean;
    autoIncrement?: boolean;
    references?: {
        model: string;
        key: string;
    };
}
