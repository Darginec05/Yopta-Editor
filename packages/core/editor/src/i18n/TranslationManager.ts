import {defaultLocales} from './locales';
import {NestedTranslations, Translations} from './types';

type Listener = () => void;

class TranslationManager {
    private static instance: TranslationManager;
    private translations: Translations = defaultLocales;
    private currentLanguage: string = 'en';
    private userOverrides: Translations = {};
    private listeners: Listener[] = [];

    static getInstance(): TranslationManager {
        if (!TranslationManager.instance) {
            this.instance = new TranslationManager();
        }
        return this.instance;
    }

    /**
     * Add translations for a specific namespace and language.
     */
    addTranslations(language: string, namespace: string, newTranslations: NestedTranslations): void {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }

        if (!this.translations[language][namespace]) {
            this.translations[language][namespace] = {};
        }

        this.translations[language][namespace] = {
            ...this.translations[language][namespace],
            ...newTranslations,
        };
    }

    /**
     * Fetch a translation for a specific key.
     */
    translate(key: string): string {
        const [namespace, ...rest] = key.split('.');

        // Helper function to safely access nested translations
        const getNestedValue = (obj: any, keyPath: string[]): any => {
            return keyPath.reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), obj);
        };

        const resolvedTranslation =
            getNestedValue(this.userOverrides?.[this.currentLanguage]?.[namespace], rest) ??
            getNestedValue(this.translations?.[this.currentLanguage]?.[namespace], rest);

        return typeof resolvedTranslation === 'string' ? resolvedTranslation : key;
    }

    /**
     * Set the current language and notify listeners.
     */
    setLanguage(language: string): void {
        if (this.translations[language]) {
            this.currentLanguage = language;
            this.notifyListeners();
        } else {
            console.warn(`Language ${language} not found. Falling back to ${this.currentLanguage}.`);
        }
    }

    /**
     * Get the current language.
     */
    getCurrentLanguage(): string {
        return this.currentLanguage;
    }

    /**
     * Fetch all available keys for the current language.
     */
    getAvailableKeys(): Record<string, string[]> {
        const availableKeys: Record<string, string[]> = {};
        const langTranslations = this.translations[this.currentLanguage] || {};

        Object.entries(langTranslations).forEach(([namespace, keys]) => {
            availableKeys[namespace] = Object.keys(keys);
        });

        return availableKeys;
    }

    /**
     * Subscribe to language changes.
     */
    subscribe(listener: Listener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    /**
     * Notify all listeners about language changes.
     */
    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener());
    }
}

export const YooptaTranslationManager = TranslationManager.getInstance();
