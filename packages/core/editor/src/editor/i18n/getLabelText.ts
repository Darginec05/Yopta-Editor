import { DEFAULT_LABEL_TEXT_MAP, LabelKeys } from '../../constants/labels';
import { YooEditor } from '../types';

function getNestedValue(obj: any, path: string[]): string | undefined {
  return path.reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return acc[part];
    }
    return undefined;
  }, obj);
}

export function getLabelText(editor: YooEditor, key: LabelKeys) {
  const keyParts = key.split('.');
  const currentLangValue = getNestedValue(DEFAULT_LABEL_TEXT_MAP, keyParts);
  return currentLangValue || '';
}
