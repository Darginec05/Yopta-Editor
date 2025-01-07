import YooptaEditor, {
  createYooptaEditor,
  YooptaOnChangeOptions,
  YooEditor,
  YooptaContentValue,
  YooptaPath,
} from '@yoopta/editor';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';

const EDITOR_STYLE = {
  width: 750,
};

const data = {
  '1e909985-9884-4a43-af3c-6aeb85434645': {
    id: '1e909985-9884-4a43-af3c-6aeb85434645',
    type: 'Paragraph',
    value: [
      {
        id: '1645bad8-be71-4b1e-9dda-6bfaefe12228',
        type: 'paragraph',
        children: [
          {
            text: '👋',
          },
          {
            text: ' ',
          },
          {
            text: 'We’ve returned with the Medium Newsletter',
            bold: true,
          },
          {
            text: '\n',
            bold: true,
          },
          {
            text: 'Issue #187: analyzing tech layoffs and observing without absorbing',
            italic: true,
          },
          {
            text: '\n',
            italic: true,
          },
          {
            text: 'By',
            italic: true,
          },
          {
            text: ' ',
            italic: true,
          },
          {
            id: 'b95e3bc1-3f17-4434-acc8-9cc37158d177',
            type: 'link',
            props: {
              url: 'https://medium.com/u/7428661d5cfd?source=post_page-----917d3fb90711--------------------------------',
              target: '_blank',
              rel: 'noopener',
              title: 'Harris Sockel',
              nodeType: 'inline',
            },
            children: [
              {
                italic: true,
                text: 'Harris Sockel',
              },
            ],
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 0,
    },
  },
  'cd0d307a-28aa-432a-a454-b53bc2387898': {
    id: 'cd0d307a-28aa-432a-a454-b53bc2387898',
    type: 'Paragraph',
    value: [
      {
        id: '3457e8c0-a6cf-4a9c-a443-a4bc9b9f5e52',
        type: 'paragraph',
        children: [
          {
            text: '“I awoke about 2 a.m. the night of the storm to the sound of small explosions in the street,” writes Asheville resident',
          },
          {
            text: ' ',
          },
          {
            id: '27d9e455-6e30-49c0-8dce-c92ccad2d66d',
            type: 'link',
            props: {
              url: 'https://medium.com/u/2c55fbba6368?source=post_page-----917d3fb90711--------------------------------',
              target: '_blank',
              rel: 'noopener',
              title: 'Doug Brown',
              nodeType: 'inline',
            },
            children: [
              {
                text: 'Doug Brown',
              },
            ],
          },
          {
            text: ' ',
          },
          {
            text: 'in a',
          },
          {
            id: '74b96563-849e-4ddf-960d-3c115d9f43fc',
            type: 'link',
            props: {
              url: 'https://medium.com/the-narrative-arc/my-hurricane-helene-strength-training-program-2896fbec15ad?sk=v2%2Fbfe9a41d-a077-4c1f-8b38-519263f1f047',
              target: '_blank',
              rel: 'noopener',
              title: ' story',
              nodeType: 'inline',
            },
            children: [
              {
                text: ' ',
              },
              {
                text: 'story',
              },
            ],
          },
          {
            text: ' ',
          },
          {
            text: 'about life after Hurricane Helene. “My room kept lighting up in odd colors. I looked out the window and saw sparks flying in all directions in iridescent blues and greens. It would have been beautiful if it were not terrifying.”',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 1,
    },
  },
  '13644386-bac1-4a0a-97ed-b77ba11d3617': {
    id: '13644386-bac1-4a0a-97ed-b77ba11d3617',
    type: 'Paragraph',
    value: [
      {
        id: '196f2674-c3aa-4bf0-8889-9da048b6d6bf',
        type: 'paragraph',
        children: [
          {
            text: 'Almost',
          },
          {
            text: ' ',
          },
          {
            id: 'f1cc025c-e49f-45d1-9156-dedaa382b65b',
            type: 'link',
            props: {
              url: 'https://www.axios.com/local/raleigh/2024/10/15/nearly-100-people-still-unaccounted-for-in-north-carolina-following-helene',
              target: '_blank',
              rel: 'noopener ugc nofollow',
              title: '100 people are missing',
              nodeType: 'inline',
            },
            children: [
              {
                text: '100 people are missing',
              },
            ],
          },
          {
            text: ' ',
          },
          {
            text: 'in North Carolina. Entire towns,',
          },
          {
            text: ' ',
          },
          {
            id: '35212c50-07d4-4852-bf77-e013d1d0bbce',
            type: 'link',
            props: {
              url: 'https://www.npr.org/sections/the-picture-show/2024/10/02/g-s1-25941/north-carolina-marshall-hot-springs-helene-cleanup',
              target: '_blank',
              rel: 'noopener ugc nofollow',
              title: 'like Marshall',
              nodeType: 'inline',
            },
            children: [
              {
                text: 'like Marshall',
              },
            ],
          },
          {
            text: ', were underwater. Brown and his neighbors still don’t have running water, and when the water does come back they’ll need to boil it. For now, they’re lining up with buckets every few days:',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 3,
    },
  },
  '8553fcf0-6b35-4ec0-896e-71bdd83d66d4': {
    id: '8553fcf0-6b35-4ec0-896e-71bdd83d66d4',
    type: 'Blockquote',
    value: [
      {
        id: '8eeebf32-27df-49a8-8758-28466b5a451e',
        type: 'blockquote',
        children: [
          {
            text: 'I wash myself with a washcloth and splash rubbing alcohol in my armpits, and dream of the day when I can take a shower again. Asheville is kind of a hippie town, but as my friend Molly puts it, “We’re all hippies now.”',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 4,
    },
  },
  '7b9ce3e9-63ef-45fd-8631-1d88f2ab0ce8': {
    id: '7b9ce3e9-63ef-45fd-8631-1d88f2ab0ce8',
    type: 'Paragraph',
    value: [
      {
        id: 'e55093ba-7201-43b9-b298-2a8a309cd729',
        type: 'paragraph',
        children: [
          {
            text: 'Brown’s story is more human than anything I’ve read about this disaster so far. It makes me feel like I’m there. It’s also an inspiring tribute to humans’ ability to simply keep going when faced with ambiguity, change, and hardship. “Our grief is real,” Brown writes. “But so is our strength.”',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 5,
    },
  },
  '658a6bd7-84d6-47bc-a8b6-049d2b704a5a': {
    id: '658a6bd7-84d6-47bc-a8b6-049d2b704a5a',
    type: 'HeadingOne',
    value: [
      {
        id: 'a3cd2fb8-29d1-4f5c-8a68-5d3850367202',
        type: 'heading-one',
        children: [
          {
            text: 'One more story: analyzing tech layoffs',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 7,
    },
  },
  '2a05404e-be25-45ed-8164-72aa3c73004e': {
    id: '2a05404e-be25-45ed-8164-72aa3c73004e',
    type: 'Paragraph',
    value: [
      {
        id: 'ef4b1be1-75b8-470e-a343-76c6ce95e047',
        type: 'paragraph',
        children: [
          {
            text: 'Tech’s been in the midst of',
          },
          {
            text: ' ',
          },
          {
            id: '476466d7-b137-4d94-8c87-5833a6295fa1',
            type: 'link',
            props: {
              url: 'https://www.forbes.com/sites/emilsayegh/2024/08/19/the-great-tech-reset-unpacking-the-layoff-surge-of-2024/',
              target: '_blank',
              rel: 'noopener ugc nofollow',
              title: 'a recession',
              nodeType: 'inline',
            },
            children: [
              {
                text: 'a recession',
              },
            ],
          },
          {
            text: ' ',
          },
          {
            text: 'since the pandemic: According to',
          },
          {
            text: ' ',
          },
          {
            id: '983df9e2-5703-4bf1-b962-1878a42852dd',
            type: 'link',
            props: {
              url: 'https://layoffs.fyi/',
              target: '_blank',
              rel: 'noopener ugc nofollow',
              title: 'layoffs.fyi',
              nodeType: 'inline',
            },
            children: [
              {
                text: 'layoffs.fyi',
              },
            ],
          },
          {
            text: ', 470 tech companies laid off 141,000 employees in 2024. Those numbers are a bit better than what we saw in 2023 (264K layoffs total), so maybe we’re heading toward brighter days… but it’s unclear.',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 8,
    },
  },
  '05c71273-3a54-434f-b898-d03c3d677b92': {
    id: '05c71273-3a54-434f-b898-d03c3d677b92',
    type: 'Paragraph',
    value: [
      {
        id: 'ce8140a2-6e31-4f76-88a8-dfaf277151a2',
        type: 'paragraph',
        children: [
          {
            text: 'Analytics and experimentation director',
          },
          {
            text: ' ',
          },
          {
            id: '1bc11372-e446-4211-a6de-5850565a5599',
            type: 'link',
            props: {
              url: 'https://medium.com/u/9f03ad274fc9?source=post_page-----917d3fb90711--------------------------------',
              target: '_blank',
              rel: 'noopener',
              title: 'Bhavik Patel',
              nodeType: 'inline',
            },
            children: [
              {
                text: 'Bhavik Patel',
              },
            ],
          },
          {
            text: ' ',
          },
          {
            id: '1d7fec86-e06a-4fa6-bb97-b26ea3e956d9',
            type: 'link',
            props: {
              url: 'https://productcoalition.com/analysing-tech-layoffs-c67d7de2d630?sk=v2%2F4b54f1dc-d0bf-4893-97a4-0cb1af48da51',
              target: '_blank',
              rel: 'noopener ugc nofollow',
              title: 'analyzed a dataset of 2,800 layoffs',
              nodeType: 'inline',
            },
            children: [
              {
                text: 'analyzed a dataset of 2,800 layoffs',
              },
            ],
          },
          {
            text: ' ',
          },
          {
            text: 'and tried to — as objectively as possible — figure out which roles have been impacted most. He found that product and design roles are more likely to be impacted than roles in engineering or data analytics:',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 9,
    },
  },
  'd39aee72-6962-4fad-993a-44c238f38bfb': {
    id: 'd39aee72-6962-4fad-993a-44c238f38bfb',
    type: 'HeadingOne',
    value: [
      {
        id: '1c3f5b12-7e11-4569-bfeb-ce677af0e2aa',
        type: 'heading-one',
        children: [
          {
            text: 'Your daily dose of practical wisdom',
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 10,
    },
  },
  '8bd49616-ca7d-42a6-a94f-5e9426104d43': {
    id: '8bd49616-ca7d-42a6-a94f-5e9426104d43',
    type: 'Paragraph',
    value: [
      {
        id: 'b24b76ac-104c-46fd-b6ac-a199420e4940',
        type: 'paragraph',
        children: [
          {
            text: 'Observe but',
          },
          {
            text: ' ',
          },
          {
            id: '38dcabf8-4b45-40b5-ae44-707bcf706400',
            type: 'link',
            props: {
              url: 'https://medium.com/@lynwrites_/the-art-of-observing-and-not-absorbing-f1b1e8e0edea',
              target: '_blank',
              rel: 'noopener',
              title: 'don’t absorb',
              nodeType: 'inline',
            },
            children: [
              {
                text: 'don’t absorb',
              },
            ],
          },
          {
            text: '.',
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 11,
    },
  },
  '2d1864ca-b07f-48af-99bb-c586d5a323a4': {
    id: '2d1864ca-b07f-48af-99bb-c586d5a323a4',
    type: 'Paragraph',
    value: [
      {
        id: '1190c5be-0806-4dc9-8cda-c449c9eac6e0',
        type: 'paragraph',
        children: [
          {
            text: 'Deepen your understanding every day with the Medium Newsletter.',
            italic: true,
          },
          {
            text: ' ',
            italic: true,
          },
          {
            id: '7dc2478c-257c-4904-be16-7f3cbef0adf0',
            type: 'link',
            props: {
              url: 'https://medium.com/blog/newsletters/medium-daily-edition',
              target: '_blank',
              rel: 'noopener',
              title: 'Sign up here',
              nodeType: 'inline',
            },
            children: [
              {
                italic: true,
                text: 'Sign up here',
              },
            ],
          },
          {
            text: '.',
            italic: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 12,
    },
  },
  'f18c857a-5d46-43c5-9340-91851ff117a9': {
    id: 'f18c857a-5d46-43c5-9340-91851ff117a9',
    type: 'Paragraph',
    value: [
      {
        id: '4074ac21-06f5-414a-8f8a-8a255c2f5f91',
        type: 'paragraph',
        children: [
          {
            text: 'Edited and produced by',
            italic: true,
          },
          {
            text: ' ',
            italic: true,
          },
          {
            id: '12331781-e152-4d8a-a57d-850875a156b6',
            type: 'link',
            props: {
              url: 'https://medium.com/u/11ba4fd53be0?source=post_page-----917d3fb90711--------------------------------',
              target: '_blank',
              rel: 'noopener',
              title: 'Scott Lamb',
              nodeType: 'inline',
            },
            children: [
              {
                italic: true,
                text: 'Scott Lamb',
              },
            ],
          },
          {
            text: ' ',
            italic: true,
          },
          {
            text: '&',
            italic: true,
          },
          {
            text: ' ',
            italic: true,
          },
          {
            id: '762be1c6-57b3-4342-bcf5-54c11dcdde18',
            type: 'link',
            props: {
              url: 'https://medium.com/u/3c6a3fa3a112?source=post_page-----917d3fb90711--------------------------------',
              target: '_blank',
              rel: 'noopener',
              title: 'Carly Rose Gillis',
              nodeType: 'inline',
            },
            children: [
              {
                italic: true,
                text: 'Carly Rose Gillis',
              },
            ],
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 13,
    },
  },
  'ce68a7e4-4692-45cd-b9d4-37434ac1970c': {
    id: 'ce68a7e4-4692-45cd-b9d4-37434ac1970c',
    type: 'Paragraph',
    value: [
      {
        id: 'cbe311f6-47ba-4ab3-bb77-c8e7ad21ed15',
        type: 'paragraph',
        children: [
          {
            text: 'Questions, feedback, or story suggestions? Email us:',
            italic: true,
          },
          {
            text: ' ',
            italic: true,
          },
          {
            id: 'd6631a7e-77c6-40fb-ac6d-52d41a48d892',
            type: 'link',
            props: {
              url: 'mailto:tips@medium.com',
              target: '_blank',
              rel: 'noopener ugc nofollow',
              title: 'tips@medium.com',
              nodeType: 'inline',
            },
            children: [
              {
                italic: true,
                text: 'tips@medium.com',
              },
            ],
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 14,
    },
  },
  '7025b887-a746-42dd-9d37-56253dce4e96': {
    id: '7025b887-a746-42dd-9d37-56253dce4e96',
    type: 'Paragraph',
    value: [
      {
        id: 'e46ac801-0bc2-455a-9138-ef5e141e4845',
        type: 'paragraph',
        children: [
          {
            text: 'Read without limits or ads, fund great writers, and join a community that believes in human storytelling with',
            italic: true,
            bold: true,
          },
          {
            text: ' ',
            italic: true,
            bold: true,
          },
          {
            id: '19554e2b-180a-461e-b287-98416f7f30d4',
            type: 'link',
            props: {
              url: 'https://medium.com/membership',
              target: '_blank',
              rel: 'noopener',
              title: 'membership',
              nodeType: 'inline',
            },
            children: [
              {
                bold: true,
                italic: true,
                text: 'membership',
              },
            ],
          },
          {
            text: '.',
            italic: true,
            bold: true,
          },
        ],
        props: {
          nodeType: 'block',
        },
      },
    ],
    meta: {
      align: 'left',
      depth: 0,
      order: 15,
    },
  },
  '4f6904fb-218a-4936-8cf5-c79977c7507d': {
    id: '4f6904fb-218a-4936-8cf5-c79977c7507d',
    type: 'Image',
    meta: {
      align: 'center',
      depth: 0,
      order: 6,
    },
    value: [
      {
        id: '64c3ca6e-c2c0-4ddd-8d01-2b9eab9d82b6',
        type: 'image',
        props: {
          src: 'https://res.cloudinary.com/ench-app/image/upload/v1729177867/Screenshot_2024-10-16_at_20.19.51_px95za.png',
          srcSet: null,
          bgColor: null,
          fit: 'contain',
          sizes: {
            width: 360,
            height: 360,
          },
          nodeType: 'void',
        },
        children: [
          {
            text: '',
          },
        ],
      },
    ],
  },
  'cebaef69-b9e3-40da-9a5d-95d04833b4bd': {
    id: 'cebaef69-b9e3-40da-9a5d-95d04833b4bd',
    type: 'Code',
    meta: {
      align: 'left',
      depth: 0,
      order: 2,
    },
    value: [
      {
        id: '79113023-1cb0-465b-8bea-f912606326f5',
        type: 'code',
        props: {
          nodeType: 'void',
          language: 'javascript',
          theme: 'GithubDark',
        },
        children: [
          {
            text: " const nextParentPathIndex = parentPath[0] + 1;\n    const nextBlockSlateValue = slate.children[nextParentPathIndex] as SlateElement;\n\n    Transforms.removeNodes(slate, {\n      at: [nextParentPathIndex],\n      match: (n) => Element.isElement(n),\n      mode: 'highest',\n    });\n\n    operations.push({\n      type: 'split_block',\n      prevProperties: blockToSplit,\n      properties: nextNewBlock,\n      slate: newSlate,\n    });\n}",
          },
        ],
      },
    ],
  },
};

const BasicExample = () => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue>(data);

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    console.log('onChange', value, options);
    setValue(value);
  };

  const onPathChange = (path: YooptaPath) => {};

  // useEffect(() => {
  //   editor.withoutSavingHistory(() => {
  //     const id = generateId();

  //     editor.setEditorValue(data as YooptaContentValue);
  //     editor.focusBlock(id);
  //   });
  // }, []);

  return (
    <>
      <div className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col items-center" ref={selectionRef}>
        <FixedToolbar editor={editor} DEFAULT_DATA={data}/>
        <YooptaEditor
            editor={editor}
            plugins={YOOPTA_PLUGINS}
            selectionBoxRoot={selectionRef}
            marks={MARKS}
            autoFocus={true}
            readOnly={false}
            tools={TOOLS}
            style={EDITOR_STYLE}
            value={value}
            onChange={onChange}
            onPathChange={onPathChange}
        />
      </div>
    </>
  );
};

export default BasicExample;
