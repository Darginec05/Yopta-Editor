import withBaseFullSetup from '@/components/examples/withBaseFullSetup';
// import withCustomComponent from '@/components/examples';
// import withOffline from '@/components/examples/withOffline';
// import { CheckSourceCode } from '@/components/CheckSourceCode/CheckSourceCode';
import withExports from '@/components/examples/withExports';
// import withCustomHTMLAttributes from '@/components/examples/withCustomHTMLAttributes';
import withCustomMark from '@/components/examples/withCustomMark';
import withCustomPlugin from '@/components/examples/withCustomPlugin';
import withCustomToolbar from '@/components/examples/withCustomToolbar';
import withDarkTheme from '@/components/examples/withDarkTheme';
import withExtendedPlugin from '@/components/examples/withExtendedPlugin';
import withMediaAndVoids from '@/components/examples/withMediaAndVoids';
import withNotionActionMenu from '@/components/examples/withNotionActionMenu';
import withReadOnly from '@/components/examples/withReadOnly';
import withSavingToDatabase from '@/components/examples/withSavingToDatabase';
import withLargeDocuments from '@/components/examples/withLargeDocuments';
import withChatSlack from '@/components/examples/withChatSlack';
import withCustomStyles from '@/components/examples/withCustomStyles';
import withCustomRenders from '@/components/examples/withCustomRenders';
import withMultiPageEditors from '@/components/examples/withMultiPageEditors';
import withCustomElementProps from '@/components/examples/withCustomElementProps';
import withCommandsAPI from '@/components/examples/withCommandsAPI';
import withPluginEvents from '@/components/examples/withPluginEvents';
import withShadcnUILibrary from '@/components/examples/withShadcnUILibrary';
import withEditorHistory from '@/components/examples/withEditorHistory';
import withEditorOperations from '@/components/examples/withEditorOperations';
import withEmailBuilder from '@/components/examples/withEmailBuilder';
import withTranslations from '@/components/examples/withTranslations';
// import withCraftExample from '@/components/examples/withCraftExample';
// import withEditorFocusBlur from '@/components/examples/withEditorFocusBlur';
// import withStarterKit from '@/components/examples/withStarterKit';

import { Head } from '@/components/Head/Head';
import { useRouter } from 'next/router';
import { ClientOnly } from '@/components/ClientOnly/ClientOnly';
import { CheckSourceCode } from '@/components/CheckSourceCode/CheckSourceCode';
import dynamic from 'next/dynamic';

const Sheet = dynamic(() => import('@/components/ui/sheet').then((mod) => mod.Sheet), { ssr: false });

export const EXAMPLES: Record<string, () => React.JSX.Element> = {
  withBaseFullSetup,
  withCustomToolbar,
  withNotionActionMenu,
  withExports,
  withEditorHistory,
  withEmailBuilder,
  withEditorOperations,
  withCommandsAPI,
  withPluginEvents,
  withShadcnUILibrary,
  withCustomRenders,
  withCustomElementProps,
  withExtendedPlugin,
  withMultiPageEditors,
  withChatSlack,
  withDarkTheme,
  withMediaAndVoids,
  withReadOnly,
  withCustomMark,
  withCustomPlugin,
  withSavingToDatabase,
  withCustomStyles,
  withLargeDocuments,
  withTranslations
  // withStarterKit,
  // withCustomHTMLAttributes,
  // withEditorFocusBlur,
  // withCraftExample,
  // withOffline,
  // withCustomComponent,
};

const EXAMPLE_MAP: Record<keyof typeof EXAMPLES, any> = {
  withBaseFullSetup: {
    title: 'All-in example',
    description: '',
  },
  withCustomToolbar: {
    title: 'Custom Toolbar',
    description: '',
  },
  withNotionActionMenu: {
    title: 'Notion Action Menu',
    description: '',
  },
  withDarkTheme: {
    title: 'Dark Theme',
    description: '',
  },
  withMediaAndVoids: {
    title: 'Media and voids',
    description: '',
  },
  withExtendedPlugin: {
    title: 'Extended Plugin',
    description: '',
  },
  withReadOnly: {
    title: 'Read Only',
    description: '',
  },
  withCustomMark: {
    title: 'Custom Mark',
    description: '',
  },
  withCustomPlugin: {
    title: 'Custom Plugin',
    description: '',
  },
  withMultiPageEditors: {
    title: 'Multi Page Editors',
    description: '',
  },
  // withCustomHTMLAttributes: {
  //   title: 'Custom HTML Attributes',
  //   description: '',
  // },
  withSavingToDatabase: {
    title: 'Saving to Database',
    description: '',
  },
  withCustomStyles: {
    title: 'Custom Styles',
    description: '',
  },
  withLargeDocuments: {
    title: 'Large Documents',
    description: '',
  },
  withChatSlack: {
    title: 'Chat Slack',
    description: '',
  },
  withShadcnUILibrary: {
    title: 'UI Libraries (shadcn/ui)',
    description: '',
  },
  // withCraftExample: {
  //   title: 'Craft Example',
  //   description: '',
  // },
  withMigrationGuide: {
    title: 'Migration Guide from v2 to v4',
    description: '',
  },
  // withEditorFocusBlur: {
  //   title: 'Example with focus/blur',
  //   description: '',
  // },
  withExports: {
    title: 'HTML/Markdown exports',
    description: '',
  },
  withCustomRenders: {
    title: 'Custom Renders (next/image, next/link, etc.)',
    description: '',
  },
  withCustomElementProps: {
    title: 'Override element props',
    description: '',
  },
  withStarterKit: {
    title: 'Using Starter Kit with full setup',
    description: '',
  },
  withCommandsAPI: {
    title: 'Editor Commands API',
    description: '',
  },
  withPluginEvents: {
    title: 'Plugin Events',
    description: '',
  },
  withSlateExtensions: {
    title: 'Customize plugin elements behaviour',
    description: '',
  },
  withEditorHistory: {
    title: 'History API: Undo/Redo',
    description: '',
  },
  withEditorOperations: {
    title: 'Core: Editor Operations',
    description: '',
  },
  withEmailBuilder: {
    title: 'Meet Email-Builder based on Yoopta! (new)',
    description: '',
  },
  withTranslations: {
    title: 'Add translations (new)',
    description: '',
  },
};

const ExampleComponentPage = () => {
  const router = useRouter();

  const ExampleComponent = EXAMPLES[(router.query.example as string) || 'withBaseFullSetup'];
  const exampleList = Object.keys(EXAMPLES).map((key) => ({
    id: key,
    title: EXAMPLE_MAP[key].title,
    description: EXAMPLE_MAP[key].description,
    href: `/examples/${key}`,
  }));

  return (
    <div>
      <Head />
      <CheckSourceCode example={router.query.example as string} />
      <ExampleComponent />
      <ClientOnly>
        <Sheet items={exampleList} path={router.asPath} />
      </ClientOnly>
    </div>
  );
};

export default ExampleComponentPage;
