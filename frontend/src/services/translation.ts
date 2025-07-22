// DeepSeek Translation Service
export interface TranslationRequest {
  text: string;
  fromLanguage: 'en' | 'my';
  toLanguage: 'en' | 'my';
}

export interface TranslationResponse {
  translatedText: string;
  error?: string;
}

class TranslationService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY || '';
    this.apiUrl = process.env.REACT_APP_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
  }

  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    if (request.fromLanguage === request.toLanguage) {
      return { translatedText: request.text };
    }

    try {
      const prompt = this.buildTranslationPrompt(request);
      
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator specializing in English and Myanmar (Burmese) languages. Provide accurate, contextually appropriate translations. Return only the translated text without explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.choices?.[0]?.message?.content?.trim();

      if (!translatedText) {
        throw new Error('No translation received');
      }

      return { translatedText };
    } catch (error) {
      console.error('Translation error:', error);
      return { 
        translatedText: request.text, 
        error: error instanceof Error ? error.message : 'Translation failed' 
      };
    }
  }

  private buildTranslationPrompt(request: TranslationRequest): string {
    const languageNames = {
      'en': 'English',
      'my': 'Myanmar (Burmese)'
    };

    return `Translate the following text from ${languageNames[request.fromLanguage]} to ${languageNames[request.toLanguage]}:

"${request.text}"

Translation:`;
  }

  // Batch translation for multiple texts
  async translateBatch(texts: string[], fromLanguage: 'en' | 'my', toLanguage: 'en' | 'my'): Promise<string[]> {
    const translations = await Promise.all(
      texts.map(text => this.translateText({ text, fromLanguage, toLanguage }))
    );
    
    return translations.map(result => result.translatedText);
  }

  // Get supported languages (only English and Burmese)
  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ' }
    ];
  }
}

export const translationService = new TranslationService();
