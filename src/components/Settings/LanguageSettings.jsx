import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSettings = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium">Language Settings</h4>
      <p className="text-sm text-gray-500 mt-1">Choose your preferred language</p>
      <div className="mt-3 space-x-2">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 rounded-md ${
            i18n.language === 'en'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('hi')}
          className={`px-3 py-1 rounded-md ${
            i18n.language === 'hi'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          हिंदी
        </button>
      </div>
    </div>
  );
}; 