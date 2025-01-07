import {
  deserializeTextNodes,
  generateId,
  serializeTextNodes,
  serializeTextNodesIntoMarkdown,
  YooptaPlugin,
} from '@yoopta/editor';
import { CSSProperties } from 'react';
import { CalloutCommands } from '../commands';
import { CalloutElementMap, CalloutTheme } from '../types';
import { CalloutRender } from '../ui/Callout';
import { CALLOUT_THEME_STYLES } from '../utils';
import {defaultLocales} from '../locales';

const Callout = new YooptaPlugin<CalloutElementMap>({
  type: 'Callout',
  elements: {
    callout: {
      render: CalloutRender,
      props: {
        theme: 'default',
      },
    },
  },
  commands: CalloutCommands,
  options: {
    display: {
      title: 'Callout',
      description: 'Make writing stand out',
    },
    shortcuts: ['<'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['DL'],
        parse(el, editor) {
          if (el.nodeName === 'DL' || el.nodeName === 'DIV') {
            const theme = el.getAttribute('data-theme') as CalloutTheme;

            return {
              id: generateId(),
              type: 'callout',
              children: deserializeTextNodes(editor, el.childNodes),
              props: {
                theme,
              },
            };
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const theme: CSSProperties = CALLOUT_THEME_STYLES[element.props?.theme || 'default'];
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `<dl data-theme="${
          element.props?.theme || 'default'
        }" data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}; padding: .5rem .5rem .5rem 1rem; margin-top: .5rem; border-radius: .375rem; color: ${
          theme.color
        }; border-left: ${theme.borderLeft || 0}; background-color: ${theme.backgroundColor}">${serializeTextNodes(
          element.children,
        )}</dl>`;
      },
    },
    markdown: {
      serialize: (element, text) => {
        return `> ${serializeTextNodesIntoMarkdown(element.children)}`;
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const theme: CSSProperties = CALLOUT_THEME_STYLES[element.props?.theme || 'default'];
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `
        <table style="width: 100%; ">
          <tbody style="width: 100%;">
            <tr>
                <td data-theme="${
                  element.props?.theme || 'default'
                }" data-meta-align="${align}" data-meta-depth="${depth}" style="
    font-size: 16px;
    line-height: 1.75rem;
    margin-left: ${
      depth * 20
    }px; text-align: ${align}; padding: .5rem .5rem .5rem 1rem; margin-top: .5rem; border-radius: .375rem; color: ${
          theme.color
        }; border-left: ${theme.borderLeft || 0}; background-color: ${theme.backgroundColor};">${serializeTextNodes(
          element.children,
        )}
              </td>
            </tr>
        </tbody>
      </table>`;
      },
    },
  },
  translations: defaultLocales,
});

export { Callout };
