import { serializeTextNodes, serializeTextNodesIntoMarkdown, YooptaPlugin } from '@yoopta/editor';
import { ParagraphCommands } from '../commands';
import { ParagraphElementMap } from '../types';
import { ParagraphRender } from '../ui/Paragraph';

const Paragraph = new YooptaPlugin<ParagraphElementMap>({
  type: 'Paragraph',
  elements: {
    paragraph: {
      render: ParagraphRender,
    },
  },
  options: {
    display: {
      title: 'Text',
      description: 'Start writing plain text.',
    },
    shortcuts: ['p', 'text'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['P'],
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};
        return `<p data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}">${serializeTextNodes(element.children)}</p>`;
      },
    },
    markdown: {
      serialize: (element, text) => {
        return `${serializeTextNodesIntoMarkdown(element.children)}\n`;
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `<table style="width: 100%">
        <tbody>
          <tr>
            <td>
              <p data-meta-align="${align}" data-meta-depth="${depth}" style="font-size: 16px;
    line-height: 1.75rem;
    margin: .5rem 0 0; margin-left: ${depth * 20}px; text-align: ${align}">
                ${serializeTextNodes(element.children)}
              </p>
            </td>
          </tr>
        </tbody>
      </table>`;
      },
    },
  },
  commands: ParagraphCommands,
});

export { Paragraph };
