import YooptaEditor, { createYooptaEditor, useTranslation } from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { useMemo, useRef } from 'react';
import { INITIAL_VALUE } from './initValue';

const plugins = [
  Paragraph,
  Table,
  Divider,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

const translations = {
  bro: {
    core: {
      editor_placeholder: "Yo, smash '/' for options, bro!",
      save: 'Bro, hit Save',
      cancel: 'Nah, cancel it',
    },
    paragraph: {
      title: 'Type it out, dude...',
      description: 'Just some chill text, bro',
    },
    table: {
      title: 'Table, bro!',
      description: "Lines and boxes, keepin' it organized, my dude.",
    },
  },
};

function WithTranslationsExample() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);
  const { currentLanguage, setLanguage } = useTranslation();

  return (
    <div
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center flex-col items-center"
      ref={selectionRef}
    >
      <div className="flex gap-2">
        <button
          className={`border-primary border-2 p-2 ${currentLanguage === 'en' ? 'bg-blue-500' : undefined}`}
          onClick={() => setLanguage('en')}
        >
          English
        </button>
        <button
          className={`border-primary border-2 p-2 ${currentLanguage === 'bro' ? 'bg-blue-500' : undefined}`}
          onClick={() => setLanguage('bro')}
        >
          Switch to Bro
        </button>
      </div>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        autoFocus
        value={INITIAL_VALUE}
        onChange={(value) => console.log(value)}
        translations={translations}
      />
    </div>
  );
}

export default WithTranslationsExample;
