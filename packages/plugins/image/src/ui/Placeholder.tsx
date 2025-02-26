import { useFloating, inline, flip, shift, offset } from '@floating-ui/react';
import { ImageIcon } from '@radix-ui/react-icons';
import { useYooptaEditor } from '@yoopta/editor';
import { CSSProperties, useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { Loader } from './Loader';

const Placeholder = ({ attributes, children, blockId }) => {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const editor = useYooptaEditor();

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom',
    open: isUploaderOpen,
    onOpenChange: setIsUploaderOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
  });

  const loadingStyles: CSSProperties = {
    width: '100%',
    transition: 'width 100ms ease-in',
  };

  const onSetLoading = (slate: boolean) => setLoading(slate);

  return (
    <div
      className="yoo-image-w-full yoo-image-user-select-none yoo-image-m-[20px_0_10px] yoo-image-relative yoo-image-flex"
      {...attributes}
      contentEditable={false}
    >
      <button
        className={`yoopta-button yoo-image-p-[12px_36px_12px_12px] yoo-image-flex yoo-image-items-center yoo-image-text-left yoo-image-w-full yoo-image-overflow-hidden yoo-image-rounded-[3px] yoo-image-text-[14px] yoo-image-text-[rgba(55,53,47,0.65)] yoo-image-relative yoo-image-cursor-pointer yoo-image-border-none yoo-image-bg-[#efefef] yoo-image-transition-[background-color_100ms_ease-in] hover:yoo-image-bg-[#e3e3e3]`}
        onClick={() => setIsUploaderOpen(true)}
        disabled={loading}
        type="button"
        ref={refs.setReference}
      >
        {loading ? (
          <Loader className="yoo-image-mr-2 yoo-image-user-select-none" width={24} height={24} />
        ) : (
          <ImageIcon className="yoo-image-mr-2 yoo-image-user-select-none" width={24} height={24} />
        )}
        <span className="yoo-image-font-medium">
          {loading
            ? editor.getLabelText('plugins.Image.options.placeholder.loading') || 'Loading...'
            : editor.getLabelText('plugins.Image.options.placeholder.title') || 'Click to add image'}
        </span>
        {loading && (
          <div
            className="yoo-image-absolute yoo-image-top-0 yoo-image-left-0 yoo-image-h-full yoo-image-bg-[rgba(55,53,47,0.16)]"
            style={loadingStyles}
          />
        )}
      </button>
      {isUploaderOpen && (
        <ImageUploader
          blockId={blockId}
          floatingStyles={floatingStyles}
          refs={refs}
          onClose={() => setIsUploaderOpen(false)}
          onSetLoading={onSetLoading}
          editor={editor}
        />
      )}
      {children}
    </div>
  );
};

export { Placeholder };
