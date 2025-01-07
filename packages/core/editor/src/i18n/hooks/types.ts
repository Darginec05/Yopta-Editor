import { NestedTranslations } from '../types';

export interface UseTranslationReturn {
    /**
     * Translates a key into the current language.
     * The key format is `namespace.key`, e.g., `core.save`.
     * If the translation for the key is not found, it returns the key provided.
     *
     * @param key - The key to translate, formatted as `namespace.key`.
     * @returns The translated string or a fallback message.
     */
    t: (key: string) => string;

    /**
     * The current language set in the translation manager.
     * This value updates reactively when the language is changed.
     */
    currentLanguage: string;

    /**
     * Changes the current language to the specified value.
     * Notifies all subscribers of the language change.
     *
     * @param lang - The language code to set, e.g., 'en' or 'es' or 'fr'...
     */
    setLanguage: (lang: string) => void;

    /**
     * Retrieves all available keys for the current language.
     * This is provided as a utility function to know all available keys at runtime.
     * The keys are grouped by namespace and provide introspection into all registered translations.
     *
     * @returns A record where the keys are namespaces and the values are arrays of available keys.
     */
    getAvailableKeys: () => Record<string, string[]>;
}

export interface UseAddTranslationsReturn {
    /**
     * Enables adding new translations at runtime for specific languages and namespaces.
     *
     * Example Usage:
     * ```
     * const { addTranslations } = useAddTranslations();
     * addTranslations('es', 'core', { save: 'Guardar', cancel: 'Cancelar' });
     * addTranslations('en', 'paragraph', { placeholder: 'Type a paragraph...' });
     * ```
     *
     * @param language - The language code to add translations for (e.g., 'en' or 'es').
     * @param namespace - The namespace grouping the translations (e.g., 'core', 'plugin').
     * @param translations - A record of key-value pairs representing the translations.
     */
    addTranslations: (language: string, namespace: string, translations: NestedTranslations) => void;
}
