---
name: mobile-ui-standarts
description: Trigger MOBILE_UI_STANDARTS Standards for creating high-quality, modern mobile UI layouts (Neobank style).
---

# Mobile UI Standards (Neobank Aesthetic)

**Trigger:** `MOBILE_UI_STANDARTS`

This skill defines the mandatory design tokens, component patterns, and aesthetic guidelines for all mobile UI generation tasks. The design language is inspired by modern "Neobank" interfaces: clean, high-contrast, soft-card aesthetics with bold typography.

## 1. Core Design Philosophy
- **Clean & Spacious:** Use generous whitespace. Avoid clutter.
- **Soft & Rounded:** Everything is rounded. No sharp corners.
- **High Contrast:** Black text on white/gray backgrounds. Important actions are Black.
- **Vibrant Accents:** Use Lime Green (`#CCFF00`) sparingly for impact/branding.

## 2. Design Tokens

### 2.1 Colors (Tailwind)
| Token | Hex | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `#000000` | `bg-black` / `text-black` | Main Buttons, Headings, Strong Icons |
| **Secondary** | `#FFFFFF` | `bg-white` / `text-white` | Card Backgrounds, Text on Black |
| **Accent** | `#CCFF00` | `bg-[#CCFF00]` | Brand Cards, Highlights, "New" badges |
| **Surface** | `#F5F5F5` | `bg-gray-100` | App Background (Page base) |
| **Text Primary** | `#1A1A1A` | `text-gray-900` | Headings, Primary Body |
| **Text Secondary**| `#666666` | `text-gray-500` | Subtitles, Captions |
| **Border** | `#E5E5E5` | `border-gray-200` | Subtle dividers (rarely used, prefer shadow) |

### 2.2 Typography
**Font Family:** Use system sans-serif (Inter/San Francisco equivalent).

| Category | Size | Weight | Line Height | Tailwind Classes |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 30-32px | Bold (700) | Tight | `text-3xl font-bold tracking-tight` |
| **H1** | 24px | Bold (700) | Tight | `text-2xl font-bold` |
| **H2** | 20px | SemiBold (600)| Normal | `text-xl font-semibold` |
| **Body Large**| 16px | Medium (500) | Normal | `text-base font-medium` |
| **Body** | 14px | Regular (400) | Relaxed | `text-sm font-normal text-gray-500` |
| **Caption** | 12px | Medium (500) | Normal | `text-xs font-medium text-gray-400` |

### 2.3 Spacing System (4px Grid)
- **xs:** `4px` (`gap-1`, `p-1`)
- **sm:** `8px` (`gap-2`, `p-2`)
- **md:** `16px` (`gap-4`, `p-4`)
- **lg:** `24px` (`gap-6`, `p-6`)
- **xl:** `32px` (`gap-8`, `p-8`)
- **Section Padding:** Always use `p-6` (24px) for page containers.

### 2.4 Border Radius
- **Cards (Large):** `rounded-3xl` (24px) - *Standard for all content cards.*
- **Cards (Small):** `rounded-2xl` (16px) - *For smaller list items.*
- **Buttons:** `rounded-full` (9999px) - *Always capsule shape.*
- **Inputs:** `rounded-xl` (12px) - *Soft inputs.*

### 2.5 Shadows
- **Cards:** `shadow-sm` (Subtle depth) or `shadow-none` (Flat on gray bg).
- **Floating Actions:** `shadow-lg` (Prominent lift).
- **Avoid:** Hard, dark shadows. Use diffused, alpha-low shadows.

## 3. Component Standards

### 3.1 Buttons
**Primary Button:**
```tsx
<button className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity">
  Action
</button>
```

**Secondary Button:**
```tsx
<button className="w-full bg-gray-100 text-black py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-colors">
  Cancel
</button>
```

### 3.2 Cards
**Standard Card:**
```tsx
<div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-4">
  <h3 className="text-xl font-bold text-gray-900">Card Title</h3>
  <p className="text-gray-500">Card content goes here.</p>
</div>
```

**Highlight/Brand Card:**
```tsx
<div className="bg-[#CCFF00] p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden">
  <h3 className="text-xl font-bold text-black z-10">Premium Card</h3>
  {/* Abstract patterns can go here */}
</div>
```

### 3.3 Inputs
```tsx
<div className="flex flex-col gap-2">
  <label className="text-sm font-semibold text-gray-900">Label</label>
  <input 
    type="text" 
    className="w-full bg-gray-50 border-none p-4 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black/5"
    placeholder="Value"
  />
</div>
```

### 3.4 Navigation (Tab Bar)
- **Container:** `bg-white/80 backdrop-blur-md border-t border-gray-100 pb-safe pt-2`
- **Icons:** 24px, simple line icons using `lucide-react`.
- **Active State:** Black icon, distinct from inactive gray.

## 4. Layout Patterns

### 4.1 Page Structure
```tsx
export default function MobilePage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24"> {/* pb-24 for tab bar space */}
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
          <p className="text-sm text-gray-500">Subtitle or greeting</p>
        </div>
        <UserAvatar />
      </header>
      
      {/* Content Scroll */}
      <div className="px-6 flex flex-col gap-6">
        {/* Widgets / Cards */}
      </div>
    </main>
  );
}
```

### 4.2 List Items
- Use `flex justify-between items-center`
- Left: Icon (in a circled bg) + Text stack
- Right: Amount/Action + Arrow
```tsx
<div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
   <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
         <Icon className="w-5 h-5 text-gray-900" />
      </div>
      <div>
         <p className="font-semibold text-gray-900">Item Name</p>
         <p className="text-xs text-gray-500">Description</p>
      </div>
   </div>
   <span className="font-bold text-gray-900">$Value</span>
</div>
```

## 5. Mandatory Review Checklist
Before marking any Mobile UI task as complete, verify:
- [ ] Is the corner radius consistent? (`rounded-3xl` for main containers)
- [ ] Is the spacing consistent? (Multiples of 4px)
- [ ] Are font weights correct? (Headings are bold, body is readable)
- [ ] Is the primary action Black?
- [ ] Is the background clean (gray-50 or white)?
- [ ] Is the mobile viewport responsiveness tested?
