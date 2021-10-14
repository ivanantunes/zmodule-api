import { zEFieldTypeDB } from '../../enums';
import { zITableDB } from '../../interfaces';

export const zTableTestRelation: zITableDB = {
    tableName: 'zTableTestRelation',
    tableFields: [
        {
            fieldName: 'zTest_ID',
            fieldPrimaryKey: true,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BIGINT,
            fieldAutoIncrement: true
        },
        {
            fieldName: 'zTest_NAME',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.VARCHAR,
            fieldSize: 100
        },
        {
            fieldName: 'zTest_LAST_NAME',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.VARCHAR,
            fieldSize: 100
        },
        {
            fieldName: 'zTest_EMAIL',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.VARCHAR,
            fieldSize: 100,
            fieldValidate: {
                isEmail: true
            }
        },
        {
            fieldName: 'zTest_OBS',
            fieldPrimaryKey: false,
            fieldRequired: false,
            fieldAllowNull: true,
            fieldType: zEFieldTypeDB.TEXT,
            fieldTextLength: 'medium',
        },
        {
            fieldName: 'zTest_Rel_ID',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BIGINT,
            fieldAutoIncrement: false,
            fieldRelation: {
                tableName: 'zTableTest',
                fieldName: 'zTest_ID',
                fieldKeyLabel: 'zTest_NAME'
            },
        },
    ],
    tableLogicalDelete: true
};
