---
trigger: always_on
priority: CRITICAL
---

# Approval Protocol (STRICT ENFORCEMENT)

## Core Principle

> **NEVER** make destructive or significant changes without explicit user approval.
> This is a CRITICAL safety mechanism - violations are unacceptable.

---

## Category A: ALWAYS REQUIRE APPROVAL

These operations **MUST** have explicit user approval before execution:

| Operation | Risk Level | Why |
|-----------|------------|-----|
| Schema changes (Prisma) | 🔴 HIGH | Data integrity, migration risk |
| New API endpoints | 🟠 MEDIUM | API contract changes |
| Endpoint deletion | 🔴 HIGH | Breaking change for clients |
| Package installation | 🟠 MEDIUM | Dependency security |
| File deletion | 🔴 HIGH | Irreversible action |
| Multi-file refactors | 🟠 MEDIUM | Wide-reaching impact |
| Auth/permission changes | 🔴 HIGH | Security critical |
| Route structure changes | 🟠 MEDIUM | URL structure impact |
| Environment config changes | 🔴 HIGH | System stability |

---

## Category B: EXPLAIN THEN PROCEED

These operations require explanation but can proceed after informing user:

| Operation | Explanation Required |
|-----------|---------------------|
| New component creation | What, why, where it goes |
| Style/CSS changes | Visual impact expected |
| Business logic changes | Behavior difference |
| i18n key additions | Key naming and content |
| Test additions | Coverage improvement |

---

## Approval Request Template (MANDATORY FORMAT)

Use this exact format when requesting approval:

```markdown
## Yapmak İstediğim İşlem

**Ne:** [1-2 cümle açıklama]

**Neden:** [Gerekçe - problem ne, neden bu çözüm]

**Etkilenen Dosyalar:**
- `path/to/file1.ts` - [değişiklik]
- `path/to/file2.tsx` - [değişiklik]

**Alternatifler:** [Varsa diğer yaklaşımlar]

**Riskler:** [Potansiyel sorunlar]

**Bu planı onaylıyor musunuz?** (evet/hayır)
```

---

## Forbidden Actions (ABSOLUTE)

These commands are **NEVER** allowed without explicit approval:

```bash
# Database operations
🚫 npx prisma migrate dev
🚫 npx prisma db push
🚫 npx prisma db seed

# Package management
🚫 npm install [package]
🚫 bun add [package]
🚫 yarn add [package]

# Destructive operations
🚫 rm -rf [anything]
🚫 git reset --hard
🚫 Deleting any file
```

---

## Approval Verification

Valid approval responses:
- "evet"
- "onay"
- "tamam"
- "yes"
- "approved"
- "LGTM"

Invalid (do NOT proceed):
- Silence / no response
- Vague responses like "hmm" or "maybe"
- Redirecting questions

---

## Violation Consequences

If a change is made without required approval:
1. Immediately notify user of the mistake
2. Offer to revert the change
3. Document the incident
4. Never repeat the violation

---

## Why This Matters

Users must:
- Understand what will change
- Verify changes align with their vision
- Maintain control over their codebase
- Trust the AI assistant

Skipping approval breaks this trust and can cause irreversible damage.
