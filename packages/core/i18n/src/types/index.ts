import { YooEditor, Plugin } from '@yoopta/editor';

export type TranslationPlugin = {
  display: {
    title: string;
    description: string;
  };
  options: Record<string, unknown>;
};

export type Translation<P extends Plugin<{}>[] = Plugin<{}>[]> = {
  plugins: Record<keyof P, TranslationPlugin>;
  editor: {
    blockOptions: {
      delete: string;
      duplicate: string;
      turnInto: string;
      copyBlockLink: string;
    };
    placeholder: string;
  };
  tools: {
    toolbar: {
      highlightColor: {
        text: string;
        background: string;
        customColor: string;
      };
      linkTitle: string;
    };
    link: {
      target: string;
      rel: string;
      update: string;
      add: string;
      delete: string;
      url: string;
      title: string;
      additionalProps: string;
      titlePlaceholder: string;
      urlPlaceholder: string;
      targetPlaceholder: string;
      relPlaceholder: string;
    };
  };
  [key: string]: unknown;
};

export type Translations<K extends string> = Record<K, Translation>;

export type I18nYooEditor<Keys extends string = string> = YooEditor & {
  translations: Translations<Keys>;
  language: Keys;
  defaultLanguage: Keys;
  languages: Keys[];
  setLanguage: (lang: Keys) => void;
  t: (key: string) => string;
};
