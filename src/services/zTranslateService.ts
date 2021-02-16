import { zITranslateData } from './../interfaces';
import i18next, { TFunction } from 'i18next';
import { zConfigModule } from './../configs';

/**
 * Module translation service.
 * @author Lucas Zaia <lucas.zaia30@gmail.com>
 * @copyright Ivan Antunes 2021
 */
export class zTranslateService {
    /**
     * Stores zTranslateService Instance.
     * @author Lucas Zaia <lucas.zaia30@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    private static instance: zTranslateService | null;

    /**
     * Executes the database connection function and stores it.
     * @author Lucas Zaia <lucas.zaia30@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    private constructor() {
        console.log(__dirname);
        if (!zConfigModule.MOD_LANG_PATH) {
            throw new Error('Language Path Not Defined. Use name translate.');
        }

        const data: zITranslateData = require(zConfigModule.MOD_LANG_PATH).translate;

        const pt = {
            translation: {
                ...data.pt
            }
        };
        const en = {
            translation: {
                ...data.en
            }
        };

        i18next.init({
            debug: false,
            fallbackLng: zConfigModule.MOD_LANG,
            resources: {
                pt,
                en
            }
        }, (err, t) => {
            if (err) {
                throw new Error('Failed to Initialized i18next.');
            }
            this.t = t.bind(this);
        });

    }

    /**
     * Function used to get instance of zTranslateService
     * @returns zTranslateService
     * @author Lucas Zaia <lucas.zaia30@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public static getInstance(): zTranslateService {
        if (!zTranslateService.instance) {
            zTranslateService.instance = new zTranslateService();
        }
        return zTranslateService.instance;
    }

    /**
     * Function used to destroy instance of zTranslateService
     * @author Lucas Zaia <lucas.zaia30@gmail.com>
     * @copyright Ivan Antunes 2021
     */
    public static destroyInstance(): void {
        zTranslateService.instance = null;
    }

    public t: TFunction = () => {
        throw Error('Translate Service is Not Initialized.');
    }

    public setCurrentLanguage(lang: string): void {
        i18next.changeLanguage(lang);
    }

    public getCurrentLanguage(): string {
        return i18next.language;
    }

}
