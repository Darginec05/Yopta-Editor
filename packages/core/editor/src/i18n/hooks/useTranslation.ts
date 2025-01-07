import { useEffect, useState } from 'react';
import { YooptaTranslationManager } from '../TranslationManager';
import { UseTranslationReturn } from './types';

export const useTranslation = (): UseTranslationReturn => {
    const [language, setLanguage] = useState(() => YooptaTranslationManager.getCurrentLanguage());
    const [t, setT] = useState(() => (key: string) => YooptaTranslationManager.translate(key));

    useEffect(() => {
        const handleUpdate = () => {
            setLanguage(YooptaTranslationManager.getCurrentLanguage());
            setT(() => (key: string) => YooptaTranslationManager.translate(key));
        };

        const unsubscribe = YooptaTranslationManager.subscribe(handleUpdate);

        // Initialize the state in case it changes before mounting
        handleUpdate();

        return () => unsubscribe();
    }, []);

    const changeLanguage = (lang: string) => {
        YooptaTranslationManager.setLanguage(lang);
    };

    const getAvailableKeys = () => YooptaTranslationManager.getAvailableKeys();

    return {
        t,
        currentLanguage: language,
        setLanguage: changeLanguage,
        getAvailableKeys,
    };
};
