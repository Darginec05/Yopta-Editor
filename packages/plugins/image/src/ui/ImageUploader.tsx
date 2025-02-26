import { UI, YooEditor } from '@yoopta/editor';
import { CSSProperties, useState } from 'react';
import { EmbedUploader } from './EmbedUploader';
import { FileUploader } from './FileUploader';

type Props = {
  floatingStyles: CSSProperties;
  refs: any;
  blockId: string;
  onClose: () => void;
  onSetLoading: (_s: boolean) => void;
  editor: YooEditor;
};
const { Overlay, Portal } = UI;

type Tab = 'upload' | 'embed';

const ImageUploader = ({ floatingStyles, refs, onClose, blockId, editor, onSetLoading }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  const switchTab = (tab: Tab) => setActiveTab(tab);

  const isUploader = activeTab === 'upload';
  const isEmbed = activeTab === 'embed';

  const getTabStyles = (isActive) => ({
    borderBottom: isActive ? '2px solid #2483e2' : '2px solid transparent',
  });

  return (
    <Portal id="yoo-image-uploader-portal">
      <Overlay lockScroll className="yoo-image-z-[100]" onClick={onClose}>
        <div ref={refs.setFloating} style={floatingStyles} onClick={(e) => e.stopPropagation()}>
          <div className="yoo-image-flex yoo-image-flex-col yoo-image-min-w-[540px] yoo-image-max-w-[calc(100vw-24px)] yoo-image-h-full yoo-image-max-h-[420px] yoo-image-bg-[#FFFFFF] yoo-image-shadow-[rgb(15_15_15_/5%)_0px_0px_0px_1px,_rgb(15_15_15_/10%)_0px_3px_6px,_rgb(15_15_15_/20%)_0px_9px_24px]">
            <div className="yoo-image-w-full yoo-image-flex yoo-image-text-[14px] yoo-image-p-[0_8px] yoo-image-shadow-[rgb(55_53_47_/9%)_0px_-1px_0px_inset] yoo-image-relative yoo-image-z-10 yoo-image-h-[40px]">
              <button
                type="button"
                onClick={() => switchTab('upload')}
                style={getTabStyles(isUploader)}
                className={`yoopta-button yoo-image-py-[6px] yoo-image-whitespace-nowrap yoo-image-min-w-0 yoo-image-flex-shrink-0 yoo-image-text-[rgb(55,53,47)] yoo-image-relative yoo-image-cursor-pointer yoo-image-user-select-none yoo-image-bg-inherit yoo-image-transition-[height_20ms_ease-in] yoo-image-inline-flex yoo-image-items-center yoo-image-h-full yoo-image-text-[14px] yoo-image-leading-[1.2] yoo-image-px-[8px]`}
              >
                {editor.getLabelText('plugins.Image.options.placeholder.upload.label') || 'Upload'}
              </button>
              <button
                type="button"
                onClick={() => switchTab('embed')}
                style={getTabStyles(isEmbed)}
                className={
                  'yoopta-button yoo-image-py-[6px] yoo-image-whitespace-nowrap yoo-image-min-w-0 yoo-image-flex-shrink-0 yoo-image-text-[rgb(55,53,47)] yoo-image-relative yoo-image-cursor-pointer yoo-image-user-select-none yoo-image-bg-inherit yoo-image-transition-[height_20ms_ease-in] yoo-image-inline-flex yoo-image-items-center yoo-image-h-full yoo-image-text-[14px] yoo-image-leading-[1.2] yoo-image-px-[8px]'
                }
              >
                {editor.getLabelText('plugins.Image.options.placeholder.external.label') || 'Image link'}
              </button>
            </div>
            <div className="yoo-image-pt-[6px] yoo-image-pb-[6px] yoo-image-mt-[4px] yoo-image-flex yoo-image-justify-center yoo-image-mr-[12px] yoo-image-ml-[12px]">
              {isEmbed && <EmbedUploader onClose={onClose} blockId={blockId} />}
              {isUploader && <FileUploader onClose={onClose} blockId={blockId} onSetLoading={onSetLoading} />}
            </div>
          </div>
        </div>
      </Overlay>
    </Portal>
  );
};

export { ImageUploader };
