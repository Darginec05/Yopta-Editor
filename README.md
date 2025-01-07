<a href="https://www.producthunt.com/posts/yoopta-editor?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-yoopta&#0045;editor" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=453627&theme=light&period=daily" alt="Yoopta&#0045;Editor - Open&#0045;source&#0032;text&#0045;editor | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

<!-- [![RepoRater](https://repo-rater.eddiehub.io/api/badge?owner=Darginec05&name=Yoopta-Editor)](https://repo-rater.eddiehub.io/rate?owner=Darginec05&name=Yoopta-Editor) -->

![npm](https://img.shields.io/npm/v/@yoopta/editor)
![downloads](https://img.shields.io/npm/dm/@yoopta/editor)
[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/Darginec05)

# Welcome to Yoopta-Editor@v4🎉

![](/docs/public/yoopta_intro.gif)

![Alt](https://repobeats.axiom.co/api/embed/0d5703e649e2ba6be41450de891f466ce6935ff0.svg 'Repobeats analytics image')

## Introduction

Yoopta-Editor is a free, open-source rich-text editor built for React apps. It’s packed with features that let you build an editor as powerful and user-friendly as Notion, Craft, Coda, Medium etc.

With Yoopta-Editor, you can customize everything to fit exactly what you need. Want to tweak the look, add cool features, or craft a completely custom user interface? No problem. Yoopta-Editor gives you the flexibility to do it all, making it easy to create the perfect tool for your project.
All of this is customizable, extensible, and easy to set up!

## Features

- Easy setup
- Default list of powerful plugins
- Many typical solved problems in UX behaviour.
- Media plugins on steroids with optimization and lazy loadings
- Code plugin on steroids with themes and languages
- Each plugin can be easily customized and extensible
- Drag and drop, nested dnd is supported also
- Selection box for manipulating multiple blocks at once
- You can create your own plugin
- A list of useful tools (ActionMenu, Toolbar etc.) for the convenience of working with the editor
- Automatic lazy loading for media components (eg. embeds)
- Large documents
- Mobile friendly
- Indent and outdent for every plugin by tabs and shift+tabs
- Editor instance to programmatically control your content
- Editor events for saving to DB in real-time
- Exports in markdown, html, plain text
- Shortcuts, hotkeys. And customization for this!
- Super AI tools not for HYPE, but for real useful work with editor content - [in progress]
- The soul invested in the development of this editor 💙
- ... and other features that I forgot to write about in this list 😅. Just check it in examples!

## Packages

- Core

  - [**@yoopta/editor**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/core/editor/README.md)
  - [**@yoopta/exports**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/core/exports/README.md)
  - [**@yoopta/email-builder**](https://github.com/yoopta-editor/Email-Builder)

- Plugins

  - [**@yoopta/paragraph**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/paragraph/README.md)
  - [**@yoopta/blockquote**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/blockquote/README.md)
  - [**@yoopta/accordion**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/accordion/README.md)
  - [**@yoopta/divider**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/divider/README.md)
  - [**@yoopta/table**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/table/README.md)
  - [**@yoopta/code**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/code/README.md)
  - [**@yoopta/embed**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/embed/README.md)
  - [**@yoopta/image**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/image/README.md)
  - [**@yoopta/link**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/link/README.md)
  - [**@yoopta/file**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/file/README.md)
  - [**@yoopta/callout**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/callout/README.md)
  - [**@yoopta/video**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/video/README.md)
  - [**@yoopta/lists**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/lists/README.md)
  - [**@yoopta/headings**](https://github.com/Darginec05/Yoopta-Editor/blob/master/packages/plugins/headings/README.md)

- Tools

  - **@yoopta/action-menu-list**
  - **@yoopta/toolbar**
  - **@yoopta/link-tool**
  - _@yoopta/chat-gpt-assistant_ - **soon**

- Marks
  - **@yoopta/marks** - _[Bold, Italic, CodeMark, Underline, Strike, Highlight]_

## Getting Started

First, install the peer dependencies and the Yoopta core package with at least one plugin

```bash
## slate, slate-react, react, react-dom - peer dependencies
## @yoopta/editor - core package
yarn add slate slate-react @yoopta/editor @yoopta/paragraph
# or
npm install slate slate-react @yoopta/editor @yoopta/paragraph
```

### Start from core package

Import from core package **@yoopta/editor** Editor Component and function to create editor instance

```jsx
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';

const plugins = [...];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor(), []);
   const [value, setValue] = useState<YooptaContentValue>();

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(value);
  };

  return (
    <div>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
```

Available props for YooptaEditor components

```typescript
type YooptaEditor = {
  /* editor instance */
  editor: YooEditor;
  /* list of plugins */
  plugins: YooptaPlugin[];
  /* list of marks */
  marks?: YooptaMark<any>[];
  /* Value. [Default] - undefined */
  value?: YooptaContentValue;
  /* Change handler  */
  onChange?: (value: YooptaContentValue, options: YooptaOnChangeOptions) => void;
  /* Path change handler */
  onPathChange?: (path: YooptaPath) => void;
  /* autoFocus. [Default] - true */
  autoFocus?: boolean;
  /* className - class name */
  className?: string;
  /* These props define the area for the selection box. 
  Good practice - passing parent element.
  [Default] - document */
  selectionBoxRoot?: HTMLElement | React.MutableRefObject<HTMLElement | null> | false;
  children?: React.ReactNode;
  /* Props for tools. You can get access to any passed tools using `useTools` hook from @yoopta/editor  */
  tools?: Partial<Tools>;
  placeholder?: string;
  readOnly?: boolean;
  /* Width. [Default] - 400px. Will be DEPRECATED, use style object  */
  width?: number | string;
  /* Style CSS Object. [Default] - { width: '400px', paddingBottom: '100px' } */
  style?: number | string;
  /* Id for your editor instance. Can be useful for multiple editors */
  id?: number | string;
  /* Custom translations for the editor. Allows you to override current translations or add a new whole language. */
  translations?: Translations;
};
```

### Plugins:

Here is list of available plugins

- @yoopta/paragraph
- @yoopta/blockquote
- @yoopta/table
- @yoopta/divider
- @yoopta/accordion
- @yoopta/code
- @yoopta/embed
- @yoopta/image
- @yoopta/link
- @yoopta/file
- @yoopta/callout
- @yoopta/video
- @yoopta/lists
- @yoopta/headings

### How to use

```jsx
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';

const plugins = [Paragraph, Blockquote];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();
  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(value);
  };

  return (
    <div>
      <YooptaEditor
        editor={editor}
        placeholder="Type text.."
        value={value}
        onChange={onChange}
        // here we go
        plugins={plugins}
      />
    </div>
  );
}
```

**_[Check code with plugins](https://github.com/Darginec05/Yoopta-Editor/tree/master/web/next-example/src/components/examples/withBaseFullSetup/index.tsx#L27)_**

### Tools

Yoopta-Editor provides useful tools that can help you when working with the editor

Here is a list of available tools

- @yoopta/action-menu-list
- @yoopta/toolbar
- @yoopta/link-tool
- _@yoopta/chat-gpt-assistant_ - **soon**

**_[Check code with tools](https://github.com/Darginec05/Yoopta-Editor/tree/master/web/next-example/src/components/examples/withBaseFullSetup/index.tsx#L76)_**

### How to use

```jsx
// IMPORT TOOLS
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';

// Tools should be defined outside component
const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();
  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(value);
  };

  return (
    <div>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        placeholder="Type text.."
        value={value}
        onChange={onChange}
        // here we go
        tools={TOOLS}
      />
    </div>
  );
}
```

### Marks

Marks are simple text formats

Here is a list of available marks from **@yoopta/marks** package

- Bold
- Italic
- CodeMark
- Underline
- Strike
- Highlight

### How to use

```jsx
// IMPORT MARKS
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor(), []);
   const [value, setValue] = useState<YooptaContentValue>();

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(value);
  };

  return (
    <div>
      <YooptaEditor
        editor={editor}
        placeholder="Type text.."
        plugins={plugins}
        value={value}
        onChange={onChange}
        tools={TOOLS}
        // here we go
        marks={MARKS}
      />
    </div>
  );
}
```

**_[Check code with marks](https://github.com/Darginec05/Yoopta-Editor/tree/master/web/next-example/src/components/examples/withBaseFullSetup/index.tsx#L85)_**

## Examples - DEMO's

Find below useful examples of utilising the Yoopta-Editor in your projects. These examples will help you get started quickly and show you how easy it is to integrate and customize the editor to your needs.

Okay, let's go!

- [With basic example](https://yoopta.dev/examples/withBaseFullSetup)
- [With custom toolbar (Notion and Medium example)](https://yoopta.dev/examples/withCustomToolbar)
- [With Notion Action Menu](https://yoopta.dev/examples/withNotionActionMenu)
- [With dark theme](https://yoopta.dev/examples/withDarkTheme)
- [With media plugins](https://yoopta.dev/examples/withMedia)
- [With extended plugins](https://yoopta.dev/examples/withExtendedPlugin)
- [With readonly](https://yoopta.dev/examples/withReadOnly)
- [With custom HTML attributes](https://yoopta.dev/examples/withCustomHTMLAttributes)
- [With custom mark](https://yoopta.dev/examples/withCustomMark)
- [With chat slack](https://yoopta.dev/examples/withChatSlack)
- ...and check other examples in the sidebar list

## Give us ⭐️ star

If you find Yoopta-Editor useful and valuable for your projects, I kindly ask you to show your support by giving to this repo ⭐️ star on GitHub. Your appreciation means a lot to me and helps me grow and continue improving the editor for the community. 💙

## Roadmap

- Develop other powerful plugins
- AI tools
- Simplify API for creating plugins
- Collaborative mode
- Plugin system
- Optimizations for media components
- Create package @yoopta/hotkeys to manage hotkeys
- Rethink the approach for just rendering to increase SEO performance
- Continue improving the project. [We are listening to you and your requests](https://github.com/Darginec05/Yoopta-Editor/discussions/new/choose) 💙

## Support

Hey there! If you find this project useful or it helps you in your work, consider supporting it to ensure continuous improvements and development. Your donations help keep the project alive and allow me to invest more time and resources into maintaining and enhancing it.

### How to Support

You can support the project by:

- ⭐ Star this repository to show your appreciation.
- 🗣 Share the project with your friends, colleagues, and on social media.
- 💸 Make a donation to help fund development efforts.

### Donation Options

- [Github Sponsors](https://github.com/sponsors/Darginec05)

Any contribution, big or small, is highly appreciated and helps me maintain the project and add exciting new features. Thank you for your support! 🙏

## Project structure

```text
packages/
├── core - core components of the editor
├── marks - text marks
├── plugins - editor plugin extensions
├── tools - tools packages
└── development - developer playground
```

## Contributing

If you're ready to support Yoopta-Editor, here's how you can do it:

- If you've spotted a bug or thinking of a feature [raise an issue](https://github.com/Darginec05/Yoopta-Editor/issues/new/choose)
- If you want to collaborate on the project, find an issue you like to work on and suggest your changes. Checkout [contributing guidelines](./CONTRIBUTING.md).
- If you want to discuss your idea feel free to create a [discussion](https://github.com/Darginec05/Yoopta-Editor/discussions/new/choose)
- Or join our [Discord Community](https://discord.gg/Dt8rhSTjsn) and get in touch with us

<a href="https://github.com/Darginec05/Yoopta-Editor/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Darginec05/Yoopta-Editor" />
</a>

## License

Yoopta-Editor is released under the [MIT License](https://github.com/Darginec05/Yopta-Editor/blob/master/LICENSE). Feel free to use and modify it for your projects.

## Contacts

- [Discord Community](https://discord.gg/Dt8rhSTjsn)
- [Twitter](https://twitter.com/LebovskiYoo)
- [Github](https://github.com/Darginec05)
