import { generateId, YooptaPlugin } from '@yoopta/editor';
import { DividerCommands } from '../commands';
import { onKeyDown } from '../events/onKeyDown';
import { DividerElementMap } from '../types';
import { DividerRender } from '../elements/Divider';
import {defaultLocales} from '../locales';

const Divider = new YooptaPlugin<DividerElementMap>({
  type: 'Divider',
  elements: {
    divider: {
      render: DividerRender,
      props: {
        nodeType: 'void',
        theme: 'solid',
        color: '#EFEFEE',
      },
    },
  },
  options: {
    display: {
      title: 'Divider',
      description: 'Divide your blocks',
    },
    shortcuts: ['---', 'divider', 'line'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['HR'],
        parse: (el) => {
          const theme = el.getAttribute('data-meta-theme') || 'solid';
          const color = el.getAttribute('data-meta-color') || '#EFEFEE';

          return {
            id: generateId(),
            type: 'divider',
            props: {
              nodeType: 'void',
              theme,
              color,
            },
            children: [{ text: '' }],
          };
        },
      },
      serialize: (element, text, blockMeta) => {
        const { theme = 'solid', color = '#EFEFEE' } = element.props || {};
        return `<hr data-meta-theme="${theme}" data-meta-color="${color}" style="background-color: #8383e0; height: 1.2px" />`;
      },
    },
    markdown: {
      serialize: (element, text) => {
        return '---\n';
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { theme = 'solid', color = '#EFEFEE' } = element.props || {};
        let dividerHTML = `<hr data-meta-theme="${theme}" data-meta-color="${color}" style="border-color: ${color}; background-color: ${color}; height: 1.2px;" />`;
        if (theme === 'gradient') {
          dividerHTML = `<hr data-meta-theme="${theme}" data-meta-color="${color}" style="background: linear-gradient(to right, transparent, ${color}, transparent); height: 2px; width: 100%;" />`;
        }

        return `
        <table style="width: 100%;">
          <tbody style="width: 100%;">
            <tr>
              <td>${dividerHTML}</td>
            </tr>
          </tbody>
        </table>`;
      },
    },
  },
  commands: DividerCommands,
  events: {
    onKeyDown,
  },
  translations: defaultLocales,
});

export { Divider };
