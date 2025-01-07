import { Blocks, Elements, YooptaPlugin, buildBlockElementsStructure, serializeTextNodes } from '@yoopta/editor';
import { AccordionElementMap } from '../types';
import { AccordionList } from '../renders/AccordionList';
import { AccordionListItem } from '../renders/AccordionListItem';
import { AccordionItemHeading } from '../renders/AccordionItemHeading';
import { AccordionItemContent } from '../renders/AccordionItemContent';
import { Transforms } from 'slate';
import { ListCollapse } from 'lucide-react';
import { AccordionCommands } from '../commands';
import {defaultLocales} from '../locales';

const ACCORDION_ELEMENTS = {
  AccordionList: 'accordion-list',
  AccordionListItem: 'accordion-list-item',
  AccordionListItemHeading: 'accordion-list-item-heading',
  AccordionListItemContent: 'accordion-list-item-content',
};

const Accordion = new YooptaPlugin<AccordionElementMap>({
  type: 'Accordion',
  elements: {
    'accordion-list': {
      asRoot: true,
      render: AccordionList,
      children: ['accordion-list-item'],
    },
    'accordion-list-item': {
      render: AccordionListItem,
      children: ['accordion-list-item-heading', 'accordion-list-item-content'],
      props: { isExpanded: true },
    },
    'accordion-list-item-heading': {
      render: AccordionItemHeading,
    },
    'accordion-list-item-content': {
      render: AccordionItemContent,
    },
  },
  commands: AccordionCommands,
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        if (hotkeys.isBackspace(event)) {
          if (!slate.selection) return;

          const listItems = Elements.getElementChildren(editor, currentBlock.id, { type: 'accordion-list' });
          const accordionListItemEntry = Elements.getElementEntry(editor, currentBlock.id, {
            path: slate.selection,
            type: 'accordion-list-item',
          });

          const listItemChildPath = accordionListItemEntry?.[1] || slate.selection.anchor.path;
          const currentElement = Elements.getElement(editor, currentBlock.id);

          const isHeadingEmpty = Elements.isElementEmpty(editor, currentBlock.id, {
            type: 'accordion-list-item-heading',
            path: listItemChildPath,
          });

          const isContentEmpty = Elements.isElementEmpty(editor, currentBlock.id, {
            type: 'accordion-list-item-content',
            path: listItemChildPath,
          });

          if (isContentEmpty && currentElement?.type === ACCORDION_ELEMENTS.AccordionListItemContent) {
            event.preventDefault();
            return;
          }

          if (isHeadingEmpty && currentElement?.type === ACCORDION_ELEMENTS.AccordionListItemHeading) {
            event.preventDefault();

            if (listItems?.length === 1) {
              Blocks.deleteBlock(editor, { blockId: currentBlock.id });
              return;
            }

            if (accordionListItemEntry) {
              const [, listItemPath] = accordionListItemEntry;

              Elements.deleteElement(editor, currentBlock.id, {
                type: 'accordion-list-item',
                path: listItemPath,
              });
            }
          }
        }

        if (hotkeys.isSelect(event)) {
          event.preventDefault();

          if (slate.selection) {
            Transforms.select(slate, slate.selection.anchor.path.slice(0, -1));
          }

          return;
        }

        if (hotkeys.isEnter(event)) {
          event.preventDefault();

          const currentElement = Elements.getElement(editor, currentBlock.id);
          const listItemEntry = Elements.getElementEntry(editor, currentBlock.id, { type: 'accordion-list-item' });

          if (currentElement?.type === ACCORDION_ELEMENTS.AccordionListItemHeading && listItemEntry) {
            const [listItem, listItemPath] = listItemEntry;

            Elements.updateElement(
              editor,
              currentBlock.id,
              {
                type: ACCORDION_ELEMENTS.AccordionListItem,
                props: {
                  isExpanded: !listItem?.props?.isExpanded,
                },
              },
              { path: listItemPath },
            );

            return;
          }

          Elements.createElement(
            editor,
            currentBlock.id,
            { type: 'accordion-list-item', props: { isExpanded: true } },
            { path: 'next', focus: true, split: false },
          );
        }
      };
    },
  },
  options: {
    display: {
      title: 'Accordion',
      description: 'Create collapses',
      icon: <ListCollapse size={24} />,
    },
    shortcuts: ['accordion'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['DETAILS'],
        parse: (el, editor) => {
          if (el.nodeName === 'DETAILS') {
            const summary = el.querySelector('summary');
            const p = el.querySelector('p');
            const elementsStructure = buildBlockElementsStructure(editor, 'Accordion', {
              [ACCORDION_ELEMENTS.AccordionListItemHeading]: summary?.textContent || '',
              [ACCORDION_ELEMENTS.AccordionListItemContent]: p?.textContent || '',
            });

            return elementsStructure;
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `<div>${element.children
          .map((listItem) => {
            return `<details data-meta-align="${align}" data-meta-depth="${depth}">${listItem.children
              .map((item) => {
                if (item.type === 'accordion-list-item-heading') {
                  return `<summary>${serializeTextNodes(item.children)}</summary>`;
                }
                return `<p>${serializeTextNodes(item.children)}</p>`;
              })
              .join('')}</details>`;
          })
          .join('')}</div>`;
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `
          <table data-meta-align="${align}" data-meta-depth="${depth}" style="width: 100%; border-collapse: collapse; margin-left: ${depth}px;">
            <tbody>
              ${element.children
                .map((listItem) =>
                  listItem.children
                    .map((item) => {
                      if (item.type === 'accordion-list-item-heading') {
                        return `
                          <tr>
                            <td style="
                                border-radius: 0;
                                border-width: 0;
                                cursor: pointer;
                                font-size: 1rem;
                                font-weight: 500;
                                line-height: 1.5rem;
                                margin-bottom: 0;
                                padding-bottom: 1rem;
                                padding-right: 2rem;
                                padding-top: 1rem;
                                position: relative;
                                width: 100%;
                              ">
                              ${serializeTextNodes(item.children)}
                              <span style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);">
                                <svg viewbox="0 0 30 30" style="width: 12px; height: 100%;"><polygon points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7"></polygon></svg>
                              </span>
                            </td>
                          </tr>`;
                      }
                      return `
                        <tr>
                          <td style="padding-bottom: 1rem; border-bottom: 1px solid #EFEFEE; font-size: .875rem; line-height: 1.25rem; overflow: hidden;">
                            ${serializeTextNodes(item.children)}
                          </td>
                        </tr>`;
                    })
                    .join(''),
                )
                .join('')}
            </tbody>
          </table>`;
      },
    },
  },
  translations: defaultLocales,
});

export { Accordion };
