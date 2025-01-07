import { YooptaPlugin, YooptaBlockData, serializeTextNodes, serializeTextNodesIntoMarkdown } from '@yoopta/editor';
import { NumberedListCommands } from '../commands';
import { NumberedListRender } from '../elements/NumberedList';
import { onKeyDown } from '../events/onKeyDown';
import { ListElementMap } from '../types';
import { deserializeListNodes } from '../utils/deserializeListNodes';
import { defaultNumberedListLocales } from '../locales';

const NumberedList = new YooptaPlugin<Pick<ListElementMap, 'numbered-list'>>({
  type: 'NumberedList',
  elements: {
    'numbered-list': {
      render: NumberedListRender,
      props: {
        nodeType: 'block',
      },
    },
  },
  options: {
    display: {
      title: 'Numbered List',
      description: 'Create list with numbering',
    },
    shortcuts: ['1.'],
  },
  events: {
    onKeyDown,
  },
  commands: NumberedListCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['OL'],
        parse(el, editor) {
          if (el.nodeName === 'OL') {
            const align = (el.getAttribute('data-meta-align') || 'left') as YooptaBlockData['meta']['align'];
            const depth = parseInt(el.getAttribute('data-meta-depth') || '0', 10);

            const deserializedList = deserializeListNodes(editor, el, { type: 'NumberedList', depth, align });
            if (deserializedList.length > 0) {
              return deserializedList;
            }
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `<ol data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}"><li>${serializeTextNodes(element.children)}</li></ol>`;
      },
    },
    markdown: {
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};
        const indent = '  '.repeat(depth);
        return `${indent}- ${serializeTextNodesIntoMarkdown(element.children)}`;
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td>
                  <ol data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${depth}px; text-align: ${align};     font-size: 16px;
    line-height: 28px;
    padding-bottom: 2px;
    padding-left: 1rem;
    padding-top: 2px;
    margin: 0;
    "><li>${serializeTextNodes(element.children)}</li></ol>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      },
    },
  },
  translations: defaultNumberedListLocales
});

export { NumberedList };
