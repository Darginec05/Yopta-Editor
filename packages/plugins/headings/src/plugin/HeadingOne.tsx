import {
  YooptaPlugin,
  PluginElementRenderProps,
  serializeTextNodesIntoMarkdown,
  serializeTextNodes,
} from '@yoopta/editor';
import { HeadingOneCommands } from '../commands';
import { HeadingOneElement } from '../types';
import {defaultHeadingOneLocales} from '../locales';

const HeadingOneRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { element, HTMLAttributes = {}, attributes, children } = props;
  const { className = '', ...htmlAttrs } = HTMLAttributes;

  if (extendRender) return extendRender(props);

  return (
    <h1 id={element.id} draggable={false} className={`yoopta-heading-one ${className}`} {...htmlAttrs} {...attributes}>
      {children}
    </h1>
  );
};

HeadingOneRender.displayName = 'HeadingOne';

const HeadingOne = new YooptaPlugin<Record<'heading-one', HeadingOneElement>>({
  type: 'HeadingOne',
  elements: {
    'heading-one': {
      render: HeadingOneRender,
      props: {
        nodeType: 'block',
      },
    },
  },
  commands: HeadingOneCommands,
  options: {
    display: {
      title: 'Heading 1',
      description: 'Big section heading',
    },
    shortcuts: ['h1', '#', '*'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['H1'],
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0, align = 'left' } = blockMeta || {};

        return `<h1 data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}">${serializeTextNodes(element.children)}</h1>`;
      },
    },
    markdown: {
      serialize: (element, text) => {
        return `# ${serializeTextNodesIntoMarkdown(element.children)}\n`;
      },
    },
    email: {
      serialize: (element, content, blockMeta) => {
        const { depth = 0, align = 'left' } = blockMeta || {};

        let headingOneHTML = `<h1 data-meta-align="${align}" data-meta-depth="${depth}" style="
                margin-bottom: .5rem;
                scroll-margin: 5rem; font-size: 2.25rem;
                font-weight: 700;
                line-height: 2.5rem;
                margin-top: 1.5rem; margin-left: ${depth * 20}px; text-align: ${align}">
                ${content}
              </h1>`;

        return `<table style="width:100%;">
        <tbody style="width:100%;">
          <tr>
            <td>
              ${headingOneHTML}
            </td>
          </tr>
        </tbody>
      </table>`;
      },
    },
  },
  translations: defaultHeadingOneLocales,
});

export { HeadingOne };
