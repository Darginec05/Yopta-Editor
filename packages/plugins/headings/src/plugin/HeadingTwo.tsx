import {
  PluginElementRenderProps,
  serializeTextNodes,
  serializeTextNodesIntoMarkdown,
  YooptaPlugin,
} from '@yoopta/editor';
import { HeadingTwoCommands } from '../commands';
import { HeadingTwoElement } from '../types';
import {defaultHeadingTwoLocales} from '../locales';

const HeadingTwoRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { element, HTMLAttributes = {}, attributes, children } = props;
  const { className = '', ...htmlAttrs } = HTMLAttributes;

  if (extendRender) return extendRender(props);

  return (
    <h2 id={element.id} draggable={false} className={`yoopta-heading-two ${className}`} {...htmlAttrs} {...attributes}>
      {children}
    </h2>
  );
};

HeadingTwoRender.displayName = 'HeadingTwo';

const HeadingTwo = new YooptaPlugin<Record<'heading-two', HeadingTwoElement>>({
  type: 'HeadingTwo',
  elements: {
    'heading-two': {
      render: HeadingTwoRender,
      props: {
        nodeType: 'block',
      },
    },
  },
  commands: HeadingTwoCommands,
  options: {
    display: {
      title: 'Heading 2',
      description: 'Medium section heading',
    },
    shortcuts: ['h2', '##'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['H2'],
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0, align = 'left' } = blockMeta || {};

        return `<h2 data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}">${serializeTextNodes(element.children)}</h2>`;
      },
    },
    markdown: {
      serialize: (element, text) => {
        return `## ${serializeTextNodesIntoMarkdown(element.children)}\n`;
      },
    },
    email: {
      serialize: (element, content, blockMeta) => {
        const { depth = 0, align = 'left' } = blockMeta || {};

        let headingTwoHTML = `<h2 data-meta-align="${align}" data-meta-depth="${depth}" style="
                font-size: 1.875rem;
                font-weight: 600;
                line-height: 2.25rem;
                letter-spacing: -.025em;
                margin-bottom: .5rem;
                scroll-margin: 5rem;
                margin-top: 1rem;
                margin-left: ${depth * 20}px; text-align: ${align}">
                ${content}
              </h2>`;

        return `<table style="width:100%;">
        <tbody style="width:100%;">
          <tr>
            <td>
              ${headingTwoHTML}
            </td>
          </tr>
        </tbody>
      </table>`;
      },
    },
  },
  translations: defaultHeadingTwoLocales
});

export { HeadingTwo };
