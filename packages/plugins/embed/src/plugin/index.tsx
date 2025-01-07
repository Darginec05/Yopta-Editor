import { generateId, YooptaPlugin } from '@yoopta/editor';
import { EmbedCommands } from '../commands';
import { EmbedElementMap, EmbedPluginOptions } from '../types';
import { EmbedRender } from '../ui/Embed';
import {defaultLocales} from '../locales';

const ALIGNS_TO_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const Embed = new YooptaPlugin<EmbedElementMap, EmbedPluginOptions>({
  type: 'Embed',
  elements: {
    embed: {
      render: EmbedRender,
      props: {
        sizes: { width: 650, height: 500 },
        nodeType: 'void',
      },
    },
  },
  options: {
    display: {
      title: 'Embed',
      description: 'For embed videos, google maps and more',
    },
    shortcuts: ['instagram', 'twitter', 'youtube', 'vimeo', 'dailymotion', 'figma'],
  },
  commands: EmbedCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['IFRAME'],
        parse: (el) => {
          if (el.nodeName === 'IFRAME') {
            const url = new URL(el.getAttribute('src') || '');

            return {
              id: generateId(),
              type: 'embed',
              children: [{ text: '' }],
              props: {
                provider: {
                  id: url.href,
                  type: url.hostname,
                  url: url.href,
                },
                sizes: {
                  width: el.getAttribute('width') ? parseInt(el.getAttribute('width') || '650', 10) : 650,
                  height: el.getAttribute('height') ? parseInt(el.getAttribute('height') || '400', 10) : 400,
                },
              },
            };
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'center';

        const URL_BUILDERS = {
          youtube: (id: string) => `https://www.youtube.com/embed/${id}`,
          vimeo: (id: string) => `https://player.vimeo.com/embed/${id}`,
          dailymotion: (id: string) => `https://www.dailymotion.com/embed/embed/${id}`,
          figma: (id: string) => `https://www.figma.com/embed?embed_host=share&url=${id}`,
          loom: (id: string) =>
            `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`,
          instagram: (id: string) => `https://www.instagram.com/p/${id}/embed`,
          wistia: (id: string) => `https://fast.wistia.net/embed/iframe/${id}?videoFoam=false`,
          twitter: (id: string) => `https://platform.twitter.com/widgets/tweet.html?id=${id}`,
        };

        let url = element.props.provider.url;

        if (URL_BUILDERS[element.props.provider.type]) {
          url = URL_BUILDERS[element.props.provider.type](element.props.provider.id);
        }

        return `<div style="margin-left: ${depth * 20}px; display: flex; width: 100%; justify-content: ${justify}">
        <iframe data-meta-align="${align}" data-meta-depth="${depth}" src="${url}" width="${
          element.props.sizes.width
        }" height="${element.props.sizes.height}"></iframe> </div>`;
      },
    },
    markdown: {
      serialize: (element, text) => {
        return `![${element.props.provider.type}](${element.props.provider.url})\n`;
      },
    },
  },
  translations: defaultLocales,
});

export { Embed };
