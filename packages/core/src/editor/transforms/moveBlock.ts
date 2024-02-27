import { createDraft, finishDraft } from 'immer';
import { YooEditor, YooptaBlockPath } from '../types';

export function moveBlock(editor: YooEditor, draggedBlockId: string, newPath: YooptaBlockPath) {
  editor.children = createDraft(editor.children);

  const [newPosition] = newPath;
  const draggedBlock = editor.children[draggedBlockId!];
  const blockInNewPosition = Object.values(editor.children).find((item) => item.meta.order === newPosition)!;

  const dragFromTopToBottom = draggedBlock.meta.order < blockInNewPosition.meta.order;
  const dragFromBottomToTop = draggedBlock.meta.order > blockInNewPosition.meta.order;

  Object.values(editor.children).forEach((item) => {
    if (dragFromTopToBottom) {
      if (item.meta.order > draggedBlock.meta.order && item.meta.order <= blockInNewPosition.meta.order) {
        item.meta.order--;
      }
    } else if (dragFromBottomToTop) {
      if (item.meta.order < draggedBlock.meta.order && item.meta.order >= blockInNewPosition.meta.order) {
        item.meta.order++;
      }
    }
  });

  draggedBlock.meta.order = newPosition;

  editor.children = finishDraft(editor.children);
  editor.applyChanges();
}