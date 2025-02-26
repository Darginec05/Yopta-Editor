import { Elements, UI, YooEditor, YooptaBlockData } from '@yoopta/editor';
import SuccessIcon from '../icons/success.svg';
import WarningIcon from '../icons/warning.svg';
import ErrorIcon from '../icons/error.svg';
import DefaultIcon from '../icons/default.svg';
import InfoIcon from '../icons/info.svg';
import CheckmarkIcon from '../icons/checkmark.svg';
import { CalloutElementProps, CalloutPluginElementKeys, CalloutTheme } from '../types';
import { CALLOUT_THEME_STYLES } from '../utils';

const { ExtendedBlockActions, BlockOptionsMenuGroup, BlockOptionsMenuItem, BlockOptionsSeparator } = UI;

type Props = {
  editor: YooEditor;
  block: YooptaBlockData;
  props?: CalloutElementProps;
};

const CalloutBlockOptions = ({ editor, block, props: calloutProps }: Props) => {
  const onChangeTheme = (theme: CalloutTheme) => {
    Elements.updateElement<CalloutPluginElementKeys, CalloutElementProps>(editor, block.id, {
      type: 'callout',
      props: {
        theme,
      },
    });
  };

  const isActiveTheme = (theme: CalloutTheme) => calloutProps?.theme === theme;

  return (
    <ExtendedBlockActions
      onClick={() => editor.setPath({ current: block.meta.order })}
      className="yoopta-callout-options"
    >
      <BlockOptionsSeparator />
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-callout-justify-between"
            onClick={() => onChangeTheme('default')}
            style={{
              backgroundColor: isActiveTheme('default') ? CALLOUT_THEME_STYLES.default.backgroundColor : undefined,
            }}
          >
            <span className="yoo-callout-flex">
              <DefaultIcon
                width={16}
                height={16}
                color={CALLOUT_THEME_STYLES.default.color}
                className="yoo-callout-w-4 yoo-callout-h-4 yoo-callout-mr-2"
              />
              {editor.getLabelText('plugins.Callout.options.theme.default') || 'Default'}
            </span>
            {isActiveTheme('default') && (
              <CheckmarkIcon width={16} height={16} color="#000" className="yoo-callout-w-4 yoo-callout-h-4" />
            )}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-callout-justify-between"
            onClick={() => onChangeTheme('info')}
            style={{ backgroundColor: isActiveTheme('info') ? CALLOUT_THEME_STYLES.info.backgroundColor : undefined }}
          >
            <span className="yoo-callout-flex">
              <InfoIcon
                width={16}
                height={16}
                color={CALLOUT_THEME_STYLES.info.color}
                className="yoo-callout-w-4 yoo-callout-h-4 yoo-callout-mr-2"
              />
              {/* Info */}
              {editor.getLabelText('plugins.Callout.options.theme.info') || 'Info'}
            </span>
            {isActiveTheme('info') && (
              <CheckmarkIcon width={16} height={16} color="#000" className="yoo-callout-w-4 yoo-callout-h-4" />
            )}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-callout-justify-between"
            onClick={() => onChangeTheme('success')}
            style={{
              backgroundColor: isActiveTheme('success') ? CALLOUT_THEME_STYLES.success.backgroundColor : undefined,
            }}
          >
            <span className="yoo-callout-flex">
              <SuccessIcon
                width={16}
                height={16}
                color={CALLOUT_THEME_STYLES.success.color}
                className="yoo-callout-w-4 yoo-callout-h-4 yoo-callout-mr-2"
              />
              {/* Success */}
              {editor.getLabelText('plugins.Callout.options.theme.success') || 'Success'}
            </span>
            {isActiveTheme('success') && (
              <CheckmarkIcon width={16} height={16} color="#000" className="yoo-callout-w-4 yoo-callout-h-4" />
            )}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-callout-justify-between"
            onClick={() => onChangeTheme('warning')}
            style={{
              backgroundColor: isActiveTheme('warning') ? CALLOUT_THEME_STYLES.warning.backgroundColor : undefined,
            }}
          >
            <span className="yoo-callout-flex">
              <WarningIcon
                width={16}
                height={16}
                color={CALLOUT_THEME_STYLES.warning.color}
                className="yoo-callout-w-4 yoo-callout-h-4 yoo-callout-mr-2"
              />
              {/* Warning */}
              {editor.getLabelText('plugins.Callout.options.theme.warning') || 'Warning'}
            </span>
            {isActiveTheme('warning') && (
              <CheckmarkIcon width={16} height={16} color="#000" className="yoo-callout-w-4 yoo-callout-h-4" />
            )}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-callout-justify-between"
            onClick={() => onChangeTheme('error')}
            style={{ backgroundColor: isActiveTheme('error') ? CALLOUT_THEME_STYLES.error.backgroundColor : undefined }}
          >
            <span className="yoo-callout-flex">
              <ErrorIcon
                width={16}
                height={16}
                color={CALLOUT_THEME_STYLES.error.color}
                className="yoo-callout-w-4 yoo-callout-h-4 yoo-callout-mr-2"
              />
              {/* Error */}
              {editor.getLabelText('plugins.Callout.options.theme.error') || 'Error'}
            </span>
            {isActiveTheme('error') && (
              <CheckmarkIcon width={16} height={16} color="#000" className="yoo-callout-w-4 yoo-callout-h-4" />
            )}
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </ExtendedBlockActions>
  );
};

export { CalloutBlockOptions };
