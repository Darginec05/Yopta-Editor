import { Descendant, Path, Point, Selection } from 'slate';
import { Plugin, PluginElementsMap, PluginOptions, PluginElementProps } from '../plugins/types';
import { EditorBlurOptions } from './core/blur';
import { deleteBlock } from './blocks/deleteBlock';
import { duplicateBlock } from './blocks/duplicateBlock';
import { focusBlock } from './blocks/focusBlock';
import { toggleBlock } from './blocks/toggleBlock';
import { GetBlockOptions } from './blocks/getBlock';
import { ReactEditor } from 'slate-react';
import { applyTransforms, YooptaOperation } from './core/applyTransforms';
import { insertBlock } from './blocks/insertBlock';
import { increaseBlockDepth } from './blocks/increaseBlockDepth';
import { SplitBlockOptions } from './blocks/splitBlock';
import { HistoryStack, HistoryStackName, YooptaHistory } from './core/history';
import { WithoutFirstArg } from '../utils/types';
import { moveBlock } from './blocks/moveBlock';
import { decreaseBlockDepth } from './blocks/decreaseBlockDepth';
import { updateBlock } from './blocks/updateBlock';
import { setEditorValue } from './core/setEditorValue';
import { getHTML } from '../parsers/getHTML';
import { getMarkdown } from '../parsers/getMarkdown';
import { getPlainText } from '../parsers/getPlainText';
import { getEmail } from '../parsers/getEmail';
import { getLabelText } from './i18n/getLabelText';

export type YooptaBlockData<T = Descendant | SlateElement> = {
  id: string;
  value: T[];
  type: string;
  meta: YooptaBlockBaseMeta;
};

export type YooptaBlockBaseMeta = {
  order: number;
  depth: number;
  align?: 'left' | 'center' | 'right' | undefined;
};

export type YooptaContentValue = Record<string, YooptaBlockData>;

export type SlateEditor = ReactEditor;

// add 'end' | 'start'
export type FocusAt = Path | Point;

export type YooptaPluginsEditorMap = Record<string, SlateEditor>;
export type YooptaPathIndex = number | null;
export type YooptaPath = {
  current: YooptaPathIndex;
  selected?: number[] | null;
  selection?: Selection | null;
};

// Marks
export type TextFormat = {
  type: string;
  hotkey?: string;
  getValue: () => null | any;
  isActive: () => boolean;
  toggle: () => void;
  update: (props?: any) => void;
};

export type YooptaBlock = {
  type: string;
  options?: PluginOptions<any>;
  elements: PluginElementsMap<string>;
  hasCustomEditor?: boolean;
  isActive: () => boolean;
};

export type YooptaBlocks = Record<string, YooptaBlock>;
export type YooptaFormats = Record<string, TextFormat>;

export type YooptaEditorEventKeys = 'change' | 'focus' | 'blur' | 'block:copy' | 'path-change';
export type YooptaEventChangePayload = {
  operations: YooptaOperation[];
  value: YooptaContentValue;
};

export type YooptaEventsMap = {
  change: YooptaEventChangePayload;
  focus: boolean;
  blur: boolean;
  'block:copy': YooptaBlockData;
  'path-change': YooptaPath;
  [key: string]: any;
};

export type BaseCommands = Record<string, (...args: any[]) => any>;

// [TODO] - Fix generic and default types
// [TODO] - change with WithoutFirstArg
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

  // default labels. get label by current language. default: 'en'
  getLabelText: WithoutFirstArg<typeof getLabelText>;

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
  getHTML: WithoutFirstArg<typeof getHTML>;
  getMarkdown: WithoutFirstArg<typeof getMarkdown>;
  getPlainText: WithoutFirstArg<typeof getPlainText>;
  getEmail: WithoutFirstArg<typeof getEmail>;

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

export type SlateElementTextNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  strike?: boolean;
  highlight?: any;
};

// types for slate values
export type SlateElement<K extends string = string, T = any> = {
  id: string;
  type: K;
  children: Descendant[];
  props?: PluginElementProps<T>;
};
