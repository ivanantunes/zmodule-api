import { zEFieldTypeDB } from '../enums';

export interface zITableDB {
    tablename: string;
    fields: zIFieldDB[];
}

export interface zIFieldDB {
    name: string;
    type: zEFieldTypeDB;
}
