import { HTMLAttributes } from 'react';
import { RenderLeafProps, useSelected } from 'slate-react';
import { ExtendedLeafProps } from '../../plugins/types';
import {useTranslation} from '../../i18n/hooks/useTranslation';

type Props = Pick<ExtendedLeafProps<any, any>, 'attributes' | 'children'> & {
  placeholder?: string;
};

const TextLeaf = ({ children, attributes, placeholder }: Props) => {
  const selected = useSelected();
  const {t} = useTranslation();

  const attrs: HTMLAttributes<HTMLSpanElement> & RenderLeafProps['attributes'] = {
    ...attributes,
  };

  if (selected && placeholder) {
    attrs['data-placeholder'] = t(placeholder);
    attrs.className = `yoopta-placeholder`;
  }

  return <span {...attrs}>{children}</span>;
};

export { TextLeaf };
