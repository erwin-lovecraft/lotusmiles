# Internationalization (i18n) Setup

This directory contains the internationalization configuration for the LotusMiles web application, supporting English (EN) and Vietnamese (VI) languages.

## Structure

```
i18n/
├── index.ts              # Main i18n configuration
├── locales/
│   ├── en.json          # English translations
│   └── vi.json          # Vietnamese translations
└── README.md            # This file
```

## Features

- **Automatic language detection** based on browser settings
- **Language persistence** using localStorage
- **Fallback to English** if translation is missing
- **Type-safe translations** with organized structure
- **Easy language switching** via UI component

## Usage

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('home.title')}</h1>;
}
```

### Using the Custom Hook

```tsx
import { useTranslations } from '@/lib/hooks';

function MyComponent() {
  const { home, common } = useTranslations();
  
  return (
    <div>
      <h1>{home.title}</h1>
      <p>{common.loading}</p>
    </div>
  );
}
```

### Language Switching

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <button onClick={() => changeLanguage('vi')}>
      Tiếng Việt
    </button>
  );
}
```

## Translation Keys Structure

The translations are organized into logical groups:

- `common.*` - Common UI elements (buttons, labels, etc.)
- `navigation.*` - Navigation menu items
- `auth.*` - Authentication-related text
- `home.*` - Home page content
- `profile.*` - Profile page content
- `mileage.*` - Mileage-related content
  - `mileage.request.*` - Mileage request forms
  - `mileage.history.*` - Mileage history
  - `mileage.tracking.*` - Request tracking
- `errors.*` - Error messages
- `languages.*` - Language names

## Adding New Translations

1. **Add the key to both language files** (`en.json` and `vi.json`)
2. **Use the key in your component** with `t('key.path')`
3. **Update the custom hook** if it's a commonly used translation

### Example

```json
// en.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}

// vi.json
{
  "newFeature": {
    "title": "Tính năng mới",
    "description": "Đây là một tính năng mới"
  }
}
```

```tsx
// In your component
const { t } = useTranslation();
return <h1>{t('newFeature.title')}</h1>;
```

## Configuration

The i18n configuration is set up in `index.ts` with the following features:

- **Language detection order**: localStorage → navigator → html tag
- **Fallback language**: English
- **Debug mode**: Enabled in development
- **Interpolation**: Disabled (React handles escaping)

## Best Practices

1. **Use descriptive keys** that reflect the content structure
2. **Group related translations** in nested objects
3. **Keep translations concise** and clear
4. **Test both languages** to ensure proper display
5. **Use the custom hook** for commonly used translations
6. **Avoid hardcoded strings** in components

## Language Detection

The app automatically detects the user's preferred language in this order:

1. **localStorage** - User's previous choice
2. **navigator** - Browser language settings
3. **html tag** - HTML lang attribute
4. **fallback** - English (default)

## Components

### LanguageSwitcher

A dropdown component that allows users to switch between English and Vietnamese. Located at `@/components/language-switcher.tsx`.

### Usage in AppBar

The language switcher is automatically included in the app bar for easy access.

## Testing

To test the i18n setup:

1. **Switch languages** using the language switcher
2. **Check persistence** by refreshing the page
3. **Verify fallbacks** by temporarily removing translations
4. **Test mobile responsiveness** of translated content

