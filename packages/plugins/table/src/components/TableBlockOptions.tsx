import { UI, YooEditor, YooptaBlockData } from '@yoopta/editor';
import { Sheet, TableProperties, CheckIcon } from 'lucide-react';
import { TableCommands } from '../commands';
import { TableElement } from '../types';

const { ExtendedBlockActions, BlockOptionsMenuGroup, BlockOptionsMenuItem, BlockOptionsSeparator } = UI;

type Props = {
  editor: YooEditor;
  block: YooptaBlockData;
  table: TableElement;
};

const TableBlockOptions = ({ editor, block, table }: Props) => {
  const tableProps = table.props;

  const isHeaderRowEnabled = tableProps?.headerRow;
  const isHeaderColumnEnabled = tableProps?.headerColumn;

  const onSwitchHeaderRow = () => {
    TableCommands.toggleHeaderRow(editor, block.id);
  };

  const onSwitchHeaderColumn = () => {
    TableCommands.toggleHeaderColumn(editor, block.id);
  };

  return (
    <ExtendedBlockActions
      onClick={() => editor.setPath({ current: block.meta.order })}
      className="yoopta-table-options"
    >
      <BlockOptionsSeparator />
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-table-justify-between"
            onClick={onSwitchHeaderRow}
          >
            <span className="yoo-table-flex">
              <Sheet width={16} height={16} className="yoo-table-w-4 yoo-table-h-4 yoo-table-mr-2" />
              {/* Header row */}
              {editor.getLabelText('plugins.Table.options.toggleHeaderRow') || 'Header row'}
            </span>
            {isHeaderRowEnabled && <CheckIcon width={16} height={16} className="yoo-table-w-4 yoo-table-h-4" />}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-table-justify-between"
            onClick={onSwitchHeaderColumn}
          >
            <span className="yoo-table-flex">
              <TableProperties
                width={16}
                height={16}
                className="yoo-table-w-4 yoo-table-h-4 yoo-table-mr-2 yoo-table-rotate-180"
              />
              {/* Header column */}
              {editor.getLabelText('plugins.Table.options.toggleHeaderColumn') || 'Header column'}
            </span>
            {isHeaderColumnEnabled && <CheckIcon width={16} height={16} className="yoo-table-w-4 yoo-table-h-4" />}
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </ExtendedBlockActions>
  );
};

export { TableBlockOptions };
