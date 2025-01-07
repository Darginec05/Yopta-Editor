import { deserializeTextNodes, generateId, serializeTextNodes, YooptaPlugin } from '@yoopta/editor';
import { LinkCommands } from '../commands';
import { LinkElementMap, LinkElementProps } from '../types';
import { LinkRender } from '../ui/LinkRender';
import {defaultLocales} from '../locales';

const Link = new YooptaPlugin<LinkElementMap>({
  type: 'LinkPlugin',
  elements: {
    link: {
      render: LinkRender,
      props: {
        url: null,
        target: '_self',
        rel: 'noopener noreferrer',
        nodeType: 'inline',
        title: null,
      },
    },
  },
  options: {
    display: {
      title: 'Link',
      description: 'Create link',
    },
  },
  commands: LinkCommands,
  parsers: {
    html: {
      serialize: (element, text) => {
        const { url, target, rel, title } = element.props;
        return `<a href="${url}" target="${target}" rel="${rel}">${serializeTextNodes(element.children)}</a>`;
      },
      deserialize: {
        nodeNames: ['A'],
        parse: (el, editor) => {
          if (el.nodeName === 'A') {
            const href = el.getAttribute('href') || '';

            const defaultLinkProps = editor.plugins.LinkPlugin.elements.link.props as LinkElementProps;

            // [TODO] Add target
            const target = el.getAttribute('target') || defaultLinkProps.target;
            const rel = el.getAttribute('rel') || defaultLinkProps.rel;
            const title = el.textContent || '';
            const props: LinkElementProps = {
              url: href,
              target,
              rel,
              title,
              nodeType: 'inline',
            };

            return {
              id: generateId(),
              type: 'link',
              props,
              children: deserializeTextNodes(editor, el.childNodes),
            };
          }
        },
      },
    },
    email: {
      serialize: (element, text) => {
        const { url, target, rel, title } = element.props;
        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td>
                  <a href="${url}" target="${target}" rel="${rel}">${serializeTextNodes(element.children)}</a>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      },
    },
  },
  translations: defaultLocales,
});

export { Link };
