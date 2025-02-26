import { getRootBlockElement, YooEditor } from '@yoopta/editor';

type Params = {
  editor: YooEditor;
  onClose: () => void;
  empty?: boolean;
  view?: 'small' | 'default';
};

export function buildActionMenuRenderProps({ editor, view, onClose }: Params) {
  function filterToggleActions(editor: YooEditor, type: string) {
    const block = editor.blocks[type];
    if (!block) return false;

    const rootBlock = getRootBlockElement(block.elements);
    if (rootBlock?.props?.nodeType === 'void') return false;
    return true;
  }

  const getActions = () => {
    const items = Object.keys(editor.blocks)
      .filter((type) => filterToggleActions(editor, type))
      .map((type) => {
        const title =
          editor.getLabelText(`plugins.${type}.display.title`) || editor.blocks[type].options?.display?.title || type;
        const description =
          editor.getLabelText(`plugins.${type}.display.description`) ||
          editor.blocks[type].options?.display?.description;
        const icon = editor.blocks[type].options?.display?.icon;
        return { type: type, title, description, icon };
      });

    return items;
  };

  const getRootProps = () => ({
    'data-action-menu-list': true,
  });

  const getItemProps = (type) => ({
    onMouseEnter: () => undefined,
    'data-action-menu-item': true,
    'data-action-menu-item-type': type,
    'aria-selected': false,
    onClick: () => {
      editor.toggleBlock(type, { focus: true });
      onClose();
    },
  });

  return {
    actions: getActions(),
    onClose,
    empty: false,
    getItemProps,
    getRootProps,
    editor,
    view,
  };
}
