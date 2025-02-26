import {
  Blocks,
  Elements,
  findSlateBySelectionPath,
  SlateElement,
  UI,
  useYooptaEditor,
  useYooptaTools,
} from '@yoopta/editor';
import { Copy, SquareArrowOutUpRight } from 'lucide-react';
import { useState } from 'react';
import { useFloating, offset, flip, shift, inline, autoUpdate, useTransitionStyles } from '@floating-ui/react';
import { LinkElementProps } from '../types';
import { Editor, Element, Transforms } from 'slate';

const { Overlay, Portal } = UI;

const LinkHoverPreview = ({ style, setFloating, element, setHoldLinkTool, blockId, onClose }) => {
  const editor = useYooptaEditor();
  const tools = useYooptaTools();
  const [isEditLinkToolsOpen, setIsEditLinkToolsOpen] = useState(false);

  const {
    refs: linkToolRefs,
    floatingStyles: linkToolStyles,
    context,
  } = useFloating({
    placement: 'bottom',
    open: isEditLinkToolsOpen,
    onOpenChange: (open) => {
      setIsEditLinkToolsOpen(open);
    },
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted: isLinkToolMounted, styles: linkToolTransitionStyles } = useTransitionStyles(context, {
    duration: {
      open: 100,
      close: 100,
    },
  });

  const linkToolEditStyles = { ...linkToolStyles, ...linkToolTransitionStyles, maxWidth: 400 };

  const LinkTool = tools?.LinkTool;
  const hasLinkTool = !!LinkTool;

  const onSave = (linkProps: LinkElementProps) => {
    Elements.updateElement(editor, blockId, {
      type: element.type,
      props: { ...element.props, ...linkProps },
    });

    setIsEditLinkToolsOpen(false);
    onClose();
  };

  const onDelete = () => {
    const slate = findSlateBySelectionPath(editor);
    const path = Elements.getElementPath(editor, blockId, element);

    if (!slate) return;
    const linkNodeEntry = Elements.getElementEntry(editor, blockId, { path, type: element.type });

    if (linkNodeEntry) {
      Transforms.unwrapNodes(slate, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && (n as SlateElement).type === element.type,
        at: path || linkNodeEntry?.[1],
      });
    }
  };

  const onOpenLink = () => {
    window.open(element.props.url, element.props.target || '_self');
  };

  return (
    <Portal id="yoopta-link-preview">
      {isLinkToolMounted && hasLinkTool && (
        <Portal id="yoopta-link-tool">
          <Overlay lockScroll className="yoo-link-z-[100]" onClick={onClose}>
            <div ref={linkToolRefs.setFloating} style={linkToolEditStyles} onClick={(e) => e.stopPropagation()}>
              <LinkTool editor={editor} link={element.props} onSave={onSave} onDelete={onDelete} withTitle={false} />
            </div>
          </Overlay>
        </Portal>
      )}
      <div className="yoopta-link-preview" style={style} ref={setFloating}>
        <span className="yoopta-link-preview-text">{element.props.url}</span>
        <span className="yoopta-link-preview-separator" />
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(element.props.url);
          }}
          className="yoopta-button"
        >
          <Copy size={14} strokeWidth={1} />
        </button>
        <span className="yoopta-link-preview-separator" />
        <button type="button" onClick={onOpenLink} className="yoopta-button">
          <SquareArrowOutUpRight size={14} strokeWidth={1} />
        </button>
        <span className="yoopta-link-preview-separator" />
        <button
          ref={linkToolRefs.setReference}
          type="button"
          className="yoopta-button yoopta-link-edit-button"
          onClick={() => {
            const block = Blocks.getBlock(editor, { id: blockId });
            if (block) editor.setPath({ current: block.meta.order });

            setHoldLinkTool((prev) => !prev);
            setIsEditLinkToolsOpen((prev) => !prev);
          }}
        >
          {/* Edit */}
          {editor.getLabelText('tools.link.edit') || 'Edit'}
        </button>
      </div>
    </Portal>
  );
};

export { LinkHoverPreview };
