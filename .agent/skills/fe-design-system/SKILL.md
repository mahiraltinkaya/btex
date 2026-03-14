---
name: fe-design-system
description: "Trigger: FE_DESIGN_SYSTEM. Enforces the strict 'Clean Dashboard' aesthetic based on the dashboard-theme.png reference. Use this for all UI generation."
---

# FE Design System Skill (Clean Dashboard Theme)

## Core Philosophy & Mandatory Standards
**Reference**: `resources/dashboard-theme.png` (MUST be used as the primary visual guide)
**PublicReference**: `resources/public-theme2.png` (MUST be used as the public page visual guide)
**Goal**: Create a high-end, uncluttered, "Soft UI" dashboard.
**Mantra**: "No unnecessary lines. Contrast through whitespace and shadow. Soft over hard."

### 🚨 Critical Strictness Rules
1.  **Zero Deviation**: You MUST NOT deviate from the application design standards defined here.
2.  **Context Preservation**: Outputs must maintain the context of the existing application. Do not introduce alien design patterns.
3.  **Maximum Capability Matching**: Ensure the new components provide at least the same level of capability and interaction quality as the existing system.
4.  **Reference Image Authority**: The `dashboard-theme.png` is the absolute authority on visual style.

### ✅ Stability & Validation (Mandatory)
- After any UI change, make sure the output is stable and functional.
- Always validate after changes (run relevant checks and verify the UI behavior) before finalizing work.

## 1. Mobile Responsiveness (MANDATORY)
**EVERY component and layout MUST be mobile-responsive by default.**
- **Mobile First**: Design for mobile first, then scale up.
- **Breakpoints**: Use Tailwind breakpoints (`md:`, `lg:`, `xl:`) explicitly.
- **Stacking**: Columns must stack vertically on mobile (`flex-col`).
- **Sizing**: 
  - Cards: `w-full` on mobile.
  - Text: Adjust sizes (e.g., `text-xl` mobile -> `text-2xl` desktop).
  - Padding: Reduced padding on mobile (e.g., `p-4` mobile -> `p-8` desktop).
- **Navigation/Menus**: Must collapse or adapt (e.g., hamburger menu, scrollable horizontal tabs) on small screens.

## 2. Container & Card Styling (The "Soft Card")
All main content blocks (Analytics charts, Project lists, Profiles) must reside in "Soft Cards".

- **Background**: `bg-white` (Pure White) on top of a `bg-[#F3F4F6]` (Gray-100/Slate-50) page background.
- **Border Radius**: **Highly Rounded**. Use `rounded-3xl` (24px) or `rounded-[30px]`.
  - *Anti-Pattern*: `rounded-md`, `rounded-lg` (Too sharp).
  - *Anti-Pattern*: `rounded-none`.
- **Borders**: **NONE**. Do not use `border` or `border-gray-200`.
  - Separation is achieved via **Shadows** and **Background Contrast**.
- **Shadows**: Soft, diffuse, large.
  - Class: `shadow-sm` (for list items) or `shadow-card` (custom soft shadow).
  - *Anti-Pattern*: Hard, dark shadows.
- **Padding**: Generous. Minimum `p-6`, preferred `p-8` (adjust for mobile).

## 3. Layout & Spacing
- **Separation**: Do NOT use `<Separator />` or `border-b` unless absolutely critical for data tables.
- **Grouping**: Use whitespace (`gap-6`, `gap-8`) to separate sections.
- **Grid**: Use CSS Grid/Flex for layout. The dashboard is typically a masonry or 3-column layout.
- **Responsive Layout**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.

## 4. Typography
- **Headings**: Clean, Bold, Dark.
  - `text-2xl font-bold text-gray-900`.
  - No serif fonts.
- **Subtitles/Labels**: Muted, Medium weight.
  - `text-sm font-medium text-gray-500`.
- **Badges/Tags**:
  - **Style**: Pill shape (`rounded-full`).
  - **Colors**: Soft pastel backgrounds with dark text (e.g., `bg-orange-100 text-orange-700`).

## 5. Component Rules (TabMenuContext)
When implementing components for `TabMenuContextProvider` or any main layout:

- **Wrapper**: Every tab content must be wrapped in a `<div class="h-full w-full bg-transparent space-y-6">`.
- **Content**: The actual data should be inside one or more **Soft Cards**.
- **Example Structure**:
  ```tsx
  // Correct Structure
  <div className="flex flex-col gap-6">
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Income Tracker</h2>
      <ChartComponent />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold">Widget A</h3>
      </div>
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold">Widget B</h3>
      </div>
    </div>
  </div>
  ```

## 6. Visual "Don'ts" (Strict)
1.  **NO** visible outer borders on cards (`border border-border` -> REMOVE).
2.  **NO** small border radius (`rounded-sm`).
3.  **NO** dense information packing. Open it up.
4.  **NO** dark mode defaults (unless explicitly toggled, default is light/airy).
5.  **NO** heavy gradients. Use solid colors or extremely subtle gradients.
6.  **NO** non-responsive fixed widths (`w-[500px]` -> `w-full max-w-[500px]`).

## 7. Implementation Checklist
- [ ] Is the output strictly following `dashboard-theme.png` style?
- [ ] Is the layout mobile responsive (stacks correctly on small screens)?
- [ ] Is the background of the page distinct from the card (e.g. Light Gray vs White)?
- [ ] Are lines/dividers removed in favor of whitespace?
- [ ] Is the border radius at least `24px` (`rounded-3xl`) for main containers?
- [ ] Are shadows soft and barely visible?
