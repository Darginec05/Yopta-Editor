import { YooptaBaseElement, Modify } from '@yoopta/editor';

export type EmbedPluginOptions = {
  maxWidth?: number;
  maxHeight?: number;
};

export type EmbedElementData = {
  size: { width: number | 'auto'; height: number | 'auto' };
  url: string | null | undefined;
  provider?: SupporedEmbedProviders | null;
  providerId: string | null;
};

export type EmbedElement = Modify<YooptaBaseElement<'embed'>, { data: EmbedElementData }>;

export type SupporedEmbedProviders = 'youtube' | 'vimeo' | 'dailymotion' | 'twitter' | 'figma' | string;