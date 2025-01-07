# Core package

This is core package for Yoopta-Editor

### Installation

```bash
yarn add @yoopta/editor
```

### Usage

```tsx
import YooptaEditor, { createYooptaEditor, YooEditor } from '@yoopta/editor';
// plugins
import Paragraph from '@yoopta/paragraph';

const plugins = [Paragraph];

const Editor = () => {
  // create instance
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState();

  const onChange = (newValue) => setValue(newValue);

  return <YooptaEditor editor={editor} plugins={plugins} value={value} onChange={onChange} />;
};
```

### YooptaEditor component props

```ts
type Props = {
  /**
   * Instance of editor
   */
  editor: YooEditor;
  /**
   * Optional custom id. Useful for multiple instances
   */
  id?: string;
  /**
   * List of plugins
   */
  plugins: YooptaPlugin[];
  /**
   * List of marks from @yoopta/marks
   */
  marks?: YooptaMark<any>[];
  /**
   * Optional value of editor. DEFAULT - [undefined]
   */
  value?: YooptaContentValue;
  /**
   * Autofocus when editor is ready. DEFAULT - [true]
   */
  autoFocus?: boolean;
  /**
   * Additional className for your needs. DEFAULT - [.yoopta-editor]
   */
  className?: string;
  /**
   * Box for selection area to select by mouse several blocks. DEFAULT - [document]
   */
  selectionBoxRoot?: HTMLElement | React.MutableRefObject<HTMLElement | null> | false;
  children?: React.ReactNode;
  tools?: Partial<Tools>;
  placeholder?: string;
  readOnly?: boolean;
  /* Width. [Default] - 400px. Will be DEPRECATED, use style object  */
  width?: number | string;
  /* Style CSS Object. [Default] - { width: 400, paddingBottom: 100 }
   */
  style?: number | string;
  /* Change handler  */
  onChange?: (value: YooptaContentValue, options: YooptaOnChangeOptions) => void;
  /* Path change handler */
  onPathChange?: (path: YooptaPath) => void;
  /* Custom translations for the editor. Allows you to override current translations or add a new whole language. */
  translations?: Translations;
};
```

### Editor API

```tsx
export type YooEditor = {
  id: string;
  readOnly: boolean;
  isEmpty: () => boolean;

  // block handlers
  insertBlock: WithoutFirstArg<typeof insertBlock>;
  updateBlock: WithoutFirstArg<typeof updateBlock>;
  deleteBlock: WithoutFirstArg<typeof deleteBlock>;
  duplicateBlock: WithoutFirstArg<typeof duplicateBlock>;
  toggleBlock: WithoutFirstArg<typeof toggleBlock>;
  increaseBlockDepth: WithoutFirstArg<typeof increaseBlockDepth>;
  decreaseBlockDepth: WithoutFirstArg<typeof decreaseBlockDepth>;
  moveBlock: WithoutFirstArg<typeof moveBlock>;
  focusBlock: WithoutFirstArg<typeof focusBlock>;
  mergeBlock: () => void;
  splitBlock: (options?: SplitBlockOptions) => void;
  getBlock: (options: GetBlockOptions) => YooptaBlockData | null;

  // path handlers
  path: YooptaPath;
  setPath: (path: YooptaPath) => void;

  children: YooptaContentValue;
  getEditorValue: () => YooptaContentValue;
  setEditorValue: WithoutFirstArg<typeof setEditorValue>;
  blockEditorsMap: YooptaPluginsEditorMap;
  blocks: YooptaBlocks;
  formats: YooptaFormats;
  shortcuts: Record<string, YooptaBlock>;
  plugins: Record<string, Plugin<Record<string, SlateElement>, unknown>>;
  commands: Record<string, (...args: any[]) => any>;

  // core handlers
  applyTransforms: WithoutFirstArg<typeof applyTransforms>;
  batchOperations: (fn: () => void) => void;

  // events handlers
  on: <K extends keyof YooptaEventsMap>(event: K, fn: (payload: YooptaEventsMap[K]) => void) => void;
  once: <K extends keyof YooptaEventsMap>(event: K, fn: (payload: YooptaEventsMap[K]) => void) => void;
  off: <K extends keyof YooptaEventsMap>(event: K, fn: (payload: YooptaEventsMap[K]) => void) => void;
  emit: <K extends keyof YooptaEventsMap>(event: K, payload: YooptaEventsMap[K]) => void;

  // focus handlers
  isFocused: () => boolean;
  blur: (options?: EditorBlurOptions) => void;
  focus: () => void;

  // parser handlers
  getHTML: (content: YooptaContentValue) => string;
  getMarkdown: (content: YooptaContentValue) => string;
  getPlainText: (content: YooptaContentValue) => string;
  getEmail: (content: YooptaContentValue, templateOptions: EmailTemplateOptions) => string;

  // history
  historyStack: Record<HistoryStackName, HistoryStack[]>;
  isSavingHistory: WithoutFirstArg<typeof YooptaHistory.isSavingHistory>;
  isMergingHistory: WithoutFirstArg<typeof YooptaHistory.isMergingHistory>;
  withoutSavingHistory: WithoutFirstArg<typeof YooptaHistory.withoutSavingHistory>;
  withoutMergingHistory: WithoutFirstArg<typeof YooptaHistory.withoutMergingHistory>;
  withMergingHistory: WithoutFirstArg<typeof YooptaHistory.withMergingHistory>;
  withSavingHistory: WithoutFirstArg<typeof YooptaHistory.withSavingHistory>;
  redo: WithoutFirstArg<typeof YooptaHistory.redo>;
  undo: WithoutFirstArg<typeof YooptaHistory.undo>;

  // ref to editor element
  refElement: HTMLElement | null;
};
```

### Hooks from @yoopta/editor

```ts
/**
 * Hook to access the Yoopta editor instance. Must be used in children components of <YooptaEditor />.
 * @returns {YooEditor} The editor instance.
 */
useYooptaEditor();

/**
 * Hook to check if the editor is in read-only mode.
 * @returns {boolean} True if the editor is read-only.
 */
useYooptaReadOnly();

/**
 * Hook to check if the editor is focused.
 * @returns {boolean} True if the editor is focused.
 */
useYooptaFocused();

/**
 * Hook to get the data for a specific block by its ID.
 * @param {string} blockId The ID of the block.
 * @returns {YooptaBlockData | undefined} The data of the block, or undefined if not found.
 */
useBlockData(blockId);

/**
 * Hook to get the options for a plugin.
 * @template TOptions The type of options expected.
 * @param {string} blockType The block type associated with the plugin.
 * @returns {PluginOptions<TOptions>} The options of the plugin.
 */
useYooptaPluginOptions<TOptions>(blockType);

/**
 * Hook to interact with the Yoopta Editor translation system.
 *
 * @returns {UseTranslationReturn} An object with:
 * - `t(key: string)`: Fetch a translation by key (e.g., `t('core.save')`).
 * - `currentLanguage`: The active language (e.g., `'en'`).
 * - `setLanguage(lang: string)`: Change the active language (e.g., `setLanguage('es')`).
 * - `getAvailableKeys()`: Get all translation keys for the current language. Provided as a utility function to know all available keys at runtime.
 */
useTranslation()
```
