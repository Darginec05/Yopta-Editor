import { insertBlock } from './blocks/insertBlock';
import { deleteBlock } from './blocks/deleteBlock';
import { moveBlock } from './blocks/moveBlock';
import { focusBlock } from './blocks/focusBlock';
import { splitBlock } from './blocks/splitBlock';
import { setPath } from './paths/setPath';
import { YooEditor, YooptaContentValue } from './types';
import { increaseBlockDepth } from './blocks/increaseBlockDepth';
import { decreaseBlockDepth } from './blocks/decreaseBlockDepth';
import { getEditorValue } from './core/getEditorValue';
import { setEditorValue } from './core/setEditorValue';
import { duplicateBlock } from './blocks/duplicateBlock';
import { updateBlock } from './blocks/updateBlock';
import { toggleBlock } from './blocks/toggleBlock';
import { blur } from './core/blur';
import { focus } from './core/focus';
import { isFocused } from './core/isFocused';
import { getBlock } from './blocks/getBlock';
import { getHTML } from '../parsers/getHTML';
import { getMarkdown } from '../parsers/getMarkdown';
import { getPlainText } from '../parsers/getPlainText';
import { isEmpty } from './core/isEmpty';
import { applyTransforms } from './core/applyTransforms';
import { batchOperations } from './core/batchOperations';
import { mergeBlock } from './blocks/mergeBlock';
import { UndoRedoOptions, YooptaHistory } from './core/history';
import EventEmitter from 'eventemitter3';
import { getEmail, EmailTemplateOptions } from '../parsers/getEmail';
import { getLabelText } from './i18n/getLabelText';

const eventEmitter = new EventEmitter();

const Events = {
  on: (event, fn) => eventEmitter.on(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  emit: (event, payload) => eventEmitter.emit(event, payload),
};

export function createYooptaEditor(): YooEditor {
  const editor: YooEditor = {
    id: '',
    children: {},
    blockEditorsMap: {},
    path: { current: null },
    readOnly: false,
    isEmpty: () => isEmpty(editor),
    getEditorValue: () => getEditorValue(editor),
    setEditorValue: (...args) => setEditorValue(editor, ...args),
    insertBlock: (...args) => insertBlock(editor, ...args),
    deleteBlock: (...args) => deleteBlock(editor, ...args),
    duplicateBlock: (...args) => duplicateBlock(editor, ...args),
    toggleBlock: (...args) => toggleBlock(editor, ...args),
    increaseBlockDepth: (...args) => increaseBlockDepth(editor, ...args),
    decreaseBlockDepth: (...args) => decreaseBlockDepth(editor, ...args),
    moveBlock: (...args) => moveBlock(editor, ...args),
    focusBlock: (...args) => focusBlock(editor, ...args),
    getBlock: (...args) => getBlock(editor, ...args),
    updateBlock: (...args) => updateBlock(editor, ...args),
    splitBlock: (...args) => splitBlock(editor, ...args),
    mergeBlock: (...args) => mergeBlock(editor, ...args),
    setPath: (...args) => setPath(editor, ...args),
    blocks: {},
    formats: {},
    shortcuts: {},
    plugins: {},
    commands: {},

    applyTransforms: (operations, ...args) => applyTransforms(editor, operations, ...args),
    batchOperations: (callback) => batchOperations(editor, callback),

    getLabelText: (key) => getLabelText(editor, key),

    on: (event, callback) => Events.on(event, callback),
    off: (event, callback) => Events.off(event, callback),
    emit: (event, ...args) => Events.emit(event, ...args),
    once: (event, callback) => Events.once(event, callback),

    isFocused: () => isFocused(editor),
    focus: () => focus(editor),
    blur: (...args) => blur(editor, ...args),

    getHTML: (content: YooptaContentValue) => getHTML(editor, content),
    getMarkdown: (content: YooptaContentValue) => getMarkdown(editor, content),
    getPlainText: (content: YooptaContentValue) => getPlainText(editor, content),
    getEmail: (content: YooptaContentValue, options?: Partial<EmailTemplateOptions>) =>
      getEmail(editor, content, options),

    refElement: null,

    historyStack: {
      undos: [],
      redos: [],
    },

    redo: (options?: UndoRedoOptions) => YooptaHistory.redo(editor, options),
    undo: (options?: UndoRedoOptions) => YooptaHistory.undo(editor, options),
    isSavingHistory: () => YooptaHistory.isSavingHistory(editor),
    isMergingHistory: () => YooptaHistory.isMergingHistory(editor),
    withoutSavingHistory: (fn) => YooptaHistory.withoutSavingHistory(editor, fn),
    withSavingHistory: (fn) => YooptaHistory.withSavingHistory(editor, fn),
    withoutMergingHistory: (fn) => YooptaHistory.withoutMergingHistory(editor, fn),
    withMergingHistory: (fn) => YooptaHistory.withMergingHistory(editor, fn),
  };

  return editor;
}

export const EDITOR_TO_ON_CHANGE = new WeakMap();
