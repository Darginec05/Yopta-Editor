import {enLocale} from './en';
import {esLocale} from './es';
import {Translations} from '../types';

export const defaultLocales: Translations = {
    ...enLocale,
    ...esLocale,
}
