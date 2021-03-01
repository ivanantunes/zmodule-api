</a>

A library created with the concept of facilitating the creation of api.

<p align="center">
<a href="https://badge.fury.io/for/js/zmodule-api"><img src="https://badge.fury.io/js/zmodule-api.svg" alt="npm version" ></a>
<a href="https://www.npmjs.com/package/zmodule-api"><img src="https://img.shields.io/badge/Downloads-0%2FWeekly-green" alt="npm downloads" ></a>
<a href="https://www.npmjs.com/package/zmodule-api"><img alt="" src="https://img.shields.io/github/license/ivanantunes/zmodule-api"></a>
<a href="https://www.npmjs.com/package/zmodule-api"><img alt="" src="https://img.shields.io/github/stars/ivanantunes/zmodule-api"></a>
<a href="https://www.npmjs.com/package/zmodule-api"><img alt="" src="https://img.shields.io/github/forks/ivanantunes/zmodule-api"></a>
<a href="https://www.npmjs.com/package/zmodule-api"><img alt="" src="https://img.shields.io/github/issues/ivanantunes/zmodule-api"></a>
</p>
<p align="center">
<a href="https://nodei.co/npm/zmodule-api/"><img src="https://nodei.co/npm/zmodule-api.png?downloads=true&downloadRank=true&stars=true"></a>
</p>

[Develop Doc's](https://ivanantunes.github.io/zmodule-api)


# Base Structure
    .
    ├── FolderMyProject
    |   ├── src
    |   |   ├── locale
    |   |   |   ├── translate.ts
    |   |   └── 
    |   |   ├── index.ts
    |   |   ├── .env
    |   └── 
    └──

# QuickStart

```env
# Database configuration

# Supported: mysql | mariadb | postgres | mssql / Default Value: mysql 
DB_DIALECT=
# Default Value: localhost
DB_HOST=
# Default Value: zmodule_api
DB_NAME=
# Default Value: 3306
DB_PORT=
# Default Value: root
DB_USER=
# Default Value: 
DB_PASSWORD=

# Module Configuration

# Default Value: pt 
MOD_LANG=
# Default Value:
MOD_LANG_PATH=
# Default Value: 3000
MOD_SERVER_PORT=
```


```typescript

import { zEFieldTypeDB, zITableDB, zCrudService, zDatabaseService } from 'zmodule-api';
import { switchMap } from 'rxjs/operators';

const zTableTest: zITableDB = {
    tableName: 'zTableTest',
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
    ]
};

zDatabaseService.getInstance().createTable(zTableTest).pipe(
    switchMap(() => {
        const obj = {
                zTest_NAME: 'Name',
                zTest_LAST_NAME: 'Lastname',
                zTest_EMAIL: 'zmodule_api@email.com',
                zTest_OBS: 'My Obs...',
            };

        return zCrudService.getInstance().create(obj, 'zTableTest');
    }),
).subscribe((response) => {
    console.log(response);
}, (err) => {
    console.log(err);
});

```