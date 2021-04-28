import { zTranslateService } from './zTranslateService';
import { AES, enc, SHA256 } from 'crypto-js';
import { zConfigModule } from '../configs';

/**
 * Service that contains the functions related to the crypto.
 * @author Ivan Antunes <ivanantnes75@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export class zCryptoService {

    /**
     * Stores zCryptoService Service Instance.
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    private static instance: zCryptoService | null;

    /**
     * Stores instance zTranslateService.
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    private tService = zTranslateService.getInstance();

    /**
     *
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    private constructor() { }

    /**
     * Function used to get instance of zCryptoService
     * @returns zCryptoService
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public static getInstance(): zCryptoService {

        if (!zCryptoService.instance) {
            zCryptoService.instance = new zCryptoService();
        }

        return zCryptoService.instance;

    }

    /**
     * Function used to destroy instance of zCryptoService.
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public static destroyInstance(): void {

        zCryptoService.instance = null;

    }

    /**
     * Function Encrypt AES
     * @param {string} value - Value
     * @returns string
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public encryptAES(value: string): string {
        return AES.encrypt(value, zConfigModule.MOD_CRYPTO_PASSWORD).toString();
    }

    /**
     * Function Encrypt HASH
     * @function
     * @property {string} value - Valor
     * @returns string
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public encryptHASH(value: string): string {
        return SHA256(value).toString();
    }

    /**
     * Function Decrypt AES
     * @function
     * @property {string} value - Value Encrypted
     * @returns string
     * @author Ivan Antunes <ivanantnes75@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public decryptAES(value: string): string {
        return AES.decrypt(value, zConfigModule.MOD_CRYPTO_PASSWORD).toString(enc.Utf8);
    }
}
