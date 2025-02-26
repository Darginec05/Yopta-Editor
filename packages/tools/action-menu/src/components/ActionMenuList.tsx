import {useEffect, useMemo, useState} from 'react';
import { DefaultActionMenuRender } from './DefaultActionMenuRender';
import { useFloating, offset, flip, shift, autoUpdate, useTransitionStyles } from '@floating-ui/react';
import { Editor, Element, NodeEntry, Path, Transforms } from 'slate';
import {
  YooptaBlockData,
  YooptaBlock,
  useYooptaEditor,
  HOTKEYS,
  findPluginBlockByPath,
  UI,
  SlateElement,
  Blocks,
} from '@yoopta/editor';
import { ActionMenuRenderProps, ActionMenuToolItem, ActionMenuToolProps } from '../types';
import { buildActionMenuRenderProps, mapActionMenuItems } from './utils';

const { Portal } = UI;

const filterBy = (item: YooptaBlockData | YooptaBlock['options'], text: string, field: string): boolean => {
  if (!item || typeof item[field] === 'undefined') return false;

  const value = item[field];
  const searchText = text.toLowerCase().trim();

  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((v) => String(v).toLowerCase())
      .some((v) => v.includes(searchText));
  }

  return String(value).toLowerCase().includes(searchText);
};

const filterActionMenuItems = (block: YooptaBlock, searchText: string): boolean => {
  if (!searchText.trim()) return true;
  if (!block) return false;

  const searchTerms = searchText.toLowerCase().split(/\s+/);

  return searchTerms.every((term) => {
    const typeMatch = filterBy(block, term, 'type');
    if (typeMatch) return true;

    const titleMatch = block.options?.display && filterBy(block.options.display, term, 'title');
    if (titleMatch) return true;

    const shortcutMatch = block.options && filterBy(block.options, term, 'shortcuts');
    if (shortcutMatch) return true;

    const descriptionMatch = block.options?.display && filterBy(block.options.display, term, 'description');
    if (descriptionMatch) return true;

    const aliasMatch = block.options?.aliases && filterBy(block.options, term, 'aliases');
    if (aliasMatch) return true;

    return false;
  });
};

function isSlashPressed(event: KeyboardEvent): boolean {
  return (
    event.key === '/' ||
    event.keyCode === 191 ||
    event.which === 191 ||
    // [TODO] - event.code Slash works for both '/' and '?' keys
    event.code === 'Slash' ||
    event.key === '/' ||
    (event.key === '.' && event.shiftKey)
  );
}

// [TODO] - add to props
const TRIGGER = '/';

const ActionMenuList = ({ items, render }: ActionMenuToolProps) => {
  const editor = useYooptaEditor();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const {
    refs,
    floatingStyles,
    update: updateActionMenuPosition,
    context,
  } = useFloating({
    placement: 'bottom-start',
    open: isMenuOpen,
    onOpenChange: setIsMenuOpen,
    middleware: [flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 100,
  });

  const blockTypes = useMemo(() => mapActionMenuItems(editor, items || Object.keys(editor.blocks)), [editor, items]);

  const [selectedAction, setSelectedAction] = useState<ActionMenuToolItem>(blockTypes[0]);
  const [actions, setActions] = useState<ActionMenuToolItem[]>(blockTypes);

  useEffect(() => {
    setActions(blockTypes);
    setSelectedAction(blockTypes[0]);
  }, [blockTypes]);

  const onOpen = () => setIsMenuOpen(true);
  const onClose = () => setIsMenuOpen(false);

  const onFilter = ({ text }) => {
    const searchText = text.trim().replace(TRIGGER, '');

    if (!searchText) {
      setActions(blockTypes);
      return;
    }

    const filteredActions = blockTypes.filter((action) =>
      filterActionMenuItems(editor.blocks[action.type], searchText),
    );

    if (filteredActions.length > 0) {
      const currentExists = filteredActions.some((item) => item.type === selectedAction?.type);

      if (!currentExists) {
        setSelectedAction(filteredActions[0]);
      }
    }

    setActions(filteredActions);
  };

  useEffect(() => {
    updateActionMenuPosition();

    const handleActionMenuKeyUp = (event: KeyboardEvent) => {
      const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
      const isInsideEditor = editor.refElement?.contains(event.target as Node);

      if (!slate || !slate.selection || !isInsideEditor) return;

      const parentPath = Path.parent(slate.selection.anchor.path);
      const string = Editor.string(slate, parentPath);

      if (string.length === 0 || !isMenuOpen) return onClose();
      onFilter({ text: string });
    };

    const handleActionMenuKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;

      const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
      const slateEditorRef = event.currentTarget as HTMLElement;

      const isInsideEditor = slateEditorRef?.contains(event.target as Node);

      const pluginWithCustomEditor = document.querySelector('[data-custom-editor]');
      const isInsideCustomEditor = pluginWithCustomEditor?.contains(event.target as Node);

      if (isInsideCustomEditor || !slate || !slate.selection || !isInsideEditor) return;

      const isSlashKey = isSlashPressed(event);

      if (isSlashKey || HOTKEYS.isSlashCommand(event)) {
        const isInTypingMode = slate.selection && !Editor.isEditor(slate.selection.anchor.path[0]);
        if (!isInTypingMode) return;

        const parentPath = Path.parent(slate.selection.anchor.path);
        const string = Editor.string(slate, parentPath);
        const isStart = Editor.isStart(slate, slate.selection.anchor, slate.selection.focus);

        if (!isStart || string.trim().length > 0) return;

        const domSelection = window.getSelection();
        if (!domSelection) return;

        const domRange = domSelection.getRangeAt(0);
        const selectionRect = domRange.getBoundingClientRect();

        if (domRange) {
          refs.setReference({
            getBoundingClientRect: () => selectionRect,
            getClientRects: () => domRange.getClientRects(),
          });

          onOpen();
        }
      }

      if (!isMenuOpen) return;

      if (HOTKEYS.isTab(event)) {
        event.preventDefault();
        return;
      }

      if (HOTKEYS.isArrowUp(event)) {
        event.preventDefault();
        const currentSelected = selectedAction || actions[0];
        if (!currentSelected) return;

        const menuList = document.querySelector('[data-action-menu-list]');
        const menuListItems = menuList?.querySelectorAll('[data-action-menu-item]');
        if (!menuListItems) return;

        const currentListItem = menuList?.querySelector(`[aria-selected="true"]`) as HTMLElement;
        const currentIndex = Array.from(menuListItems || []).indexOf(currentListItem);

        const prevIndex = currentIndex - 1;
        const prevEl = menuListItems[prevIndex];

        if (!prevEl) {
          const lastEl = menuListItems[menuListItems.length - 1];
          const lastActionType = lastEl.getAttribute('data-action-menu-item-type');
          lastEl.scrollIntoView({ block: 'nearest' });

          const lastAction = actions.find((item) => item.type === lastActionType)!;
          return setSelectedAction(lastAction);
        }

        prevEl.scrollIntoView({ block: 'nearest' });
        const prevActionType = prevEl.getAttribute('data-action-menu-item-type');

        const lastAction = actions.find((item) => item.type === prevActionType)!;
        return setSelectedAction(lastAction);
      }

      if (HOTKEYS.isArrowDown(event)) {
        event.preventDefault();
        const currentSelected = selectedAction || actions[0];
        if (!currentSelected) return;

        const menuList = document.querySelector('[data-action-menu-list]');
        const menuListItems = menuList?.querySelectorAll('[data-action-menu-item]');
        if (!menuListItems) return;

        const currentListItem = menuList?.querySelector(`[aria-selected="true"]`) as HTMLElement;
        const currentIndex = Array.from(menuListItems || []).indexOf(currentListItem);

        const nextIndex = currentIndex + 1;
        const nextEl = menuListItems[nextIndex];

        if (!nextEl) {
          const firstEl = menuListItems[0];
          const firstActionType = firstEl.getAttribute('data-action-menu-item-type');
          firstEl.scrollIntoView({ block: 'nearest' });
          const firstAction = actions.find((item) => item.type === firstActionType)!;

          return setSelectedAction(firstAction);
        }

        nextEl.scrollIntoView({ block: 'nearest' });
        const nextActionType = nextEl.getAttribute('data-action-menu-item-type');

        const nextAction = actions.find((item) => item.type === nextActionType)!;
        return setSelectedAction(nextAction);
      }

      if (HOTKEYS.isArrowLeft(event)) {
        event.preventDefault();
        return;
      }

      if (HOTKEYS.isArrowRight(event)) {
        event.preventDefault();
        return;
      }

      if (HOTKEYS.isBackspace(event)) {
        if (!slate.selection) return;
        const isStart = Editor.isStart(slate, slate.selection.anchor, slate.selection.focus);
        if (isStart) return onClose();
      }

      if (HOTKEYS.isEscape(event)) {
        event.preventDefault();
        onClose();
        return;
      }

      if (HOTKEYS.isEnter(event)) {
        event.preventDefault();

        const selected = document.querySelector('[data-action-menu-item][aria-selected=true]') as HTMLElement;
        const type = selected?.dataset.actionMenuItemType;
        if (!type) return;

        const blockEntry: NodeEntry<SlateElement<string>> | undefined = Editor.above(slate, {
          match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
          mode: 'lowest',
        });

        if (blockEntry) {
          const [, currentNodePath] = blockEntry;
          const path = blockEntry ? currentNodePath : [];

          const start = Editor.start(slate, path);
          const range = { anchor: slate.selection.anchor, focus: start };

          Transforms.select(slate, range);
          Transforms.delete(slate);
        }

        editor.toggleBlock(type, { deleteText: true, focus: true });
        return onClose();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', onClose);
    }

    if (typeof editor.path.current === 'number') {
      const block = findPluginBlockByPath(editor, { at: editor.path.current });
      if (!block) return;

      const slateEditorRef = editor.refElement?.querySelector(
        `[data-yoopta-block-id="${block.id}"] [data-slate-editor="true"]`,
      ) as HTMLElement;

      if (!slateEditorRef) return;

      slateEditorRef.addEventListener('keydown', handleActionMenuKeyDown);
      slateEditorRef.addEventListener('keyup', handleActionMenuKeyUp);
      return () => {
        slateEditorRef.removeEventListener('keydown', handleActionMenuKeyDown);
        slateEditorRef.removeEventListener('keyup', handleActionMenuKeyUp);
        document.removeEventListener('click', onClose);
      };
    }
  }, [actions, isMenuOpen, editor.path]);

  const empty = actions.length === 0;

  const onMouseEnter = (e: React.MouseEvent) => {
    const type = e.currentTarget.getAttribute('data-action-menu-item-type')!;
    const action = blockTypes.find((item) => item.type === type)!;
    setSelectedAction(action);
  };

  const renderProps: ActionMenuRenderProps = buildActionMenuRenderProps({
    empty,
    editor,
    onClose,
    onMouseEnter,
    selectedAction,
    view: 'default',
    mode: 'toggle',
  });

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (empty) onClose();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [actions.length, isMenuOpen]);

  const style = { ...floatingStyles, ...transitionStyles };

  const menuContent = render ? render({ ...renderProps, actions }) : <DefaultActionMenuRender {...renderProps} actions={actions} />;


  // [TODO] - take care about SSR
  return (
      <Portal id="yoo-action-menu-list-portal">
        {isMounted && (
            <div className="yoopta-action-menu-list" style={style} ref={refs.setFloating}>
              {menuContent}
            </div>
        )}
      </Portal>
  );
};

export { ActionMenuList };
