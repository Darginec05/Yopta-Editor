import { cloneElement, isValidElement } from 'react';
import { ActionMenuRenderProps } from '../types';
import { DEFAULT_ICONS_MAP } from './icons';

const DefaultActionMenuRender = ({
  actions,
  editor,
  empty,
  getItemProps,
  getRootProps,
  view = 'default',
}: ActionMenuRenderProps) => {
  const isViewSmall = view === 'small';

  const wrapStyles = {
    maxWidth: isViewSmall ? '200px' : '270px',
  };

  const iconWrapStyles = {
    minWidth: isViewSmall ? '28px' : '40px',
    width: isViewSmall ? '28px' : '40px',
    height: isViewSmall ? '28px' : '40px',
  };

  const iconStyles = {
    transform: isViewSmall ? 'scale(0.75)' : 'scale(1)',
  };

  const renderIcon = (Icon: any) => {
    if (!Icon) return null;
    if (typeof Icon === 'string') return <img src={Icon} alt="icon" style={iconStyles} />;
    if (isValidElement(Icon)) return cloneElement<any>(Icon, { style: iconStyles });
    return <Icon style={iconStyles} />;
  };

  return (
    <div style={wrapStyles} role="listbox" className="yoopta-action-menu-list-content">
      <div className="yoo-action-menu-max-h-[300px] yoo-action-menu-overflow-y-auto yoo-action-menu-overflow-x-hidden">
        <div
          {...getRootProps()}
          className="yoo-action-menu-overflow-hidden yoo-action-menu-p-0 yoo-action-menu-text-foreground"
        >
          {empty && (
            <div className="yoo-action-menu-text-left yoo-action-menu-text-muted-foreground yoo-action-menu-text-xs yoo-action-menu-px-1 yoo-action-menu-py-1">
              {editor.getLabelText('tools.actionMenu.noActionsAvailable') || 'No actions available'}
            </div>
          )}
          {actions.map((action) => {
            const block = editor.blocks[action.type];

            if (!block) return null;

            const title =
              editor.getLabelText(`plugins.${block.type}.display.title`) || block.options?.display?.title || block.type;
            const description =
              editor.getLabelText(`plugins.${block.type}.display.description`) ||
              block.options?.display?.description ||
              '';
            const Icon = action.icon || DEFAULT_ICONS_MAP[action.type];

            return (
              <button
                type="button"
                key={action.type}
                {...getItemProps(action.type)}
                className="yoopta-button yoo-action-menu-flex yoo-action-menu-w-full yoo-action-menu-cursor-pointer yoo-action-menu-items-center yoo-action-menu-space-x-2 yoo-action-menu-rounded-md yoo-action-menu-px-1 yoo-action-menu-py-1 yoo-action-menu-mb-0.5 last:yoo-action-menu-mb-0 yoo-action-menu-text-left yoo-action-menu-text-sm hover:yoo-action-menu-bg-[#f4f4f5] aria-selected:yoo-action-menu-bg-[#f0f0f0]"
              >
                <div
                  style={iconWrapStyles}
                  className="yoo-action-menu-flex yoo-action-menu-h-[40px] yoo-action-menu-w-[40px] yoo-action-menu-items-center yoo-action-menu-justify-center yoo-action-menu-rounded-md yoo-action-menu-border yoo-action-menu-border-solid yoo-action-menu-border-[#e5e7eb] yoo-action-menu-bg-[#FFFFFF]"
                >
                  {renderIcon(Icon)}
                </div>
                <div>
                  <div className="yoo-action-menu-font-medium">{title}</div>
                  {!isViewSmall && (
                    <div className="yoo-action-menu-text-xs yoo-action-menu-text-muted-foreground yoo-action-menu-truncate yoo-action-menu-text-ellipsis yoo-action-menu-max-w-[200px]">
                      {description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { DefaultActionMenuRender };
