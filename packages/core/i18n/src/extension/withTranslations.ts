import { YooEditor } from '@yoopta/editor';
import { I18nYooEditor, Translations } from '../types';

type TranslationOptions<K extends string> = {
  language: K;
  defaultLanguage: K;
  translations: Translations<K>;
};

function getNestedValue(obj: any, path: string[]): string | undefined {
  return path.reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return acc[part];
    }
    return undefined;
  }, obj);
}

export function withTranslations<K extends string>(
  editor: YooEditor,
  options: TranslationOptions<K>,
): I18nYooEditor<K> {
  const i18nEditor = editor as I18nYooEditor<K>;

  const { translations, defaultLanguage, language } = options;

  const { getLabelText } = i18nEditor;
  const languageKeys = Object.keys(translations) as K[];

  i18nEditor.getLabelText = (key: string) => {
    const keyParts = key.split('.');

    const currentLangValue = getNestedValue(
      translations[i18nEditor.language] || translations[i18nEditor.defaultLanguage],
      keyParts,
    );

    if (typeof currentLangValue === 'string') {
      return currentLangValue;
    }

    return getLabelText(key);
  };

  i18nEditor.languages = languageKeys;

  i18nEditor.setLanguage = (lang: K) => {
    if (translations[lang]) {
      i18nEditor.language = lang;
      i18nEditor.emit('language-change', lang);
    }
  };

  i18nEditor.translations = translations;
  i18nEditor.defaultLanguage = defaultLanguage;
  i18nEditor.language = language;
  i18nEditor.t = i18nEditor.getLabelText;

  return i18nEditor;
}
