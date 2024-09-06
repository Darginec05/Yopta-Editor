import { Blocks, Elements, findSlateBySelectionPath, generateId, SlateElement, YooEditor } from '@yoopta/editor';
import { BaseRange, Editor, Element, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableCellElement, TableColumn, TableElement, TableElementProps, TableRowElement } from '../types';

type Options = {
  path?: Range | Path;
  select?: boolean;
  insertMode?: 'before' | 'after';
};

type DeleteOptions = Omit<Options, 'insertMode'>;

type InsertTableOptions = {
  rows: number;
  columns: number;
  columnWidth?: number;
  headerColumn?: boolean;
  headerRow?: boolean;
};

type MoveTableOptions = {
  from: Path;
  to: Path;
};

export const TableTransforms = {
  insertTable: (editor: YooEditor, options: InsertTableOptions) => {
    const slate = findSlateBySelectionPath(editor);
    if (!slate) return;

    const { rows, columns, columnWidth, headerColumn, headerRow } = options;

    const table: TableElement = {
      id: generateId(),
      type: 'table',
      children: [],
      props: {
        headerColumn: headerColumn,
        headerRow: headerRow,
      },
    };

    for (let i = 0; i < rows; i++) {
      const row: TableRowElement = {
        id: generateId(),
        type: 'table-row',
        children: [],
      };

      for (let j = 0; j < columns; j++) {
        const cell: TableCellElement = {
          id: generateId(),
          type: 'table-data-cell',
          children: [{ text: '' }],
          props: {
            width: columnWidth || 200,
          },
        };

        row.children.push(cell);
      }

      table.children.push(row);
    }

    // Blocks.insertBlock(editor, table);

    // Insert the table as block
    return table;
  },
  insertTableRow: (editor: YooEditor, blockId: string, options?: Options) => {
    const slate = editor.blockEditorsMap[blockId];
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const { insertMode = 'after', path = slate.selection, select = true } = options || {};

      const currentRowElementEntryByPath = Elements.getElementEntry(editor, blockId, {
        path,
        type: 'table-row',
      });

      if (!currentRowElementEntryByPath) return;

      const [currentRowElement, currentRowPath] = currentRowElementEntryByPath;
      const insertPath = insertMode === 'before' ? currentRowPath : Path.next(currentRowPath);

      console.log('currentRowElement', currentRowElement);
      console.log('insertPath', insertPath);

      const newRow: SlateElement = {
        id: generateId(),
        type: 'table-row',
        children: currentRowElement.children.map((cell) => {
          return {
            id: generateId(),
            type: 'table-data-cell',
            children: [{ text: '' }],
          };
        }),
        props: {
          nodeType: 'block',
        },
      };

      Transforms.insertNodes(slate, newRow, { at: insertPath });
      if (select) {
        Transforms.select(slate, [...insertPath, 0]);
      }
    });
  },
  deleteTableRow: (editor: YooEditor, blockId: string, options?: DeleteOptions) => {
    const slate = editor.blockEditorsMap[blockId];
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const { path = slate.selection, select = true } = options || {};

      const currentRowElementEntryByPath = Elements.getElementEntry(editor, blockId, {
        path,
        type: 'table-row',
      });

      if (!currentRowElementEntryByPath) return;

      const [_, currentRowPath] = currentRowElementEntryByPath;

      const tableRowEntries = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'highest',
      });

      const tableRows = Array.from(tableRowEntries);
      if (tableRows.length === 1) return;

      Transforms.removeNodes(slate, {
        at: currentRowPath,
        match: (n) => Element.isElement(n) && n.type === 'table-row',
      });
    });
  },
  moveTableRow: (editor: YooEditor, blockId: string, { from, to }: MoveTableOptions) => {
    const slate = editor.blockEditorsMap[blockId];
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      Transforms.moveNodes(slate, {
        at: from,
        to: to,
        match: (n) => Element.isElement(n) && n.type === 'table-row',
      });
    });
  },
  moveTableColumn: (editor: YooEditor, blockId: string, { from, to }: MoveTableOptions) => {
    const slate = editor.blockEditorsMap[blockId];
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const tableRowEntries = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'all',
      });

      Array.from(tableRowEntries).forEach(([tableRowElement, tableRowPath]) => {
        Transforms.moveNodes(slate, {
          at: tableRowPath.concat(from[from.length - 1]),
          to: [...tableRowPath, to[to.length - 1]],
          match: (n) => Element.isElement(n),
        });
      });
    });
  },
  insertTableColumn: (editor: YooEditor, blockId: string, options?: Options) => {
    const slate = editor.blockEditorsMap[blockId];
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const { insertMode = 'after', path = slate.selection, select = true } = options || {};

      const dataCellElementEntryByPath = Elements.getElementEntry(editor, blockId, {
        path,
        type: 'table-data-cell',
      });

      if (!dataCellElementEntryByPath) return;

      const [_, dataCellPath] = dataCellElementEntryByPath;
      const columnIndex = dataCellPath[dataCellPath.length - 1];
      const columnInsertIndex =
        insertMode === 'before' ? columnIndex : Path.next(dataCellPath)[dataCellPath.length - 1];

      const elementEntries = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'lowest',
      });

      for (const [, tableRowPath] of elementEntries) {
        const newDataCell: TableCellElement = {
          id: generateId(),
          type: 'table-data-cell',
          children: [{ text: '' }],
        };

        Transforms.insertNodes(slate, newDataCell, { at: [...tableRowPath, columnInsertIndex] });
      }

      if (options?.select) {
        Transforms.select(slate, [0, 0, columnInsertIndex, 0]);
      }
    });
  },
  deleteTableColumn: (editor: YooEditor, blockId: string, options?: DeleteOptions) => {
    const slate = editor.blockEditorsMap[blockId];
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const { path = slate.selection, select = true } = options || {};

      const tableRowEntries = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'all',
      });

      const rows = Array.from(tableRowEntries);
      if (rows[0][0].children.length <= 1) return;

      const dataCellElementEntryByPath = Elements.getElementEntry(editor, blockId, {
        path,
        type: 'table-data-cell',
      });

      if (!dataCellElementEntryByPath) return;

      const [_, dataCellPath] = dataCellElementEntryByPath;
      const columnIndex = dataCellPath[dataCellPath.length - 1];

      const dataCellPaths = rows.map(([row, path]) => {
        return row.children[columnIndex] ? [...path, columnIndex] : null;
      });

      // [TODO] - Check if there are other columns
      dataCellPaths.forEach((path) => {
        if (path) {
          Transforms.removeNodes(slate, { at: path });
        }
      });
    });
  },
  updateColumnWidth: (editor: YooEditor, blockId: string, columnIndex: number, width: number) => {
    const slate = editor.blockEditorsMap[blockId];
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const tableDataCellsPerColumn = Editor.nodes<TableCellElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
        mode: 'all',
      });

      Array.from(tableDataCellsPerColumn).forEach(([cell, path]) => {
        if (path[path.length - 1] === columnIndex) {
          Transforms.setNodes(
            slate,
            { props: { ...cell.props, width } },
            {
              at: path,
              match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
            },
          );
        }
      });
    });
  },
  toggleHeaderRow: (editor: YooEditor, blockId: string) => {
    const slate = editor.blockEditorsMap[blockId];
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const firstTableRowChildren = Editor.nodes<SlateElement>(slate, {
        at: [0, 0],
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
        mode: 'all',
      });

      Array.from(firstTableRowChildren).forEach(([cell, path]) => {
        Transforms.setNodes(
          slate,
          { props: { ...cell.props, asHeader: !cell.props.asHeader } },
          {
            at: path,
            match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
          },
        );
      });
    });
  },
  toggleHeaderColumn: (editor: YooEditor, blockId: string) => {
    const slate = editor.blockEditorsMap[blockId];
    if (!slate) return;

    Editor.withoutNormalizing(slate, () => {
      const tableRows = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && n.type === 'table-row',
        mode: 'all',
      });

      Array.from(tableRows).forEach(([row, path]) => {
        const cell = row.children[0] as TableCellElement;
        const isFirstCell = path[path.length - 1] === 0;

        Transforms.setNodes(
          slate,
          { props: { ...cell.props, asHeader: !cell.props?.asHeader } },
          {
            at: path.concat(0),
            match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
          },
        );
      });
    });
  },
};
