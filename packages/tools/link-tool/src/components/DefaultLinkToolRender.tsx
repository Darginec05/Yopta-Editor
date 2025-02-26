import { ChangeEvent, useEffect, useState } from 'react';
import { LinkToolRenderProps, Link } from '../types';
import ChevronUp from '../icons/chevronup.svg';
import { useYooptaEditor } from '@yoopta/editor';

const DefaultLinkToolRender = (props: LinkToolRenderProps) => {
  const { withLink = true, withTitle = true } = props;
  const editor = useYooptaEditor();
  const defaultLinkProps = editor.plugins?.LinkPlugin?.elements?.link?.props;

  const [link, setLink] = useState(props?.link || defaultLinkProps);
  const [isAdditionalPropsOpen, setAdditionPropsOpen] = useState(false);

  const onChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setLink((p) => ({ ...p, [target.name]: target.value }));
  };

  useEffect(() => {
    const hasUrl = !!props.link.url;
    if (hasUrl) setLink(props.link);
    if (!hasUrl && defaultLinkProps) {
      setLink({
        ...props.link,
        rel: defaultLinkProps.rel || props.link.rel || '',
        target: defaultLinkProps.target || props.link.target || '_self',
      });
    }
  }, [props.link]);

  const onSave = () => {
    if (!link.url) return;
    props.onSave(link);
  };

  const onDelete = () => {
    props.onDelete();
  };

  return (
    <div className="yoopta-link-tool yoo-link-tool-shadow-y-[4px]">
      {withTitle && (
        <div>
          <label htmlFor="title" className="yoopta-link-tool-label">
            {editor.getLabelText('tools.link.title') || 'Link title'}
          </label>
          <input
            id="title"
            type="text"
            className="yoopta-link-tool-input"
            name="title"
            value={link.title || ''}
            onChange={onChange}
            placeholder={editor.getLabelText('tools.link.titlePlaceholder') || 'Edit link title'}
            autoComplete="off"
          />
        </div>
      )}
      {withLink && (
        <div className={withTitle ? 'yoo-link-tool-mt-2' : ''}>
          <label htmlFor="url" className="yoopta-link-tool-label">
            {editor.getLabelText('tools.link.url') || 'Link URL'}
          </label>
          <input
            id="url"
            type="text"
            className="yoopta-link-tool-input"
            name="url"
            value={link.url || ''}
            onChange={onChange}
            placeholder={editor.getLabelText('tools.link.urlPlaceholder') || 'Edit link URL'}
            autoComplete="off"
          />
        </div>
      )}
      <button
        type="button"
        className="yoopta-button yoopta-link-tool-label !yoo-link-tool-font-[500] yoo-link-tool-mt-2 !yoo-link-tool-mb-0 !yoo-link-tool-flex yoo-link-tool-justify-between yoo-link-tool-items-center yoo-link-tool-w-full"
        onClick={() => setAdditionPropsOpen((p) => !p)}
      >
        {editor.getLabelText('tools.link.additionalProps') || 'Additional props'}
        <ChevronUp style={{ transform: isAdditionalPropsOpen ? `rotate(180deg)` : `rotate(0deg)` }} />
      </button>
      {isAdditionalPropsOpen && (
        <>
          <div className="yoo-link-tool-mt-2">
            <label htmlFor="target" className="yoopta-link-tool-label">
              {editor.getLabelText('tools.link.target') || 'Link target'}
            </label>
            <input
              id="target"
              type="text"
              className="yoopta-link-tool-input"
              name="target"
              value={link.target}
              onChange={onChange}
              placeholder={editor.getLabelText('tools.link.targetPlaceholder') || 'Edit link target'}
              autoComplete="off"
            />
          </div>
          <div className="yoo-link-tool-mt-2">
            <label htmlFor="rel" className="yoopta-link-tool-label">
              {editor.getLabelText('tools.link.rel') || 'Link rel'}
            </label>
            <input
              id="rel"
              type="text"
              className="yoopta-link-tool-input"
              name="rel"
              value={link.rel}
              onChange={onChange}
              placeholder={editor.getLabelText('tools.link.relPlaceholder') || 'Edit link rel'}
              autoComplete="off"
            />
          </div>
        </>
      )}
      <div className="yoo-link-tool-mt-2 yoo-link-tool-flex yoo-link-tool-justify-between">
        <button
          type="button"
          className="yoopta-button yoo-link-tool-bg-[#1183ff] yoo-link-tool-text-[#fff] yoo-link-tool-text-sm yoo-link-tool-font-medium yoo-link-tool-py-[5px] yoo-link-tool-px-[10px] yoo-link-tool-rounded-md yoo-link-tool-shadow-sm disabled:yoo-link-tool-opacity-50"
          disabled={!link.url}
          onClick={onSave}
        >
          {props.link.url
            ? editor.getLabelText('tools.link.update') || 'Update'
            : editor.getLabelText('tools.link.add') || 'Add'}
        </button>
        <button
          type="button"
          className="yoopta-button yoo-link-tool-ml-2 yoo-link-tool-bg-[#f4f4f5] yoo-link-tool-text-[#000] yoo-link-tool-text-sm yoo-link-tool-font-medium yoo-link-tool-py-[5px] yoo-link-tool-px-[10px] yoo-link-tool-rounded-md yoo-link-tool-shadow-sm disabled:yoo-link-tool-opacity-50"
          onClick={onDelete}
        >
          {editor.getLabelText('tools.link.delete') || 'Delete link'}
        </button>
      </div>
    </div>
  );
};

export { DefaultLinkToolRender };
