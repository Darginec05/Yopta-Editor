import { YooptaPlugin } from '@yoopta/editor';
import { Table as TableRender } from '../elements/Table';
import { TableDataCell } from '../elements/TableDataCell';
import { TableRow } from '../elements/TableRow';
import { TableElementMap } from '../types';
import { TableCommands } from '../commands';

import { withTable } from '../extenstions/withTable';
import { onKeyDown } from '../events/onKeyDown';
import { TABLE_SLATE_TO_SELECTION_SET } from '../utils/weakMaps';
import { deserializeTable } from '../parsers/html/deserialize';
import { serializeTable } from '../parsers/html/serialize';
import { serializeMarkown } from '../parsers/markdown/serialize';
import { serializeTableToEmail } from '../parsers/email/serialize';
import { defaultLocales } from '../locales';

const Table = new YooptaPlugin<TableElementMap>({
  type: 'Table',
  elements: {
    table: {
      render: TableRender,
      asRoot: true,
      children: ['table-row'],
      props: {
        headerRow: false,
        headerColumn: false,
      },
    },
    'table-row': {
      render: TableRow,
      children: ['table-data-cell'],
    },
    'table-data-cell': {
      render: TableDataCell,
      props: {
        asHeader: false,
        width: 200,
      },
    },
  },
  events: {
    onKeyDown,
    onBlur: (editor, slate) => () => {
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
    },
    onBeforeCreate(editor) {
      return TableCommands.buildTableElements(editor, { rows: 3, columns: 3 });
    },
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['TABLE'],
        parse: deserializeTable,
      },
      serialize: serializeTable,
    },
    markdown: {
      serialize: serializeMarkown,
    },
    email: {
      serialize: serializeTableToEmail,
    },
  },
  extensions: withTable,
  options: {
    display: {
      title: 'Table',
      description: 'Add simple table',
    },
    shortcuts: ['table', '||', '3x3'],
  },
  commands: TableCommands,
  translations: defaultLocales
});

export { Table };
