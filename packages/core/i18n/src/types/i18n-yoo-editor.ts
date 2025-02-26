import { YooEditor } from '@yoopta/editor';

export interface NestedTranslations {
    [key: string]: string | NestedTranslations;
}

/**
 * The base `YooEditor` extended to add internationalization (i18n) support.
 *
 * This extension adds the ability to manage translations, track the current language,
 * and switch between multiple available languages dynamically.
 *
 * @example
 * ```ts
 *  const baseEditor = createYooptaEditor();
 *  const editorWithI18n = withTranslations(baseEditor, {
 *      translations: { es: esTranslations, en: enTranslations },
 *      defaultLanguage: "en",
 *      language: "es",
 *  });
 *  ```
 */
export type I18nYooEditor<YKeys extends string = string> = YooEditor & {
    /**
     * A record of translations, where each key represents a language,
     * and its value contains nested translation strings.
     */
    translations: Record<YKeys, NestedTranslations>;

    /**
     * The currently active language of the editor.
     */
    language: string;

    /**
     * A list of all supported languages available in the editor.
     */
    languages: string[];

    /**
     * The default language of the editor (used as a fallback when translations are missing).
     */
    defaultLanguage: string;

    /**
     * Updates the editor's language.
     *
     * When `setLanguage` is called:
     * - The `language` property is updated.
     * - A `'language-change'` event is emitted, allowing users to listen for language updates.
     *
     * @example
     * ```ts
     * editor.setLanguage('es'); // Changes the editor language to Spanish.
     *
     * editor.on('language-change', (lang) => {
     *   console.log('Language changed to:', lang);
     * });
     * ```
     *
     * @param lang - The new language to set (must be one of the `languages` values).
     */
    setLanguage: (lang: string) => void;
};
