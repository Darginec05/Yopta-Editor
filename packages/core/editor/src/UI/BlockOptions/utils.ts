import { YooEditor } from '../../editor/types';
import { getRootBlockElement } from '../../utils/blockElements';

type Params = {
  editor: YooEditor;
  onClose: () => void;
  empty?: boolean;
  withVoids?: boolean;
  view?: 'small' | 'default';
  mode?: 'toggle' | 'create';
};

export function buildActionMenuRenderProps({ editor, view, onClose, mode = 'toggle' }: Params) {
  function filterToggleActions(editor: YooEditor, type: string) {
    const block = editor.blocks[type];
    if (!block) return false;

    const rootBlock = getRootBlockElement(block.elements);
    if (rootBlock?.props?.nodeType === 'void') return false;
    return true;
  }

  const getActions = () => {
    let items = Object.keys(editor.blocks);

    if (mode === 'toggle') {
      items = items.filter((type) => filterToggleActions(editor, type));
    }

    return items.map((type) => {
      const title =
        editor.getLabelText(`plugins.${type}.display.title`) || editor.blocks[type].options?.display?.title || type;
      const description =
        editor.getLabelText(`plugins.${type}.display.description`) || editor.blocks[type].options?.display?.description;
      const icon = editor.blocks[type].options?.display?.icon;
      return { type: type, title, description, icon };
    });
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
      // [TEST]
      editor.toggleBlock(type, { deleteText: mode === 'toggle', focus: true });
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
