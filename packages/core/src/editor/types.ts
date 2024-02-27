import { Descendant, Editor as SlateEditor } from 'slate';
import { Plugin, PluginElementsMap, PluginOptions } from '../plugins/types';
import { BlockSelectedOptions } from './selection/setBlockSelected';
import { CreateBlockOptions } from './transforms/createBlock';
import { DeleteBlockOptions } from './transforms/deleteBlock';
import { FocusBlockOptions } from './transforms/focusBlock';

export type YooptaBlockPath = [number];

export type YooptaChildrenKey = string;
export type YooptaChildren = Record<YooptaChildrenKey, YooptaChildrenValue>;

// [TODO] - rename to block
export type YooptaChildrenValue<T = Descendant> = {
  id: string;
  value: T[];
  type: string;
  meta: YooptaBlockBaseMeta;
};

export type YooptaBlockType = 'block' | 'inline' | 'void';

export type YooptaBlockBaseMeta = {
  order: number;
  depth: number;
  maxDepth?: number;
};

export type FocusAt = 'start' | 'end' | number;

export type YooptaEditorTransformOptions = {
  at?: YooptaBlockPath | null;
  focus?: boolean;
  focusAt?: FocusAt;
  slate?: SlateEditor;
  pluginId?: string;
};

export type YooptaPluginsEditorMap = Record<string, SlateEditor>;

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
  options?: PluginOptions;
  elements: PluginElementsMap<unknown>;
  isActive: () => boolean;
  create: (options?: CreateBlockOptions) => void;
  update: (id: string, data: any) => void;
  delete: (id: string) => void;
};

export type YooptaBlocks = Record<string, YooptaBlock>;
export type YooptaFormats = Record<string, TextFormat>;

// [TODO] - Fix generic and default types
export type YooEditor<TNodes = any, TKey extends string = any> = {
  insertBlock: (data, options?: YooptaEditorTransformOptions) => void;
  splitBlock: (options?: YooptaEditorTransformOptions) => void;
  updateBlock: (id: string, data, options?: YooptaEditorTransformOptions) => void;
  deleteBlock: (options?: DeleteBlockOptions) => void;
  getBlock: (options?: YooptaEditorTransformOptions) => void;
  increaseBlockDepth: (options?: YooptaEditorTransformOptions) => void;
  decreaseBlockDepth: (options?: YooptaEditorTransformOptions) => void;
  applyChanges: () => void;
  moveBlock: (blockId: string, to: YooptaBlockPath) => void;
  focusBlock: (id: string, options?: FocusBlockOptions) => void;
  selection: YooptaBlockPath | null;
  selectedBlocks: number[] | null;
  children: Record<string, YooptaChildrenValue>;
  getEditorValue: () => TNodes;
  setSelection: (path: YooptaBlockPath | null) => void;
  setBlockSelected: (path: number[] | null, options?: BlockSelectedOptions) => void;
  blockEditorsMap: YooptaPluginsEditorMap;
  blocks: YooptaBlocks;
  formats: YooptaFormats;
  shortcuts: Record<string, YooptaBlock>;
};

// types for slate values
export type SlateElement<T = any> = {
  id: string;
  type: string;
  children: Descendant[] | SlateElement[];
  props?: T;
};