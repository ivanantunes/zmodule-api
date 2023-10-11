import { switchMap } from 'rxjs';
import { zCrudService, zDatabaseService } from '../services';
import { zTableTest, zTableTestRelation } from './data';
import { faker } from '@faker-js/faker';

import { zMailService } from '../services';

zDatabaseService.getInstance().createTable(zTableTest).pipe(
    switchMap(() => zDatabaseService.getInstance().createTable(zTableTestRelation)),
    // ! Insert - 10k rows to Dabatase
    // switchMap(() => {
    //     const obj: any[] = [];

    //     for (let i = 0; i < 10000; i++) {
    //         obj.push({
    //             zTest_NAME: faker.name.firstName(),
    //             zTest_LAST_NAME: faker.name.lastName(),
    //             zTest_EMAIL: faker.internet.email(),
    //             zTest_OBS: null,
    //             zTest_Rel_ID: i
    //         });
    //     }

    //     return zCrudService.getInstance().create(obj, 'zTableTestRelation');
    // }),
).subscribe((response) => {
    // console.log(response);
}, (err) => {
    // console.log(err);
});

