import { Operation } from 'slate';
import { YooEditor, YooptaPath } from '../types';
import { YooptaOperation } from './applyTransforms';
import { WithoutFirstArg } from '../../utils/types';

export type HistoryStack = {
  operations: YooptaOperation[];
  path: YooptaPath;
};

export type HistoryStackName = 'undos' | 'redos';

export function inverseEditorOperation(editor: YooEditor, op: YooptaOperation): YooptaOperation | YooptaOperation[] {
  switch (op.type) {
    case 'insert_block':
      return {
        type: 'delete_block',
        path: op.path,
        block: op.block,
      };

    case 'delete_block':
      return {
        type: 'insert_block',
        path: op.path,
        block: op.block,
      };

    case 'set_block_meta': {
      return {
        type: 'set_block_meta',
        id: op.id,
        properties: op.prevProperties,
        prevProperties: op.properties,
      };
    }

    case 'split_block': {
      return {
        type: 'merge_block',
        sourceProperties: op.properties,
        targetProperties: op.prevProperties,
        mergedProperties: op.prevProperties,
        slate: editor.blockEditorsMap[op.prevProperties.id],
      };
    }

    case 'merge_block': {
      return {
        type: 'split_block',
        prevProperties: op.targetProperties,
        properties: op.sourceProperties,
        slate: editor.blockEditorsMap[op.sourceProperties.id],
      };
    }

    case 'set_slate': {
      const inverseOps = op.properties.slateOps.map(Operation.inverse).reverse();
      return {
        type: 'set_slate',
        source: 'history',
        properties: {
          slateOps: inverseOps,
          selectionBefore: op.properties.selectionBefore,
        },
        slate: op.slate,
        blockId: op.blockId,
      };
    }

    default:
      return op;
  }
}

export const SAVING = new WeakMap<YooEditor, boolean | undefined>();
export const MERGING = new WeakMap<YooEditor, boolean | undefined>();

export const YooptaHistory = {
  isMergingHistory(editor: YooEditor): boolean | undefined {
    return MERGING.get(editor);
  },

  isSavingHistory(editor: YooEditor): boolean | undefined {
    return SAVING.get(editor);
  },

  withMergingHistory(editor: YooEditor, fn: () => void): void {
    const prev = YooptaHistory.isMergingHistory(editor);
    MERGING.set(editor, true);
    fn();
    MERGING.set(editor, prev);
  },

  withoutMergingHistory(editor: YooEditor, fn: () => void): void {
    const prev = YooptaHistory.isMergingHistory(editor);
    MERGING.set(editor, false);
    fn();
    MERGING.set(editor, prev);
  },

  withoutSavingHistory(editor: YooEditor, fn: () => void): void {
    const prev = YooptaHistory.isSavingHistory(editor);
    SAVING.set(editor, false);
    fn();
    SAVING.set(editor, prev);
  },

  redo: (editor: YooEditor) => {
    const { redos } = editor.historyStack;

    if (redos.length > 0) {
      const batch = redos[redos.length - 1];

      YooptaHistory.withoutSavingHistory(editor, () => {
        editor.applyTransforms(batch.operations, { source: 'history' });
        editor.setPath(batch.path);
      });

      editor.historyStack.redos.pop();
      editor.historyStack.undos.push(batch);
    }
  },
  undo: (editor: YooEditor) => {
    const { undos } = editor.historyStack;

    if (undos.length > 0) {
      const batch = editor.historyStack.undos[editor.historyStack.undos.length - 1];

      YooptaHistory.withoutSavingHistory(editor, () => {
        // [TODO] - ask Christopher Nolan to help with this
        const inverseOps = batch.operations.flatMap((op) => inverseEditorOperation(editor, op)).reverse();
        editor.applyTransforms(inverseOps, { source: 'history' });
        editor.setPath(batch.path);
      });

      editor.historyStack.redos.push(batch);
      editor.historyStack.undos.pop();
    }
  },
};