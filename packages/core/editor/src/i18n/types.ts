/**
 * Interface representing the structure of the translations used in YooptaTranslationManager.
 *
 * This structure organizes translations by language and namespace, making it easy to
 * group related keys and support multiple languages.
 *
 * Example Usage:
 * ```
 * const translations: Translations = {
 *   en: {
 *     core: {
 *       save: 'Save',
 *       cancel: 'Cancel',
 *     },
 *     paragraph: {
 *       placeholder: 'Type a paragraph...',
 *     },
 *   },
 *   es: {
 *     core: {
 *       save: 'Guardar',
 *       cancel: 'Cancelar',
 *     },
 *     paragraph: {
 *       placeholder: 'Escribe un párrafo...',
 *     },
 *   },
 * };
 * ```
 *
 * Structure:
 * - `language` (string): Represents the language code, e.g., 'en', 'es'.
 * - `namespace` (string): Groups related translations, such as 'core' or 'paragraph'.
 * - `Record<string, string>`: Contains key-value pairs where:
 *   - The key (string) is the identifier for a specific translation.
 *   - The value (string) is the translated text for that key.
 */
export interface Translations {
    [language: string]: {
        [namespace: string]: NestedTranslations;
    };
}

export interface PluginTranslations {
    [language: string]: MandatoryPluginTranslations & NestedTranslations;
}

type MandatoryPluginTranslations = {
    title: string;
    description: string;
};

export interface NestedTranslations {
    [key: string]: string | NestedTranslations;
}
