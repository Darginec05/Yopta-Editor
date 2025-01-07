import { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { RenderElementProps as RenderSlateElementProps, RenderLeafProps } from 'slate-react';
import { SlateEditor, SlateElement, YooEditor, YooptaBlockBaseMeta, YooptaBlockData } from '../editor/types';
import { EditorEventHandlers } from '../types/eventHandlers';
import { HOTKEYS_TYPE } from '../utils/hotkeys';
import {PluginTranslations} from '../i18n/types';

export enum NodeType {
  Block = 'block',
  Inline = 'inline',
  Void = 'void',
  InlineVoid = 'inlineVoid',
}

export type PluginOptions<T> = Partial<
  {
    display?: {
      title?: string;
      description?: string;
      icon?: string | ReactNode | ReactElement;
    };
    shortcuts?: string[];
    HTMLAttributes?: HTMLAttributes<HTMLElement>;
  } & T
>;

export type PluginElementOptions = {
  draggable?: boolean;
};

export type PluginElementExtendRenderProps = RenderSlateElementProps & {
  blockId: string;
  HTMLAttributes?: HTMLAttributes<HTMLElement>;
};

export type PluginElementRenderProps = PluginElementExtendRenderProps & {
  extendRender?: (props: PluginElementExtendRenderProps) => JSX.Element;
};

export type PluginCustomEditorRenderProps = {
  blockId: string;
};

export type PluginDefaultProps = { nodeType?: 'block' | 'inline' | 'void' | 'inlineVoid' };
export type PluginElementProps<T> = PluginDefaultProps & T;

export type PluginElement<TKeys, T> = {
  render: (props: PluginElementRenderProps) => JSX.Element;
  props?: PluginElementProps<T>;
  options?: PluginElementOptions;
  asRoot?: boolean;
  children?: TKeys[];
  rootPlugin?: string;
};

export type PluginElementsMap<TKeys extends string = string, TProps = PluginDefaultProps> = {
  [key in TKeys]: PluginElement<TKeys, TProps>;
};

export type EventHandlers = {
  [key in keyof EditorEventHandlers]: (
    editor: YooEditor,
    slate: SlateEditor,
    options: PluginEventHandlerOptions,
  ) => EditorEventHandlers[key] | void;
};

export type PluginEventHandlerOptions = {
  hotkeys: HOTKEYS_TYPE;
  defaultBlock: YooptaBlockData;
  currentBlock: YooptaBlockData;
};

export type ElementPropsMap = Record<string, Record<string, unknown>>;

export type PluginEvents = {
  onBeforeCreate?: (editor: YooEditor) => SlateElement;
  onCreate?: (editor: YooEditor, blockId: string) => void;
  onDestroy?: (editor: YooEditor, blockId: string) => void;
} & EventHandlers;

export type Plugin<TElementMap extends Record<string, SlateElement>, TPluginOptions = Record<string, unknown>> = {
  type: string;
  customEditor?: (props: PluginCustomEditorRenderProps) => JSX.Element;
  extensions?: (slate: SlateEditor, editor: YooEditor, blockId: string) => SlateEditor;
  commands?: Record<string, (editor: YooEditor, ...args: any[]) => any>;
  elements: {
    [K in keyof TElementMap]: PluginElement<Exclude<keyof TElementMap, K>, TElementMap[K]['props']>;
  };
  events?: PluginEvents;
  options?: PluginOptions<TPluginOptions>;
  parsers?: Partial<Record<PluginParserTypes, PluginParsers>>;
  translations: PluginTranslations;
};

export type PluginParsers = {
  deserialize?: PluginDeserializeParser;
  serialize?: PluginSerializeParser;
};

export type PluginParserTypes = 'html' | 'markdown' | 'email';
export type PluginParserValues = 'deserialize' | 'serialize';

export type PluginSerializeParser = (
  element: SlateElement,
  content: string,
  blockMetaData?: YooptaBlockBaseMeta,
) => string;

export type PluginDeserializeParser = {
  nodeNames: string[];
  parse?: (el: HTMLElement, editor: YooEditor) => SlateElement<string, any> | YooptaBlockData[] | void;
};

export type LeafFormats<K extends string, V> = {
  [key in K]: V;
};

export type ExtendedLeaf<K extends string, V> = RenderLeafProps['leaf'] & LeafFormats<K, V>;
export type YooptaMarkProps<K extends string, V> = { children: RenderLeafProps['children']; leaf: ExtendedLeaf<K, V> };

export type ExtendedLeafProps<K extends string, V> = RenderLeafProps & {
  leaf: ExtendedLeaf<K, V>;
};
