import { Elements, useYooptaEditor } from '@yoopta/editor';
import { ChangeEvent, useState } from 'react';

const EmbedUploader = ({ blockId, onClose }) => {
  const editor = useYooptaEditor();
  const [value, setValue] = useState('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const embed = () => {
    if (value.length === 0) return;

    Elements.updateElement(editor, blockId, {
      type: 'image',
      props: {
        src: value,
      },
    });

    onClose();
  };

  const isEmpty = value.length === 0;

  return (
    <div className="yoo-image-cursor-pointer yoo-image-user-select-none yoo-image-transition-bg yoo-image-duration-20 yoo-image-ease-in yoo-image-white-space-nowrap yoo-image-w-full">
      <input
        type="text"
        placeholder={
          editor.getLabelText('plugins.Image.options.placeholder.external.placeholder') || 'Paste image link'
        }
        value={value}
        className="yoo-image-items-center yoo-image-bg-[hsla(45,13%,94%,.6)] yoo-image-rounded-[4px] yoo-image-shadow-[inset_0_0_0_1px_hsla(0,0%,6%,.1)] yoo-image-cursor-text yoo-image-flex yoo-image-text-[14px] yoo-image-h-[32px] yoo-image-leading-[20px] yoo-image-px-[6px] yoo-image-relative yoo-image-w-full yoo-image-border-none"
        onChange={onChange}
      />
      <button
        type="button"
        className="yoopta-button yoo-image-user-select-none yoo-image-transition-bg yoo-image-duration-20 yoo-image-ease-in yoo-image-cursor-pointer yoo-image-flex yoo-image-items-center yoo-image-justify-center yoo-image-flex-shrink-0 yoo-image-white-space-nowrap yoo-image-h-[28px] yoo-image-rounded-[4px] yoo-image-shadow-[rgba(15,15,15,0.1)_0px_0px_0px_1px_inset,_rgba(15,15,15,0.1)_0px_1px_2px] yoo-image-bg-[rgb(35,131,226)] yoo-image-text-white yoo-image-fill-white yoo-image-leading-[1.2] yoo-image-px-[12px] yoo-image-text-[14px] yoo-image-font-medium yoo-image-w-full yoo-image-max-w-[300px] yoo-image-mx-auto yoo-image-m-[12px_0_6px] disabled:yoo-image-bg-[rgba(35,131,226,0.5)] disabled:yoo-image-cursor-not-allowed"
        disabled={isEmpty}
        onClick={embed}
      >
        {editor.getLabelText('plugins.Image.options.placeholder.external.button') || 'Embed image'}
      </button>
    </div>
  );
};

export { EmbedUploader };
