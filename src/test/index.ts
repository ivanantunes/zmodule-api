import { zIMailOptions } from './../interfaces/zIMail';
import { zMailService } from './../services/zMailService';


zMailService.getInstance().sendMail({
    from: 'gabrielalves.dev@gmail.com',
    to: 'lucas.zaia30@gmail.com',
    subject: 'Mensagem com amor de gabriel alves',
    text: 'mano nao gosto de voce o titulo era click bait!'
}, {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: '587',
    auth: {
        user: 'gabrielalves.dev@gmail.com',
        pass: 'umwywatdbqavsman'
    }
});


// import { switchMap } from 'rxjs/operators';
// import { zCrudService, zDatabaseService } from '../services';
// import { zTableTest, zTableTestRelation } from './data';
// import faker from 'faker';

// zDatabaseService.getInstance().createTable(zTableTest).pipe(
//     switchMap(() => zDatabaseService.getInstance().createTable(zTableTestRelation)),
//     // ! Insert - 10k rows to Dabatase
//     // switchMap(() => {
//     //     const obj: any[] = [];

//     //     for (let i = 0; i < 10000; i++) {
//     //         obj.push({
//     //             zTest_NAME: faker.name.firstName(),
//     //             zTest_LAST_NAME: faker.name.lastName(),
//     //             zTest_EMAIL: faker.internet.email(),
//     //             zTest_OBS: null,
//     //             zTest_Rel_ID: i
//     //         });
//     //     }

//     //     return zCrudService.getInstance().create(obj, 'zTableTestRelation');
//     // }),
// ).subscribe((response) => {
//     console.log(response);
// }, (err) => {
//     console.log(err);
// });
