import {
  generateId,
  serializeTextNodes,
  serializeTextNodesIntoMarkdown,
  YooptaBlockData,
  YooptaPlugin,
} from '@yoopta/editor';
import { BulletedListCommands } from '../commands';
import { BulletedListRender } from '../elements/BulletedList';
import { onKeyDown } from '../events/onKeyDown';
import { ListElementMap } from '../types';
import { deserializeListNodes } from '../utils/deserializeListNodes';
import {defaultBulletedListLocales} from '../locales';

const BulletedList = new YooptaPlugin<Pick<ListElementMap, 'bulleted-list'>>({
  type: 'BulletedList',
  elements: {
    'bulleted-list': {
      render: BulletedListRender,
    },
  },
  options: {
    display: {
      title: 'Bulleted List',
      description: 'Create bullet list',
    },
    shortcuts: ['-'],
  },
  events: {
    onKeyDown,
  },
  commands: BulletedListCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['UL'],
        parse(el, editor) {
          if (el.nodeName === 'UL') {
            const align = (el.getAttribute('data-meta-align') || 'left') as YooptaBlockData['meta']['align'];
            const depth = parseInt(el.getAttribute('data-meta-depth') || '0', 10);

            // [TODO] - Fix losing marks when deserializing
            const deserializedList = deserializeListNodes(editor, el, { type: 'BulletedList', depth, align });
            if (deserializedList.length > 0) {
              return deserializedList;
            }
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `<ul data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}"><li>${serializeTextNodes(element.children)}</li></ul>`;
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
                  <ul data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}; 
        font-size: 16px;
        line-height: 1.75rem;
        padding-bottom: 2px;
        padding-left: 1rem;
        padding-top: 2px;
        margin: 0;
        "><li style="margin: 0">${serializeTextNodes(element.children)}</li></ul>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      },
    },
  },
  translations: defaultBulletedListLocales
});

export { BulletedList };
