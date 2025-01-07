import {UseAddTranslationsReturn} from './types';
import {useCallback} from 'react';
import {YooptaTranslationManager} from '../TranslationManager';
import {NestedTranslations} from '../types';

export const useAddTranslations = (): UseAddTranslationsReturn => {
    const addTranslations = useCallback(
        (language: string, namespace: string, translations: NestedTranslations) => {
            YooptaTranslationManager.addTranslations(language, namespace, translations);
        },
        []
    );

    return { addTranslations }
}
