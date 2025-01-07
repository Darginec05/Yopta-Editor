import { generateId, YooptaPlugin } from '@yoopta/editor';
import { VideoCommands } from '../commands';
import { VideoElementMap, VideoPluginOptions } from '../types';
import { VideoRender } from '../ui/Video';
import { limitSizes } from '../utils/limitSizes';
import {defaultLocales} from '../locales';

const ALIGNS_TO_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const Video = new YooptaPlugin<VideoElementMap, VideoPluginOptions>({
  type: 'Video',
  elements: {
    // [TODO] - caption element??,
    video: {
      render: VideoRender,
      props: {
        src: null,
        srcSet: null,
        bgColor: null,
        sizes: { width: 650, height: 400 },
        nodeType: 'void',
        fit: 'cover',
        provider: {
          type: null,
          id: '',
        },
        settings: {
          controls: false,
          loop: true,
          muted: true,
          autoPlay: true,
        },
      },
    },
  },
  options: {
    accept: 'video/*',
    maxSizes: { maxWidth: 650, maxHeight: 550 },
    onUpload: async () => Promise.resolve({ src: '' }),
    display: {
      title: 'Video',
      description: 'Upload from device, insert from Youtube, Vimeo, DailyMotion, Loom, Wistia',
    },
  },
  commands: VideoCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['VIDEO'],
        parse: (el, editor) => {
          if (el.nodeName === 'VIDEO') {
            const src = el.getAttribute('src');
            const srcSet = el.getAttribute('srcset');
            const bgColor = el.getAttribute('bgcolor');

            const sizes = {
              width: el.getAttribute('width') ? parseInt(el.getAttribute('width') || '650', 10) : 650,
              height: el.getAttribute('height') ? parseInt(el.getAttribute('height') || '500', 10) : 500,
            };

            const maxSizes = (editor.plugins.Image.options as VideoPluginOptions)?.maxSizes;
            const limitedSizes = limitSizes(sizes!, {
              width: maxSizes!.maxWidth!,
              height: maxSizes!.maxHeight!,
            });

            const controls = el.getAttribute('controls');
            const loop = el.getAttribute('loop');
            const muted = el.getAttribute('muted');
            const autoPlay = el.getAttribute('autoplay');
            const fit = el.getAttribute('objectFit') || 'cover';

            const props = {
              src,
              srcSet,
              bgColor,
              sizes: limitedSizes,
              fit,
              settings: {
                controls: !!controls,
                loop: !!loop,
                muted: !!muted,
                autoPlay: !!autoPlay,
              },
            };

            return {
              id: generateId(),
              type: 'video',
              children: [{ text: '' }],
              props,
            };
          }

          // [TODO] - add support for video links. Ex. from notion
          // if (el.nodeName === 'A') {

          //   const href = el.getAttribute('href');
          //   if (href?.endsWith('.mp4')) {
          //     return {
          //       id: generateId(),
          //       type: 'video',
          //       children: [{ text: '' }],
          //       props: {
          //         src: href,
          //         sizes: { width: 650, height: 400 },
          //         settings: {
          //           controls: false,
          //           loop: true,
          //           muted: true,
          //           autoPlay: true,
          //         },
          //       },
          //     };
          //   }
          // }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'center';

        return `
        <div style="margin-left: ${depth * 20}px; display: flex; width: 100%; justify-content: ${justify};">
        <video data-meta-align="${align}" data-meta-depth="${depth}" src="${element.props.src}" width="${
          element.props.sizes.width
        }" height="${element.props.sizes.height}" controls="${element.props.settings.controls}" loop="${
          element.props.settings.loop
        }" muted="${element.props.settings.muted}" autoplay="${
          element.props.settings.autoPlay
        }" style="margin: 0 auto;" objectFit="${element.props.fit}" />
        </div>`;
      },
    },
    markdown: {
      serialize: (element, text) => {
        return `![${element.props.src}](${element.props.src})\n`;
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'center', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'center';

        return `
          <table style="width: 100%;">
            <tbody style="width: 100%;">
              <tr>
                <td
                  style="
                    margin-left: ${depth}px;
                    display: flex;
                    width: 100%;
                    justify-content: ${justify};
                    padding: 1rem 0rem;
                    position: relative;
                  "
                >
                  <a
                    href="${element.props.src}"
                    target="_blank"
                    rel="noreferrer noopener"
                    style="
                      position: relative;
                      display: block;
                      width: ${element.props.sizes.width}px;
                      height: ${element.props.sizes.height}px;
                      background-color: #999999;
                      min-height: 300px;
                      border-radius: 12px;
                      border: none;
                      overflow: hidden;
                    "
                  >
                    <img
                      data-meta-align="${align}"
                      data-meta-depth="${depth}"
                      src="${element.props.poster}"
                      width="${element.props.sizes.width}"
                      height="${element.props.sizes.height}"
                      objectfit="${element.props.fit}"
                      alt="Poster"
                      style="
                        object-fit: ${element.props.fit};
                        height: 100%;
                      "
                    />
                    <span
                      style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        pointer-events: none;
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="50"
                        height="50"
                      >
                        <circle cx="12" cy="12" r="10" fill="rgba(0, 0, 0, 0.6)" />
                        <polygon points="10,8 16,12 10,16" fill="white" />
                      </svg>
                    </span>
                  </a>
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

export { Video };
