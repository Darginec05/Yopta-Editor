export const INITIAL_VALUE = {
  "a3dcc117-7a3a-410f-98fa-8cbf620acebf": {
    "id": "a3dcc117-7a3a-410f-98fa-8cbf620acebf",
    "value": [
      {
        "id": "e3599711-7674-498b-bcba-099b600d6eb3",
        "type": "heading-one",
        "children": [
          {
            "text": "Let's start from lorem ipsum"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "type": "HeadingOne",
    "meta": {
      "order": 0,
      "depth": 0
    }
  },
  "40fb1893-cc80-43c9-9a4c-95ce7ebd0cd8": {
    "id": "40fb1893-cc80-43c9-9a4c-95ce7ebd0cd8",
    "value": [
      {
        "id": "2221b81d-11c3-4160-b40f-6db00a0af5b9",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "type": "Paragraph",
    "meta": {
      "order": 1,
      "depth": 0
    }
  },
  "a98db6b6-496e-40ab-9893-c4778c7f967a": {
    "id": "a98db6b6-496e-40ab-9893-c4778c7f967a",
    "type": "Code",
    "meta": {
      "depth": 0,
      "order": 6
    },
    "value": [
      {
        "id": "c442332d-da41-4359-93f4-bffc445189fe",
        "type": "code",
        "props": {
          "nodeType": "void",
          "language": "javascript",
          "theme": "GithubDark"
        },
        "children": [
          {
            "text": "const translations = {\n  'bro': {\n    core: {\n      editor_placeholder: \"Yo, smash '/' for options, bro!\",\n      save: \"Bro, hit Save\",\n      cancel: \"Nah, cancel it\"\n    },\n    paragraph: {\n      title: \"Type it out, dude...\",\n      description: \"Just some chill text, bro\"\n    },\n    table: {\n      title: \"Table, bro!\",\n      description: \"Lines and boxes, keepin' it organized, my dude.\"\n    }\n};\n\n<YooptaEditor\n  editor={editorInstance}\n  plugins={plugins}\n  translations={translations}\n/>;"
          }
        ]
      }
    ]
  },
  "8c49322d-1e9a-4d1c-8516-f9f563ea2853": {
    "id": "8c49322d-1e9a-4d1c-8516-f9f563ea2853",
    "type": "Paragraph",
    "value": [
      {
        "id": "e20bad2f-5309-485b-871d-ec0aaf319873",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "translations",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "property in"
          },
          {
            "text": " "
          },
          {
            "text": "YooptaEditorProps",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "allows you to provide custom translations for various labels, placeholders, and text elements in the editor. This makes it easy to localize the editor into different languages or customize specific text for your users."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 2
    }
  },
  "863ba1a3-17f7-4547-b9bb-03cda13e5cc7": {
    "id": "863ba1a3-17f7-4547-b9bb-03cda13e5cc7",
    "type": "BulletedList",
    "value": [
      {
        "id": "a55e57ed-9195-4dc0-95b1-a19010fab4c5",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Translations are grouped by "
          },
          {
            "bold": true,
            "text": "languages"
          },
          {
            "text": " (e.g., "
          },
          {
            "code": true,
            "text": "en"
          },
          {
            "text": ", "
          },
          {
            "code": true,
            "text": "es"
          },
          {
            "text": ") and "
          },
          {
            "bold": true,
            "text": "namespaces/plugins"
          },
          {
            "text": " (e.g., "
          },
          {
            "code": true,
            "text": "core"
          },
          {
            "text": ", "
          },
          {
            "code": true,
            "text": "paragraph"
          },
          {
            "text": ")."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 3
    }
  },
  "f684b4a4-0cfb-4a75-ab2b-efeea9265a04": {
    "id": "f684b4a4-0cfb-4a75-ab2b-efeea9265a04",
    "type": "BulletedList",
    "value": [
      {
        "id": "02e71ba2-0cab-44e6-9fc2-cf97703a871b",
        "type": "bulleted-list",
        "children": [
          {
            "text": "You can override default translations or add new languages at initialization."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 4
    }
  },
  "eaea1bc7-813d-4d38-8cc2-081fbf9a2e20": {
    "id": "eaea1bc7-813d-4d38-8cc2-081fbf9a2e20",
    "type": "Paragraph",
    "value": [
      {
        "id": "3beaec7e-72a8-42c0-94c0-8a9fcc5b7315",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "setLanguage",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "function from the"
          },
          {
            "text": " "
          },
          {
            "text": "useTranslation",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "hook allows you to change the language at runtime:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 9
    }
  },
  "5cadd71e-1ad7-4ab0-bc43-3dd6da8527f2": {
    "id": "5cadd71e-1ad7-4ab0-bc43-3dd6da8527f2",
    "type": "Code",
    "value": [
      {
        "children": [
          {
            "text": "import {useTranslation} from '@yoopta-editor/core';\n\nconst { setLanguage } = useTranslation();\n\n// Switch to Spanish\nsetLanguage('bro');"
          }
        ],
        "type": "code",
        "id": "30489325-114b-4294-9e69-99f31120e373",
        "props": {
          "language": "javascript",
          "theme": "VSCode",
          "nodeType": "void"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 10
    }
  },
  "c2a332bc-ab08-42d8-a058-fc751980ae11": {
    "id": "c2a332bc-ab08-42d8-a058-fc751980ae11",
    "type": "HeadingThree",
    "meta": {
      "depth": 0,
      "order": 8
    },
    "value": [
      {
        "id": "4c3b33dd-b042-4e01-b72b-2309ac8533b0",
        "type": "heading-three",
        "props": {
          "nodeType": "block"
        },
        "children": [
          {
            "text": "Changing the Language Dynamically"
          }
        ]
      }
    ]
  },
  "ccbd5d66-0e7b-47f9-9486-5a0bc0e3b2bb": {
    "id": "ccbd5d66-0e7b-47f9-9486-5a0bc0e3b2bb",
    "type": "Paragraph",
    "value": [
      {
        "id": "d981af18-c168-4dc4-b433-96c88f3590ba",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 7
    }
  },
  "36f4b7ca-5bfb-4abf-84a2-168b0f59d0e9": {
    "id": "36f4b7ca-5bfb-4abf-84a2-168b0f59d0e9",
    "type": "BulletedList",
    "value": [
      {
        "id": "255b361e-3ef9-4e00-9917-67e9549da593",
        "type": "bulleted-list",
        "children": [
          {
            "text": "If no translations prop is provided, the editor uses its default translations in English."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      },
      {
        "id": "255b361e-3ef9-4e00-9917-67e9549da593",
        "type": "bulleted-list",
        "props": {
          "nodeType": "block"
        },
        "children": [
          {
            "text": "If a key is missing in the current language, the editor falls back to the key itself (e.g., 'core.save')."
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 5
    }
  },
  "d5477264-0e09-4a8b-8de7-26250d2aaabe": {
    "id": "d5477264-0e09-4a8b-8de7-26250d2aaabe",
    "type": "Paragraph",
    "value": [
      {
        "id": "aa9f258f-ddb5-46b3-a5c3-7e1531435f02",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "getAvailableKeys",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "utility allows you to retrieve all available translation keys for the current language at runtime. This is helpful for:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 13
    }
  },
  "b73f6f07-f01e-4d83-ad10-d06d0408adbf": {
    "id": "b73f6f07-f01e-4d83-ad10-d06d0408adbf",
    "type": "BulletedList",
    "value": [
      {
        "id": "a8c988ba-5aea-4b20-928d-5c1c0598e0b3",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Getting a complete list of keys to customize."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 14
    }
  },
  "6e5020a6-8e33-4b10-b0cf-2834b2453ee9": {
    "id": "6e5020a6-8e33-4b10-b0cf-2834b2453ee9",
    "type": "BulletedList",
    "value": [
      {
        "id": "fae0fdb9-1f8c-406c-a22c-34052c5902ad",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Generating a template for translation."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 15
    }
  },
  "990035fe-8d82-4a50-a1f3-bc726ffcb026": {
    "id": "990035fe-8d82-4a50-a1f3-bc726ffcb026",
    "type": "HeadingThree",
    "meta": {
      "depth": 0,
      "order": 12
    },
    "value": [
      {
        "id": "adee5237-ee78-4a7c-bab9-4eb8cfe929fc",
        "type": "heading-three",
        "props": {
          "nodeType": "block"
        },
        "children": [
          {
            "text": "Using "
          },
          {
            "text": "getAvailableKeys",
            "code": true
          },
          {
            "text": " to Fetch Translation Keys"
          }
        ]
      }
    ]
  },
  "a3ccf244-ad34-4a90-975d-f352454c4bed": {
    "id": "a3ccf244-ad34-4a90-975d-f352454c4bed",
    "type": "Paragraph",
    "value": [
      {
        "id": "3615202d-778d-4a99-8e9d-e9905b17bcbc",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 11
    }
  },
  "bdafc963-4a6f-4ed3-a7bf-8048ff6bf607": {
    "id": "bdafc963-4a6f-4ed3-a7bf-8048ff6bf607",
    "type": "Code",
    "meta": {
      "depth": 0,
      "order": 16
    },
    "value": [
      {
        "id": "c3d018e8-68a6-41af-841c-1987add46055",
        "type": "code",
        "props": {
          "nodeType": "void",
          "language": "javascript",
          "theme": "GithubDark"
        },
        "children": [
          {
            "text": "import { useTranslation } from '@yoopta/editor';\n\nconst TranslationKeysExample = () => {\n  const { getAvailableKeys, currentLanguage } = useTranslation();\n\n  const handleFetchKeys = () => {\n    const keys = getAvailableKeys();\n    console.log('Available Keys:', keys);\n  };\n\n  return (\n    <div>\n      <p>Current Language: {currentLanguage}</p>\n      <button onClick={handleFetchKeys}>Get Available Translation Keys</button>\n    </div>\n  );\n};"
          }
        ]
      }
    ]
  },
  "3071d059-79fa-4327-aaba-e53f00ce4029": {
    "id": "3071d059-79fa-4327-aaba-e53f00ce4029",
    "type": "Paragraph",
    "value": [
      {
        "id": "55b4274b-7454-431a-8917-427ea941f1bc",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 17
    }
  }
}
