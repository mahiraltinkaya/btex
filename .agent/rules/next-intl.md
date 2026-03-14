# Localization Rules (next-intl)

Strict rules for managing localization in both `web-client` and `web-api`.
**Trigger**: `FE_NEXT_INTL` or whenever adding/modifying user-facing text.

## Core Principle (STRICT)

> [!IMPORTANT]
> **NO HARDCODED STRINGS ALLOWED.**
> Every piece of text visible to the user must be retrieved from translation files.

## 1. Web Client Rules (`web-client`)

### 1.1 Configuration & Structure
- **Library**: `next-intl`
- **Files**:
    - `messages/en.json` (Source of Truth)
    - `messages/tr.json` (Must match keys of en.json)
- **Hooks**:
    - Client Components: `import { useTranslations } from "next-intl"`
    - Server Components: `import { getTranslations } from "next-intl/server"`

### 1.2 Usage Pattern
**DO NOT** write text directly in JSX.
```tsx
// ❌ WRONG
return <div>Welcome back, User</div>;

// ✅ CORRECT
const t = useTranslations('Dashboard');
return <div>{t('welcome')}</div>;
```

### 1.3 Adding New Keys
1.  **Namespace**: Use nested keys relevant to the feature (e.g., `jobAlerts`, `auth`, `profile`).
2.  **Naming**: Kebab-case for keys (e.g., `create-job-card`, `not-found`).
3.  **Synchronization**: When you add a key to `en.json`, you **MUST** add the same key to `tr.json` immediately.
    - If you don't know the Turkish translation, use the English text temporarily or ask the user, but **do not leave the key missing**.

## 2. Web API Rules (`web-api`)

### 2.1 Configuration & Structure
- **Files**:
    - `src/locales/en/translation.json`
    - `src/locales/tr/translation.json`
- **Usage**: Backend responses, error messages, and email templates sent to the frontend.

### 2.2 Usage Pattern
When throwing errors or returning messages from controllers/services:
```typescript
// ❌ WRONG
throw new Error("User not found");

// ✅ CORRECT (Example pattern, adjust based on actual implementation)
// Ensure the error key exists in src/locales/*/translation.json
throw new AppError("errors.user-not-found"); 
// OR return localized DTOs if applicable
```

### 2.3 Synchronization
- Same as frontend: Every key added to `en/translation.json` **MUST** exist in `tr/translation.json`.

## 3. Workflow Checklist
When implementing a feature that involves text:

1.  [ ] Write the code using translation keys (e.g., `t('my-feature.title')`).
2.  [ ] Open `messages/en.json` (FE) or `src/locales/en/translation.json` (BE).
3.  [ ] Add the new keys under the appropriate namespace.
4.  [ ] Open `messages/tr.json` (FE) or `src/locales/tr/translation.json` (BE).
5.  [ ] Add the corresponding keys.
6.  [ ] Verify no `MISSING_MESSAGE` warnings appear in the console.

## 4. Forbidden Patterns
- `placeholder="Search..."` (Must be `placeholder={t('search')}`)
- `alt="Profile Image"` (Must be `alt={t('profile-image')}`)
- `const status = "Active"` (If displayed, must be mapped: `const statusLabel = t('status.active')`)

FAILURE TO FOLLOW THESE RULES will result in rejected code.
