import { isKeyHotkey } from 'is-hotkey';
import { Editor, Path, Range, select, Text, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { getDefaultParagraphBlock } from '../components/Editor/defaultValue';
import { YooEditor } from '../editor/types';
import { findPluginBlockBySelectionPath } from '../utils/findPluginBlockBySelectionPath';
import { findSlateBySelectionPath } from '../utils/findSlateBySelectionPath';
import { generateId } from '../utils/generateId';
import { getMaxOffsetInElement } from '../utils/getMaxOffsetInElement';
import { HOTKEYS } from '../utils/hotkeys';

export function onKeyDown(editor: YooEditor, slate: Editor) {
  return (event: React.KeyboardEvent) => {
    if (!slate.selection) return;

    if (HOTKEYS.isShiftEnter(event)) {
      if (event.isDefaultPrevented()) return;

      event.preventDefault();
      slate.insertText('\n');

      return;
    }

    if (HOTKEYS.isEnter(event)) {
      if (event.isDefaultPrevented()) return;
      event.preventDefault();

      const parentPath = Path.parent(slate.selection.anchor.path);
      const isStart = Editor.isStart(slate, slate.selection.anchor, parentPath);
      const isEnd = Editor.isEnd(slate, slate.selection.anchor, parentPath);

      if (!isStart && !isEnd) {
        editor.splitBlock({ slate, focus: true });
        return;
      }

      const defaultBlock = getDefaultParagraphBlock(generateId());
      const nextPath = editor.selection ? [editor.selection[0] + 1] : [0];
      editor.insertBlock(defaultBlock, { at: nextPath, slate, focus: true });
      return;
    }

    if (HOTKEYS.isBackspace(event)) {
      if (event.isDefaultPrevented()) return;

      const parentPath = Path.parent(slate.selection.anchor.path);
      const isStart = Editor.isStart(slate, slate.selection.anchor, slate.selection.anchor.path);

      // When the cursor is at the start of the block, delete the block
      if (isStart) {
        event.preventDefault();
        const text = Editor.string(slate, parentPath);

        // If current block is empty just delete block
        if (text.length === 0) {
          return editor.deleteBlock({ at: editor.selection, focus: true });
        }
        // If current block is not empty merge text nodes with previous block
        else {
          if (Range.isExpanded(slate.selection)) {
            return Transforms.delete(slate, { at: slate.selection });
          }

          const prevBlockPathIndex = editor.selection ? editor.selection[0] - 1 : 0;
          const prevSlate = findSlateBySelectionPath(editor, { at: [prevBlockPathIndex] });

          // If we try to delete first block do nothing
          if (!prevSlate) return;

          const prevSlateText = Editor.string(prevSlate, [0, 0]);

          // If previous block values is empty just delete block without merging
          if (prevSlateText.length === 0) {
            return editor.deleteBlock({ at: [prevBlockPathIndex], focus: true });
          }

          const childNodeEntries = Array.from(
            Editor.nodes(slate, {
              at: [0],
              match: (n) => !Editor.isEditor(n) && (Text.isText(n) || Editor.isInline(slate, n)),
              mode: 'highest',
            }),
          );

          const childNodes = childNodeEntries.map(([node]) => node);
          Transforms.insertNodes(prevSlate, childNodes, { at: Editor.end(prevSlate, []) });
          return editor.deleteBlock({
            at: editor.selection,
            focus: true,
            focusAt: 'start',
          });
        }
      }
      return;
    }

    if (HOTKEYS.isSelect(event)) {
      if (event.isDefaultPrevented()) return;

      const [, firstElementPath] = Editor.first(slate, [0]);
      const [, lastElementPath] = Editor.last(slate, [slate.children.length - 1]);

      const fullRange = Editor.range(slate, firstElementPath, lastElementPath);
      const isAllBlockElementsSelected = Range.equals(slate.selection, fullRange);

      // [TODO] - handle cases for void node elements and when string is empty
      if (Range.isExpanded(slate.selection) && isAllBlockElementsSelected) {
        event.preventDefault();

        ReactEditor.blur(slate);
        ReactEditor.deselect(slate);
        Transforms.deselect(slate);

        editor.setBlockSelected([], { allSelected: true });
        return;
      }
    }

    if (HOTKEYS.isShiftTab(event)) {
      if (event.isDefaultPrevented()) return;
      event.preventDefault();

      editor.decreaseBlockDepth();
      return;
    }

    if (HOTKEYS.isTab(event)) {
      if (event.isDefaultPrevented()) return;
      event.preventDefault();

      editor.increaseBlockDepth();
      return;
    }

    if (HOTKEYS.isArrowUp(event)) {
      const textNodes = Editor.nodes(slate, {
        at: [0],
        match: (n) => !Editor.isEditor(n) && Text.isText(n),
        mode: 'highest',
      });

      console.log('textNodes', Array.from(textNodes));
      console.log('selection', slate.selection);
      console.log('collapsed', Range.isCollapsed(slate.selection));

      if (event.isDefaultPrevented()) return;
      // [TODO] - handle cases for inline node elements
      const parentPath = Path.parent(slate.selection.anchor.path);

      const prevPath = editor.selection ? [editor.selection[0] - 1] : [0];
      const prevBlock = findPluginBlockBySelectionPath(editor, { at: prevPath });
      const isStart = Editor.isStart(slate, slate.selection.anchor, parentPath);

      if (isStart && prevBlock) {
        event.preventDefault();
        editor.focusBlock(prevBlock.id, { focusAt: 3, waitExecution: false });
      }
    }

    // [TODO] - handle sharing cursor between blocks
    if (HOTKEYS.isArrowDown(event)) {
      if (event.isDefaultPrevented()) return;
    }

    if (Range.isExpanded(slate.selection)) {
      for (const mark of Object.values(editor.formats)) {
        if (mark.hotkey && isKeyHotkey(mark.hotkey)(event)) {
          event.preventDefault();
          editor.formats[mark.type].toggle();
          break;
        }
      }
    }
  };
}