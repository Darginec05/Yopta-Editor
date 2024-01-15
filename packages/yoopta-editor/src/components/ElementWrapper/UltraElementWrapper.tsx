import { useYooptaEditor } from '../YooptaEditor/contexts/UltraYooptaContext/UltraYooptaContext';
import s from './UltraElementWrapper.module.scss';
import DragIcon from './icons/drag.svg';
import PlusIcon from './icons/plus.svg';
import cx from 'classnames';
import { PLUGIN_INDEX } from '../YooptaEditor/utils';
import { getDefaultUltraBlock } from '../YooptaEditor/defaultValue';

const UltraElementWrapper = ({ children, plugin, pluginId }) => {
  const editor = useYooptaEditor();

  const onPlusClick = () => {
    const pluginIndex = PLUGIN_INDEX.get(plugin);
    const defaultBlock = getDefaultUltraBlock();

    editor.insertBlock(defaultBlock, [pluginIndex + 1]);
    editor.focusBlock(defaultBlock.id);
  };

  const onMoveBlock = () => {
    const pluginIndex = PLUGIN_INDEX.get(plugin);
    editor.moveBlock([pluginIndex], [pluginIndex + 1]);
  };

  return (
    <div className={s.root} data-yoopta-plugin-id={pluginId} data-yoopta-plugin>
      <div contentEditable={false} className={cx(s.actions, { [s.hovered]: false }, 'yoopta-element-actions')}>
        <button
          type="button"
          onClick={onPlusClick}
          className={cx(s.actionButton, s.plusButton, 'yoopta-element-actions-plus')}
        >
          <PlusIcon />
        </button>
        <button type="button" onMouseDown={onMoveBlock} className={cx(s.actionButton, 'yoopta-element-actions-drag')}>
          <DragIcon />
        </button>
      </div>
      <div className={s.content}>{children}</div>
    </div>
  );
};

export { UltraElementWrapper };
