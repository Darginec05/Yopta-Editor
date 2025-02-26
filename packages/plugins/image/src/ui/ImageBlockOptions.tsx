import { Blocks, Elements, UI, useYooptaPluginOptions, YooEditor, YooptaBlockData } from '@yoopta/editor';
import {
  RowSpacingIcon,
  SizeIcon,
  WidthIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UpdateIcon,
  TextIcon,
} from '@radix-ui/react-icons';
import { ImageElementProps, ImagePluginElements, ImagePluginOptions } from '../types';
import CheckmarkIcon from '../icons/checkmark.svg';
import DownloadIcon from '../icons/download.svg';
import { useState } from 'react';
import { Loader } from './Loader';
import { flip, inline, offset, shift, useFloating } from '@floating-ui/react';
import { InputAltText } from './InputAltText';

const ALIGN_ICONS = {
  left: TextAlignLeftIcon,
  center: TextAlignCenterIcon,
  right: TextAlignRightIcon,
};

const { ExtendedBlockActions, BlockOptionsMenuGroup, BlockOptionsMenuItem, BlockOptionsSeparator } = UI;

type Props = {
  editor: YooEditor;
  block: YooptaBlockData;
  props?: ImageElementProps;
};

const ImageBlockOptions = ({ editor, block, props: imageProps }: Props) => {
  const options = useYooptaPluginOptions<ImagePluginOptions>('Image');
  const [isAltTextOpen, setIsAltTextOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [altText, setAltText] = useState<string>(imageProps?.alt || '');

  const { refs, floatingStyles } = useFloating({
    placement: 'left',
    open: isAltTextOpen,
    onOpenChange: setIsAltTextOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
  });

  const onSetLoading = (slate: boolean) => setLoading(slate);

  const onSetAltText = (text: string) => setAltText(text);
  const onSaveAltText = () => {
    if (!altText) return;
    Elements.updateElement<ImagePluginElements, ImageElementProps>(editor, block.id, {
      type: 'image',
      props: { alt: altText },
    });

    setIsAltTextOpen(false);
  };

  const onDeleteAltText = () => {
    setAltText('');
    Elements.updateElement<ImagePluginElements, ImageElementProps>(editor, block.id, {
      type: 'image',
      props: { alt: '' },
    });

    setIsAltTextOpen(false);
  };

  const onCover = () => {
    Elements.updateElement<ImagePluginElements, ImageElementProps>(editor, block.id, {
      type: 'image',
      props: { fit: 'cover' },
    });
  };

  const onFit = () => {
    Elements.updateElement<ImagePluginElements, ImageElementProps>(editor, block.id, {
      type: 'image',
      props: { fit: 'contain' },
    });
  };

  const onFill = () => {
    Elements.updateElement<ImagePluginElements, ImageElementProps>(editor, block.id, {
      type: 'image',
      props: { fit: 'fill' },
    });
  };

  const onDownload = () => {
    if (!imageProps || !imageProps.src) return;

    const link = document.createElement('a');
    link.href = imageProps.src;
    link.download = imageProps.alt || imageProps.src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentAlign = block?.meta?.align || 'center';
  const AlignIcon = ALIGN_ICONS[currentAlign];

  const onToggleAlign = () => {
    const aligns = ['left', 'center', 'right'];
    if (!block) return;

    const nextAlign = aligns[(aligns.indexOf(currentAlign) + 1) % aligns.length] as YooptaBlockData['meta']['align'];
    Blocks.updateBlock(editor, block.id, { meta: { ...block.meta, align: nextAlign } });
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!options?.onUpload) {
      throw new Error('onUpload not provided in plugin options. Check Image.extend({}) method');
    }

    const file = e.target.files?.[0];
    if (!file) return;

    onSetLoading(true);

    try {
      const data = await options?.onUpload(file);
      const defaultImageProps = editor.plugins.Image.elements.image.props as ImageElementProps;

      Elements.updateElement<ImagePluginElements, ImageElementProps>(editor, block.id, {
        type: 'image',
        props: {
          src: data.src,
          alt: data.alt,
          sizes: data.sizes || defaultImageProps.sizes,
          bgColor: imageProps?.bgColor || data.bgColor || defaultImageProps.bgColor,
          fit: imageProps?.fit || data.fit || defaultImageProps.fit || 'fill',
        },
      });
    } catch (error) {
    } finally {
      onSetLoading(false);
    }
  };

  return (
    <ExtendedBlockActions
      onClick={() => editor.setPath({ current: block.meta.order })}
      className="yoopta-image-options"
    >
      <BlockOptionsSeparator />
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button yoo-image-justify-between" onClick={onFit}>
            <span className="yoo-image-flex">
              <RowSpacingIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4 yoo-image-mr-2" />
              {editor.getLabelText('plugins.Image.options.fit.contain') || 'Fit'}
            </span>
            {imageProps?.fit === 'contain' && (
              <CheckmarkIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4" />
            )}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button yoo-image-justify-between" onClick={onFill}>
            <span className="yoo-image-flex">
              <WidthIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4 yoo-image-mr-2" />
              {editor.getLabelText('plugins.Image.options.fit.fill') || 'Fill'}
            </span>
            {imageProps?.fit === 'fill' && (
              <CheckmarkIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4" />
            )}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button yoo-image-justify-between" onClick={onCover}>
            <span className="yoo-image-flex">
              <SizeIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4 yoo-image-mr-2" />
              {editor.getLabelText('plugins.Image.options.fit.cover') || 'Cover'}
            </span>
            {imageProps?.fit === 'cover' && (
              <CheckmarkIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4" />
            )}
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
      <BlockOptionsSeparator />
      <BlockOptionsMenuGroup>
        {isAltTextOpen && (
          <InputAltText
            value={altText}
            onChange={onSetAltText}
            floatingStyles={floatingStyles}
            onClose={() => setIsAltTextOpen(false)}
            refs={refs}
            onDelete={onDeleteAltText}
            onSave={onSaveAltText}
            editor={editor}
          />
        )}
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button"
            ref={refs.setReference}
            onClick={() => setIsAltTextOpen(true)}
          >
            <TextIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4 yoo-image-mr-2" />
            {editor.getLabelText('plugins.Image.options.alt.title') || 'Alt text'}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <label
            htmlFor="image-uploader"
            className="yoo-image-rounded-sm yoo-image-relative hover:yoo-image-bg-[#37352f14] yoo-image-leading-[120%] yoo-image-px-2 yoo-image-py-1.5 yoo-image-mx-[4px] yoo-image-cursor-pointer yoo-image-w-full yoo-image-flex yoo-image-justify-start data-[disabled=true]:yoo-image-cursor-not-allowed data-[disabled=true]:yoo-image-pointer-events-none data-[disabled=true]:yoo-image-opacity-50"
            data-disabled={loading}
          >
            <input
              type="file"
              accept={options.accept}
              multiple={false}
              id="image-uploader"
              className="yoo-image-absolute yoo-image-hidden"
              onChange={onUpload}
              disabled={loading}
            />
            {loading ? (
              <Loader className="yoo-image-mr-2 yoo-image-user-select-none" width={24} height={24} />
            ) : (
              <UpdateIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4 yoo-image-mr-2" />
            )}
            {editor.getLabelText('plugins.Image.options.replaceImage') || 'Replace image'}
          </label>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
      <BlockOptionsSeparator />
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-button yoo-image-rounded-sm hover:yoo-image-bg-[#37352f14] yoo-image-leading-[120%] yoo-image-px-2 yoo-image-py-1.5 yoo-image-mx-[4px] yoo-image-cursor-pointer yoo-image-w-full yoo-image-flex yoo-image-justify-start"
            onClick={onToggleAlign}
          >
            <AlignIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4 yoo-image-mr-2" />
            {editor.getLabelText('plugins.Image.options.align') || 'Align'}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={onDownload}>
            <DownloadIcon width={16} height={16} className="yoo-image-w-4 yoo-image-h-4 yoo-image-mr-2" />
            {editor.getLabelText('plugins.Image.options.downloadImage') || 'Download'}
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </ExtendedBlockActions>
  );
};

export { ImageBlockOptions };
