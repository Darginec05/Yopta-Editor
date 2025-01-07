import { generateId, SlateElement, YooptaPlugin } from '@yoopta/editor';
import { ImageCommands } from '../commands';
import { ImageElementMap, ImageElementProps, ImagePluginElements, ImagePluginOptions } from '../types';
import { ImageRender } from '../ui/Image';
import { limitSizes } from '../utils/limitSizes';
import {defaultLocales} from '../locales';

const ALIGNS_TO_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

// [TODO] - caption element??
const Image = new YooptaPlugin<ImageElementMap, ImagePluginOptions>({
  type: 'Image',
  elements: {
    image: {
      render: ImageRender,
      props: {
        src: null,
        alt: null,
        srcSet: null,
        bgColor: null,
        fit: 'contain',
        sizes: { width: 650, height: 500 },
        nodeType: 'void',
      },
    },
  },
  commands: ImageCommands,
  options: {
    display: {
      title: 'Image',
      description: 'Upload from device or insert with link',
    },
    onUpload: () => Promise.resolve({ src: null, alt: null }),
    accept: 'image/png, image/jpeg, image/gif, image/webp',
    maxSizes: { maxWidth: 650, maxHeight: 550 },
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['IMG'],
        parse: (el, editor) => {
          if (el.nodeName === 'IMG') {
            const sizes = {
              width: el.getAttribute('width') ? parseInt(el.getAttribute('width') || '650', 10) : 650,
              height: el.getAttribute('height') ? parseInt(el.getAttribute('height') || '500', 10) : 500,
            };

            const maxSizes = (editor.plugins.Image.options as ImagePluginOptions)?.maxSizes;
            const limitedSizes = limitSizes(sizes!, {
              width: maxSizes!.maxWidth!,
              height: maxSizes!.maxHeight!,
            });

            const props: SlateElement<'image', ImageElementProps>['props'] = {
              nodeType: 'void',
              src: el.getAttribute('src') || '',
              alt: el.getAttribute('alt') || '',
              srcSet: el.getAttribute('srcset') || '',
              fit: (el.getAttribute('objectFit') || 'contain') as ImageElementProps['fit'],
              sizes: limitedSizes,
            };

            const node: SlateElement = {
              id: generateId(),
              type: 'image',
              children: [{ text: '' }],
              props,
            };

            return node;
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'center';

        return `<div style="margin-left: ${depth * 20}px; display: flex; width: 100%; justify-content: ${justify};">
        <img data-meta-align="${align}" data-meta-depth="${depth}" src="${element.props.src}" alt="${
          element.props.alt
        }" width="${element.props.sizes.width}" height="${element.props.sizes.height}" objectFit="${
          element.props.fit
        }"/>
        </div>`;
      },
    },
    markdown: {
      serialize: (element, text) => {
        return `![${element.props.alt || element.id}](${element.props.src})\n`;
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'center';

        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td style="margin-left: ${
                  depth * 20
                }px; display: flex; width: 100%; justify-content: ${justify}; margin-top: 1rem;">
                    <img data-meta-align="${align}" style="margin: 0 auto; object-fit:${
          element.props.fit || 'contain'
        };" data-meta-depth="${depth}" src="${element.props.src}" alt="${element.props.alt}" width="${
          element.props.sizes.width
        }" height="${element.props.sizes.height}" />
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

export { Image };
