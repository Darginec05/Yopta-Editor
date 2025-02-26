# @yoopta/i18n

This package provides internationalization (i18n) support for **YooptaEditor** by extending the editor with translation capabilities.

## 📦 Installation

```bash
yarn add @yoopta/i18n
```

## 🔹 Exports

```typescript
import { withTranslations, type I18nYooEditor } from '@yoopta/i18n';
```

### **Modules**

- **`withTranslations`** - Function to extend `YooEditor` with i18n support.
- **`I18nYooEditor`** - Extended type for `YooEditor` with i18n properties.

---

## 🛠 Usage

If you only need to extend the editor with i18n support, you can use `withTranslations()`.

```tsx
import { withTranslations } from '@yoopta/i18n';
import { createYooptaEditor, YooptaEditor } from '@yoopta/editor';
import { useMemo, useEffect } from 'react';

import esTranslations from '@/locales/es.json';
import ruTranslations from '@/locales/ru.json';
import czTranslations from '@/locales/cz.json';

const TRANSLATIONS = {
  es: esTranslations,
  ru: ruTranslations,
  cz: czTranslations,
};

const editor = useMemo(() => {
  const baseEditor = createYooptaEditor();
  return withTranslations(baseEditor, {
    translations: TRANSLATIONS,
    defaultLanguage: 'en',
    language: 'es',
  });
}, []);

// track language change if you need
useEffect(() => {
  const handleLanguageChange = (lang: string) => {
    console.log('Language changed to:', lang);
  };

  editor.on('language-change', handleLanguageChange);
  return () => {
    editor.off('language-change', handleLanguageChange);
  };
}, [editor]);
```

## 📜 **I18n API**

When `withTranslations` is applied to the editor, it extends `YooEditor` with the following additional properties and methods:

```typescript
export type I18nYooEditor<YKeys extends string = string> = YooEditor & {
  translations: Record<YKeys, Record<string, string>>;
  language: string;
  languages: string[];
  defaultLanguage: string;
  setLanguage: (lang: string) => void;
  t: (keyPath: string) => string;
};
```
