import React, { memo, useCallback, useMemo, useRef } from 'react';
import { DefaultElement, Editable, ReactEditor, RenderElementProps, Slate } from 'slate-react';
import { useYooptaEditor, useBlockData } from '../contexts/YooptaContext/YooptaContext';
import { EVENT_HANDLERS } from '../handlers';
import { YooptaMark } from '../marks';

import { ExtendedLeafProps, PluginCustomEditorRenderProps, Plugin, PluginEvents } from './types';
import { EditorEventHandlers } from '../types/eventHandlers';
import { Editor, NodeEntry, Path, Range, Selection } from 'slate';
import { TextLeaf } from '../components/TextLeaf/TextLeaf';

import { IS_FOCUSED_EDITOR } from '../utils/weakMaps';
import { deserializeHTML } from '../parsers/deserializeHTML';
import { useEventHandlers, useSlateEditor } from './hooks';
import { SlateElement } from '../editor/types';

type Props<TElementMap extends Record<string, SlateElement>, TOptions> = Omit<Plugin<TElementMap, TOptions>, 'translations'> & {
  id: string;
  marks?: YooptaMark<any>[];
  options: Plugin<TElementMap, TOptions>['options'];
  placeholder?: string;
  events?: PluginEvents;
};

const getMappedElements = (elements) => {
  const mappedElements = {};
  Object.keys(elements).forEach((type) => (mappedElements[type] = elements[type].render));
  return mappedElements;
};

const getMappedMarks = (marks?: YooptaMark<any>[]) => {
  const mappedMarks = {};
  if (!marks) return mappedMarks;

  marks.forEach((mark) => (mappedMarks[mark.type] = mark));
  return mappedMarks;
};

const SlateEditorComponent = <TElementMap extends Record<string, SlateElement>, TOptions>({
  id,
  customEditor,
  elements,
  marks,
  events,
  options,
  extensions: withExtensions,
  placeholder = 'core.editor_placeholder',
}: Props<TElementMap, TOptions>) => {
  const editor = useYooptaEditor();
  const block = useBlockData(id);
  let initialValue = useRef(block.value).current;
  const ELEMENTS_MAP = useMemo(() => getMappedElements(elements), [elements]);
  const MARKS_MAP = useMemo(() => getMappedMarks(marks), [marks]);

  const slate = useSlateEditor(id, editor, block, elements, withExtensions);
  const eventHandlers = useEventHandlers(events, editor, block, slate);

  const onChange = useCallback(
    (value) => {
      if (editor.readOnly) return;

      // @ts-ignore - fixme
      if (window.scheduler) {
        // @ts-ignore - fixme
        window.scheduler.postTask(() => editor.updateBlock(id, { value }), { priority: 'background' });
      } else {
        editor.updateBlock(id, { value });
      }
    },
    [id],
  );

  const onSelectionChange = useCallback(
    (selection: Selection) => {
      if (editor.readOnly) return;

      editor.setPath({ current: editor.path.current, selected: editor.path.selected, selection: selection });
    },
    [editor.readOnly],
  );

  const renderElement = useCallback(
    (elementProps: RenderElementProps) => {
      const ElementComponent = ELEMENTS_MAP[elementProps.element.type];
      const { attributes, ...props } = elementProps;
      attributes['data-element-type'] = props.element.type;

      if (!ElementComponent) return <DefaultElement {...props} attributes={attributes} />;

      return (
        <ElementComponent {...props} attributes={attributes} blockId={id} HTMLAttributes={options?.HTMLAttributes} />
      );
    },
    [elements],
  );

  const renderLeaf = useCallback(
    (props: ExtendedLeafProps<any, any>) => {
      let { children, leaf, attributes } = props;
      const { text, ...formats } = leaf;

      const isCurrentPath = editor.path.current === block.meta.order;

      if (formats) {
        Object.keys(formats).forEach((format) => {
          const mark = MARKS_MAP[format];
          if (mark) children = mark.render({ children, leaf });
        });
      }

      const isParentElementVoid = props.children?.props?.parent?.props?.nodeType === 'void';
      const showPlaceholder = !isParentElementVoid && isCurrentPath && leaf.withPlaceholder;

      return (
        <TextLeaf attributes={attributes} placeholder={showPlaceholder ? placeholder : undefined}>
          {children}
        </TextLeaf>
      );
    },
    [marks],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (editor.readOnly) return;

      eventHandlers.onKeyDown?.(event);
      EVENT_HANDLERS.onKeyDown(editor)(event);
    },
    [eventHandlers.onKeyDown, editor.readOnly, editor.path.current, block.meta.order],
  );

  const onKeyUp = useCallback(
    (event: React.KeyboardEvent) => {
      if (editor.readOnly) return;

      eventHandlers?.onKeyUp?.(event);
    },
    [eventHandlers.onKeyUp, editor.readOnly],
  );

  const onBlur = useCallback(
    (event: React.FocusEvent) => {
      if (editor.readOnly) return;

      event.preventDefault();
      eventHandlers?.onBlur?.(event);
    },
    [eventHandlers.onBlur, editor.readOnly],
  );

  const onFocus = useCallback(
    (event: React.FocusEvent) => {
      if (editor.readOnly) return;

      if (!editor.isFocused()) {
        IS_FOCUSED_EDITOR.set(editor, true);
        // [TODO] - as test
        editor.emit('focus', true);
      }
      eventHandlers?.onFocus?.(event);
    },
    [eventHandlers.onFocus, editor.readOnly],
  );

  const onPaste = useCallback(
    (event: React.ClipboardEvent) => {
      if (editor.readOnly) return;
      eventHandlers?.onPaste?.(event);

      const data = event.clipboardData;
      const html = data.getData('text/html');

      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

      if (parsedHTML.body.childNodes.length > 0) {
        const blocks = deserializeHTML(editor, parsedHTML.body);

        // If no blocks from HTML, then paste as plain text using default behavior from Slate
        if (blocks.length > 0 && editor.path.current !== null) {
          event.preventDefault();

          let shouldInsertAfterSelection = false;
          let shouldDeleteCurrentBlock = false;

          if (slate && slate.selection) {
            const parentPath = Path.parent(slate.selection.anchor.path);
            const text = Editor.string(slate, parentPath).trim();
            const isStart = Editor.isStart(slate, slate.selection.anchor, parentPath);
            shouldDeleteCurrentBlock = text === '' && isStart;
            shouldInsertAfterSelection = !isStart || text.length > 0;

            ReactEditor.blur(slate);
          }

          const insertPathIndex = editor.path.current;
          if (insertPathIndex === null) return;

          // [TEST]
          editor.batchOperations(() => {
            const newPaths: number[] = [];

            if (shouldDeleteCurrentBlock) {
              editor.deleteBlock({ at: insertPathIndex });
            }

            blocks.forEach((block, idx) => {
              let insertBlockPath = shouldInsertAfterSelection ? insertPathIndex + idx + 1 : insertPathIndex + idx;
              newPaths.push(insertBlockPath);

              const { type, ...blockData } = block;
              editor.insertBlock(block.type, { at: insertBlockPath, focus: false, blockData });
            });

            // [TEST]
            editor.setPath({ current: null, selected: newPaths });
          });

          return;
        }
      }
    },
    [eventHandlers.onPaste, editor.readOnly],
  );

  const decorate = useCallback(
    (nodeEntry: NodeEntry) => {
      const ranges = [] as NodeEntry[] & { withPlaceholder?: boolean }[];
      if (editor.readOnly) return ranges;

      const [node, path] = nodeEntry;
      const isCurrent = editor.path.current === block.meta.order;

      if (slate.selection && isCurrent) {
        if (
          !Editor.isEditor(node) &&
          Editor.string(slate, [path[0]]) === '' &&
          Range.includes(slate.selection, path) &&
          Range.isCollapsed(slate.selection)
        ) {
          ranges.push({
            ...slate.selection,
            withPlaceholder: true,
          });
        }
      }

      return ranges;
    },
    [editor.readOnly, editor.path.current, block.meta.order],
  );

  return (
    <SlateEditorInstance
      id={id}
      slate={slate}
      initialValue={initialValue}
      onChange={onChange}
      onSelectionChange={onSelectionChange}
      decorate={decorate}
      renderLeaf={renderLeaf}
      renderElement={renderElement}
      eventHandlers={eventHandlers}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onFocus={onFocus}
      onBlur={onBlur}
      customEditor={customEditor}
      readOnly={editor.readOnly}
      onPaste={onPaste}
    />
  );
};

type SlateEditorInstanceProps = {
  id: string;
  slate: any;
  readOnly: boolean;
  initialValue: any;
  onChange: (value: any) => void;
  onSelectionChange: (selection: Selection) => void;
  renderLeaf: (props: ExtendedLeafProps<any, any>) => JSX.Element;
  renderElement: (props: RenderElementProps) => JSX.Element;
  eventHandlers: EditorEventHandlers;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onKeyUp: (event: React.KeyboardEvent) => void;
  onFocus: (event: React.FocusEvent) => void;
  onBlur: (event: React.FocusEvent) => void;
  onPaste: (event: React.ClipboardEvent) => void;
  customEditor?: (props: PluginCustomEditorRenderProps) => JSX.Element;
  decorate: (nodeEntry: NodeEntry) => any[];
};

// [TODO] - no need memo
const SlateEditorInstance = memo<SlateEditorInstanceProps>(
  ({
    id,
    slate,
    initialValue,
    onChange,
    renderLeaf,
    renderElement,
    eventHandlers,
    onKeyDown,
    onKeyUp,
    onFocus,
    onSelectionChange,
    onPaste,
    customEditor,
    decorate,
    readOnly,
  }) => {
    if (typeof customEditor === 'function') {
      return customEditor({ blockId: id });
    }

    return (
      <Slate
        key={`slate-${id}`}
        editor={slate}
        initialValue={initialValue}
        onValueChange={onChange}
        onSelectionChange={onSelectionChange}
      >
        <Editable
          key={`editable-${id}`}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className="yoopta-slate"
          spellCheck
          {...eventHandlers}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onFocus={onFocus}
          decorate={decorate}
          // [TODO] - carefully check onBlur, e.x. transforms using functions, e.x. highlight update
          // onBlur={onBlur}
          readOnly={readOnly}
          onPaste={onPaste}
        />
      </Slate>
    );
  },
);

SlateEditorInstance.displayName = 'SlateEditorInstance';

export { SlateEditorComponent };
