import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en')}
    >
      {i18n.language === 'en' ? 'VI' : 'EN'}
    </Button>
  );
}