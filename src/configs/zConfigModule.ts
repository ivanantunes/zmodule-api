import { zIConfigModule } from './../interfaces';
import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

/**
 * Contains system module settings.
 * @constant zConfigModule
 * @author Lucas Zaia <lucas.zaia30@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export const zConfigModule: zIConfigModule = {
    MOD_LANG: String(process.env.MOD_LANG || 'en'),
    MOD_LANG_PATH: String(process.env.MOD_LANG_PATH || '../../../../src/locale/translate'),
    MOD_SERVER_PORT: Number(process.env.MOD_SERVER_PORT || 3000),
    MOD_CRYPTO_PASSWORD: String(process.env.MOD_CRYPTO_PASSWORD || '123456')
};
