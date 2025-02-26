import { YooptaContextProvider } from './contexts/YooptaContext/YooptaContext';
import { Editor } from './components/Editor/Editor';
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { SlateElement, YooEditor, YooptaPath, YooptaContentValue } from './editor/types';
import { Plugin } from './plugins/types';
import { Tools, ToolsProvider } from './contexts/YooptaContext/ToolsContext';
import {
  buildBlocks,
  buildBlockShortcuts,
  buildBlockSlateEditors,
  buildCommands,
  buildMarks,
  buildPlugins,
} from './utils/editorBuilders';
import { YooptaPlugin } from './plugins';
import { YooptaMark } from './marks';
import { FakeSelectionMark } from './marks/FakeSelectionMark';
import { generateId } from './utils/generateId';
import { YooptaOperation } from './editor/core/applyTransforms';
import { validateYooptaValue } from './utils/validateYooptaValue';

export type YooptaOnChangeOptions = {
  operations: YooptaOperation[];
};

export type YooptaEditorProps = {
  id?: string;
  editor: YooEditor;
  plugins: Readonly<YooptaPlugin<Record<string, SlateElement>>[]>;
  marks?: YooptaMark<any>[];
  value?: YooptaContentValue;
  onChange?: (value: YooptaContentValue, options: YooptaOnChangeOptions) => void;
  onPathChange?: (path: YooptaPath) => void;
  autoFocus?: boolean;
  className?: string;
  selectionBoxRoot?: HTMLElement | React.MutableRefObject<HTMLElement | null> | false;
  children?: React.ReactNode;
  tools?: Partial<Tools>;
  placeholder?: string;
  readOnly?: boolean;
  width?: number | string;
  style?: CSSProperties;
};

type EditorState = {
  editor: YooEditor;
  version: number;
};

const YooptaEditor = ({
  id,
  editor,
  value,
  marks: marksProps,
  plugins: pluginsProps,
  autoFocus,
  className,
  tools,
  selectionBoxRoot,
  children,
  placeholder,
  readOnly,
  width,
  style,
  onChange,
  onPathChange,
}: YooptaEditorProps) => {
  const marks = useMemo(() => {
    if (marksProps) return [FakeSelectionMark, ...marksProps];
    return [FakeSelectionMark];
  }, [marksProps]);

  const plugins = useMemo(() => {
    return pluginsProps.map((plugin) => {
      return plugin.getPlugin as Plugin<Record<string, SlateElement>>;
    });
  }, [pluginsProps]);

  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (!editor.id) editor.id = id || generateId();
    editor.readOnly = readOnly || false;
    if (marks) editor.formats = buildMarks(editor, marks);
    editor.blocks = buildBlocks(editor, plugins);

    const isValueValid = validateYooptaValue(value);
    if (!isValueValid && typeof value !== 'undefined') {
      // [TODO] - add link to documentation
      console.error(
        `Initial value is not valid. Should be an object with blocks. You passed: ${JSON.stringify(value)}`,
      );
    }

    editor.children = (isValueValid ? value : {}) as YooptaContentValue;
    editor.blockEditorsMap = buildBlockSlateEditors(editor);
    editor.shortcuts = buildBlockShortcuts(editor);
    editor.plugins = buildPlugins(plugins);
    editor.commands = buildCommands(editor, plugins);

    return { editor, version: 0 };
  });

  const [_, setStatePath] = useState<YooptaPath | null>(null);

  const onEditorPathChange = useCallback((path: YooptaPath) => {
    setStatePath(path);
    onPathChange?.(path);
  }, []);

  const onValueChange = useCallback((value, options: YooptaOnChangeOptions) => {
    setEditorState((prevState) => ({
      editor: prevState.editor,
      version: prevState.version + 1,
    }));

    if (typeof onChange === 'function' && Array.isArray(options.operations)) {
      const operations = options.operations.filter(
        (operation) =>
          operation.type !== 'validate_block_paths' &&
          operation.type !== 'set_block_path' &&
          operation.type !== 'set_slate',
      );

      if (operations.length > 0) onChange(value, { operations });
    }
  }, []);

  useEffect(() => {
    const changeHandler = (options) => {
      onValueChange(options.value, { operations: options.operations });
    };

    editor.on('change', changeHandler);
    editor.on('path-change', onEditorPathChange);

    return () => {
      editor.off('change', changeHandler);
      editor.off('path-change', onEditorPathChange);
    };
  }, [editor, onValueChange]);

  return (
    <YooptaContextProvider editorState={editorState}>
      <ToolsProvider tools={tools}>
        <Editor
          placeholder={placeholder}
          marks={marks}
          autoFocus={autoFocus}
          className={className}
          selectionBoxRoot={selectionBoxRoot}
          width={width}
          style={style}
        >
          {children}
        </Editor>
      </ToolsProvider>
    </YooptaContextProvider>
  );
};

export { YooptaEditor };
