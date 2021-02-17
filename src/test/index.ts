import { map, switchMap } from 'rxjs/operators';
import { zCrudService, zDatabaseService } from '../services';
import { zTableTest } from './data';
import faker from 'faker';

zDatabaseService.getInstance().createTable(zTableTest).pipe(
    switchMap(() => {
        const obj = {
            zTest_NAME: faker.name.firstName(),
            zTest_LAST_NAME: faker.name.lastName(),
            zTest_EMAIL: faker.internet.email(),
            zTest_OBS: null
        };
        return zCrudService.getInstance().create(obj, 'zTableTest');
    }),
    map((insert) => {

        console.log('Valor-1', insert);

    }),
    switchMap(() => {
        const obj = [
            {
                zTest_NAME: faker.name.firstName(),
                zTest_LAST_NAME: faker.name.lastName(),
                zTest_EMAIL: faker.internet.email(),
                zTest_OBS: null
            },
            {
                zTest_NAME: faker.name.firstName(),
                zTest_LAST_NAME: faker.name.lastName(),
                zTest_EMAIL: faker.internet.email(),
                zTest_OBS: null
            },
            {
                zTest_NAME: faker.name.firstName(),
                zTest_LAST_NAME: faker.name.lastName(),
                zTest_EMAIL: faker.internet.email(),
                zTest_OBS: null
            }
        ];

        return zCrudService.getInstance().create(obj, 'zTableTest');
    }),
    map((rows) => {
        console.log('Valor-2', rows);
    })
).subscribe(() => {}, (err) => {
    console.log(err);
});
