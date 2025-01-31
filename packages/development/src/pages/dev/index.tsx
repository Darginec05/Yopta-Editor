import { useMemo, useRef, useState } from 'react';
import YooptaEditor, {
  YooptaOnChangeOptions,
  YooptaContentValue,
  YooptaPath,
  createYooptaEditor,
  buildBlockData,
} from '@yoopta/editor';
import { I18nYooEditor, I18nYooEditorProvider, withTranslations } from '@yoopta/i18n';

import { MARKS } from '@/utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '@/utils/yoopta/plugins';
import { TOOLS } from '@/utils/yoopta/tools';
import { FixedToolbar } from '@/components/FixedToolbar/FixedToolbar';
import { YOOPTA_DEFAULT_VALUE } from '@/utils/yoopta/value';

import esTranslations from '@/locales/es.json';
import ruTranslations from '@/locales/ru.json';
import czTranslations from '@/locales/cz.json';

const EDITOR_STYLE = {
  width: 750,
};

const TRANSLATIONS = {
  es: esTranslations,
  ru: ruTranslations,
  cz: czTranslations,
};

const TRANSLATION_OPTIONS = {
  translations: TRANSLATIONS,
  defaultLanguage: 'en',
  language: 'en',
};

const BasicExample = () => {
  const editor: I18nYooEditor = useMemo(() => {
    const baseEditor = createYooptaEditor();
    return withTranslations(baseEditor, TRANSLATION_OPTIONS);
  }, []);

  const selectionRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue>({
    'block-1': buildBlockData({ id: 'block-1' }),
  });

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    console.log('onChange', value, options);
    setValue(value);
  };

  const onPathChange = (path: YooptaPath) => {};

  return (
    <>
      <div className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col items-center" ref={selectionRef}>
        <I18nYooEditorProvider editor={editor} options={TRANSLATION_OPTIONS}>
          <FixedToolbar editor={editor} DEFAULT_DATA={YOOPTA_DEFAULT_VALUE} />
          <YooptaEditor
            editor={editor}
            plugins={YOOPTA_PLUGINS}
            selectionBoxRoot={selectionRef}
            marks={MARKS}
            tools={TOOLS}
            style={EDITOR_STYLE}
            value={value}
            onChange={onChange}
            onPathChange={onPathChange}
            autoFocus={true}
            readOnly={false}
          />
        </I18nYooEditorProvider>
      </div>
    </>
  );
};

export default BasicExample;
