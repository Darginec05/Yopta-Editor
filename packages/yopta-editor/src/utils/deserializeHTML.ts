import { Text } from 'slate';
import { jsx } from 'slate-hyperscript';
import { YoptaBaseElement } from '../types';
import { YoptaPluginType } from './plugins';

const TEXT_TAGS = {
  // CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

const deserialize = (
  el: HTMLElement | ChildNode,
  pluginsMap: Record<YoptaBaseElement<string>['type'], YoptaPluginType<any, YoptaBaseElement<string>>>,
) => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = el;
  console.log('nodeName', nodeName);

  let parent = el;

  let children = Array.from(parent.childNodes)
    .map((node) => deserialize(node, pluginsMap))
    .flat();

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (pluginsMap[nodeName]) {
    const plugin = pluginsMap[nodeName];

    if (plugin) {
      let node = plugin.defineElement();

      if (typeof plugin.exports?.html.deserialize.parse === 'function') {
        const data = plugin.exports?.html.deserialize.parse(el as HTMLElement);
        node = { ...node, data };
      }

      return jsx('element', node, children);
    }
  }

  if (Text.isTextList(children)) {
    console.log('children', children);
    return jsx('element', pluginsMap.P.defineElement(), children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    const textNodes = children.map((child) => {
      return Text.isText(child) ? jsx('text', attrs, child) : child;
    });

    console.log('textNodes', textNodes);

    return textNodes;
  }

  return children;
};

export function mergePluginTypesToMapHMTLNodeName(
  plugins: Record<YoptaBaseElement<string>['type'], YoptaPluginType<any, YoptaBaseElement<string>>>,
): Record<YoptaBaseElement<string>['type'], YoptaPluginType<any, YoptaBaseElement<string>>> {
  const PLUGINS_MAP_HTML_NODE_NAMES = {};
  Object.keys(plugins).forEach((pluginKey) => {
    const plugin = plugins[pluginKey];
    if (plugin.exports?.html.deserialize.nodeName) {
      if (Array.isArray(plugin.exports?.html.deserialize.nodeName)) {
        plugin.exports?.html.deserialize.nodeName.forEach((nodeName) => {
          PLUGINS_MAP_HTML_NODE_NAMES[nodeName] = plugin;
        });
        return;
      }

      PLUGINS_MAP_HTML_NODE_NAMES[plugin.exports?.html.deserialize.nodeName] = plugin;
    }
  });
  return PLUGINS_MAP_HTML_NODE_NAMES;
}

export function deserializeHtml(
  htmlString: string,
  plugins: Record<YoptaBaseElement<string>['type'], YoptaPluginType<any, YoptaBaseElement<string>>>,
) {
  const pluginsMap = mergePluginTypesToMapHMTLNodeName(plugins);
  const parsedHtml = new DOMParser().parseFromString(htmlString, 'text/html');
  return deserialize(parsedHtml.body, pluginsMap);
}