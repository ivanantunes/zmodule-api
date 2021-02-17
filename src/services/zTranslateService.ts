import { zITranslateData } from './../interfaces';
import i18next, { TFunction } from 'i18next';
import { zConfigModule } from './../configs';
import {
  zLgnGeneric,
  zLgnDatabase
} from '../locale';

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
   * Perform the translation initialization and check the dates.
   * @author Lucas Zaia <lucas.zaia30@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  private constructor() {
    if (!zConfigModule.MOD_LANG_PATH) {
      throw new Error('Language Path Not Defined. Use name translate.');
    }

    const data: zITranslateData = require(zConfigModule.MOD_LANG_PATH).translate;

    const pt = {
      translation: {
        ...data.pt,
        ...zLgnGeneric.pt,
        ...zLgnDatabase.pt
      }
    };
    const en = {
      translation: {
        ...data.en,
        ...zLgnGeneric.en,
        ...zLgnDatabase.en
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

  /**
   * Function used to Translate.
   * @author Lucas Zaia <lucas.zaia30@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public t: TFunction = () => {
    throw Error('Translate Service is Not Initialized.');
  }

  /**
   * Function define current language.
   * @param {string} lang - Language Translate.
   * @author Lucas Zaia <lucas.zaia30@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public setCurrentLanguage(lang: string): void {
    i18next.changeLanguage(lang);
  }

  /**
   * Function get current Language.
   * @returns string
   * @author Lucas Zaia <lucas.zaia30@gmail.com>
   * @copyright Ivan Antunes 2021
   */
  public getCurrentLanguage(): string {
    return i18next.language;
  }

}
