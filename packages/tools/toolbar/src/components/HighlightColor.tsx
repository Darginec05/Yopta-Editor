import { HexColorPicker } from 'react-colorful';
import { CSSProperties, MouseEvent, useState } from 'react';
import { YooEditor, UI } from '@yoopta/editor';
import { PaletteIcon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

const { Portal } = UI;

const COLOR_PRESETS = {
  text: [
    { name: 'Default', value: 'black' },
    { name: 'Gray', value: '#787774' },
    { name: 'Brown', value: '#976D57' },
    { name: 'Orange', value: '#CC772F' },
    { name: 'Yellow', value: '#C29243' },
    { name: 'Green', value: '#548064' },
    { name: 'Blue', value: '#477DA5' },
    { name: 'Purple', value: '#A48BBE' },
    { name: 'Pink', value: '#B35588' },
    { name: 'Red', value: '#C4554D' },
  ],
  background: [
    { name: 'Default', value: 'unset' },
    { name: 'Gray', value: '#F1F1EF' },
    { name: 'Brown', value: '#F3EEEE' },
    { name: 'Orange', value: '#F8ECDF' },
    { name: 'Yellow', value: '#FAF3DD' },
    { name: 'Green', value: '#EEF3ED' },
    { name: 'Blue', value: '#E9F3F7' },
    { name: 'Purple', value: '#F6F3F8' },
    { name: 'Pink', value: '#F9F2F5' },
    { name: 'Red', value: '#FAECEC' },
  ],
};

type Props = {
  editor: YooEditor;
  highlightColors: CSSProperties;
  onClose: () => void;
  refs: { setFloating: (el: any) => void };
  floatingStyles: React.CSSProperties;
};

const COLOR_PICKER_STYLES = {
  width: '100%',
  height: 170,
};

const HighlightColor = ({ editor, refs, floatingStyles, highlightColors = {} }: Props) => {
  const [tab, setTab] = useState<'text' | 'background'>('text');
  const [showColorPicker, setShowColorPicker] = useState(true);
  const [localColor, setLocalColor] = useState<string | null>(null);

  const debouncedUpdateColor = useDebouncedCallback((type: 'color' | 'backgroundColor', color: string) => {
    const value = editor.formats.highlight.getValue();
    if (value?.[type] === color) {
      editor.formats.highlight.update({ ...highlightColors, [type]: undefined });
    } else {
      editor.formats.highlight.update({ ...highlightColors, [type]: color });
    }

    setLocalColor(null);
  }, 250);

  const handleColorChange = (type: 'color' | 'backgroundColor', color: string, shouldDebounce?: boolean) => {
    if (shouldDebounce) {
      setLocalColor(color);
      debouncedUpdateColor(type, color);
    } else {
      const value = editor.formats.highlight.getValue();
      if (value?.[type] === color) {
        editor.formats.highlight.update({ ...highlightColors, [type]: undefined });
      } else {
        editor.formats.highlight.update({ ...highlightColors, [type]: color });
      }
    }
  };

  const getItemStyles = (type: 'color' | 'backgroundColor', color: string) => {
    const currentColor = localColor || highlightColors?.[type];
    const isActive = currentColor === color;
    return {
      backgroundColor: color,
      border: isActive ? '2px solid #3b82f6' : '1px solid #e3e3e3',
      position: 'relative' as const,
    };
  };

  return (
    <Portal id="yoo-highlight-color-portal">
      <div
        style={floatingStyles}
        ref={refs.setFloating}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        className="yoo-toolbar-z-50"
      >
        <div className="yoo-toolbar-bg-[#FFFFFF] yoo-toolbar-p-2 yoo-toolbar-rounded-md yoo-toolbar-shadow-md yoo-toolbar-border yoo-toolbar-border-solid yoo-toolbar-border-[#e5e7eb]">
          {/* Tabs */}
          <div className="yoo-toolbar-flex yoo-toolbar-space-x-2 yoo-toolbar-mb-3">
            <button
              className={`yoo-toolbar-px-3 yoo-toolbar-py-1 yoo-toolbar-text-sm yoo-toolbar-rounded ${
                tab === 'text'
                  ? 'yoo-toolbar-bg-blue-50 yoo-toolbar-text-blue-600'
                  : 'yoo-toolbar-text-gray-600 hover:yoo-toolbar-bg-gray-50'
              }`}
              onClick={() => setTab('text')}
            >
              {editor.getLabelText('tools.toolbar.highlightColor.text') || 'Text'}
            </button>
            <button
              className={`yoo-toolbar-px-3 yoo-toolbar-py-1 yoo-toolbar-text-sm yoo-toolbar-rounded ${
                tab === 'background'
                  ? 'yoo-toolbar-bg-blue-50 yoo-toolbar-text-blue-600'
                  : 'yoo-toolbar-text-gray-600 hover:yoo-toolbar-bg-gray-50'
              }`}
              onClick={() => setTab('background')}
            >
              {editor.getLabelText('tools.toolbar.highlightColor.background') || 'Background'}
            </button>
          </div>

          {/* Presets Grid */}
          <div className="yoo-toolbar-grid yoo-toolbar-justify-items-center yoo-toolbar-grid-cols-5 yoo-toolbar-gap-1 yoo-toolbar-mb-3">
            {COLOR_PRESETS[tab].map(({ name, value }) => (
              <button
                key={name}
                title={name}
                type="button"
                className="yoo-toolbar-w-6 yoo-toolbar-h-6 yoo-toolbar-rounded yoo-toolbar-transition-all hover:yoo-toolbar-scale-110"
                style={getItemStyles(tab === 'text' ? 'color' : 'backgroundColor', value)}
                onClick={() => handleColorChange(tab === 'text' ? 'color' : 'backgroundColor', value)}
              />
            ))}
          </div>

          {/* Custom Color Section */}
          <div className="yoo-toolbar-border-t yoo-toolbar-pt-2">
            <button
              className="yoo-toolbar-text-sm yoo-toolbar-text-gray-600 hover:yoo-toolbar-text-gray-900 yoo-toolbar-flex yoo-toolbar-items-center"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              {editor.getLabelText('tools.toolbar.highlightColor.customColor') || 'Custom color'}
              <PaletteIcon className="yoo-toolbar-w-4 yoo-toolbar-h-4 yoo-toolbar-ml-1" />
            </button>

            {showColorPicker && (
              <div className="yoo-toolbar-mt-2">
                <HexColorPicker
                  color={localColor || highlightColors[tab === 'text' ? 'color' : 'backgroundColor'] || '#000000'}
                  onChange={(color) => handleColorChange(tab === 'text' ? 'color' : 'backgroundColor', color, true)}
                  style={COLOR_PICKER_STYLES}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export { HighlightColor };
