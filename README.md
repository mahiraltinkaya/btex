# BTEX 

Event & Ticket Management — Full-Stack Monorepo (Express.js + Next.js)

---

## Gereksinimler

- **Node.js** ≥ 18
- **npm** (yarn/pnpm değil — workspace config npm'e göre)
- **PostgreSQL** çalışır durumda

---

## Kurulum

```bash
# 1. Bağımlılıkları yükle (root'tan tüm workspace'leri kurar)
npm install

# 2. Environment dosyalarını oluştur
cp apps/api/.env.example apps/api/.env      # DB bağlantısı + JWT secret
cp apps/web/.env.example apps/web/.env.local # API URL + Session secret
```

### `apps/api/.env`

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/db_ticket
JWT_SECRET=your-jwt-secret-key
PORT=3001
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
SESSION_SECRET=<32-byte-base64-encoded-secret>
```

---

## DB Setup (Sıfırdan)

Aşağıdaki komutları **sırasıyla** çalıştır:

```bash
# 1. Prisma client oluştur
npm run db:generate

# 2. Schema'yı DB'ye push et (reset için --force-reset ekle)
npm run db:push

# 3. PostgreSQL View'ı oluştur
cd apps/api && npx tsx prisma/seed/create-views.ts

# 4. Admin kullanıcıyı seed'le
cd apps/api && npx tsx prisma/seed/root-user.ts

# 5. Örnek event + ticket verisi ekle
cd apps/api && npx tsx prisma/seed/seed-events.ts
```

> **Full Reset:** `npm run db:push -- --force-reset` ile DB'yi tamamen sıfırlayıp 3-5 arası adımları tekrar çalıştır.

---

## Çalıştırma

```bash
# Tüm workspace'leri paralel başlat
npm run dev

# Veya ayrı ayrı
npm run dev:api   # → http://localhost:3001
npm run dev:web   # → http://localhost:3000
```

| Servis | Port | Açıklama |
|--------|------|----------|
| API | `3001` | Express.js REST API |
| Web | `3000` | Next.js App Router (SSR + RSC) |
| Prisma Studio | `5555` | `npm run db:studio` ile açılır |

---

## Monorepo Yapısı

npm workspaces ile yönetilir. Her app kendi `package.json`'ına sahiptir.

```
btex-assessment/
├── apps/
│   ├── api/          → @btex/api  (Express + Prisma + PostgreSQL)
│   └── web/          → @btex/web  (Next.js 16 + TanStack Query + shadcn/ui)
├── packages/         → Paylaşılan paketler (gelecekte)
├── package.json      → Root workspace config
└── postman-collection.json
```

**Root Script'ler:**

```bash
npm run dev           # Tüm workspace'ler paralel
npm run build         # Production build
npm run type-check    # tsc --noEmit (tüm workspace'ler)
npm run db:generate   # prisma generate
npm run db:push       # prisma db push
npm run db:studio     # prisma studio
```

---

## Admin Hesabı

Seed script ile oluşturulan admin kullanıcı:

| Alan | Değer |
|------|-------|
| Email | `admin@btex.com` |
| Password | `135790Test*` |
| Role | `ADMIN` |

| Alan | Değer |
|------|-------|
| Email | `demo@btex.com` |
| Password | `135790Test*` |
| Role | `CUSTOMER` |

---

## Postman Collection

Repo kökünde `postman-collection.json` dosyasını Postman'e import et.

**Özellikler:**
- `baseUrl` değişkeni → `http://localhost:3001`
- Login/Register sonrası `accessToken` **otomatik set edilir** (test script'leri ile)
- Tüm korumalı endpoint'ler `Authorization: Bearer {{accessToken}}` header'ını kullanır
- `eventId`, `ticketId`, `transactionId` collection variable'ları mevcut — ilgili ID'leri buraya yapıştırarak kullan

**İş Akışı:**
1. `Auth > Login (Admin)` ile giriş yap → token otomatik set olur
2. `Events > Get All Events` ile event listesini çek → bir `eventId` kopyala
3. `Booking > Reserve Ticket by Event` ile `eventId` göndererek rezervasyon yap
4. `Events > Get All Tickets` ile biletlerini gör → `transactionId` al
5. `Booking > Payment` ile ödeme yap (mock kart: `4532015112830366`)

---

## DB Dump

Repo kökündeki `db_ticket_dump.sql` dosyası, tüm tablo yapıları, enum'lar, view'lar, index'ler, foreign key'ler ve seed verileri içeren tam bir PostgreSQL dump'ıdır.

### Dump Alma (Bu Makinede)

```bash
PGPASSWORD=postgres pg_dump -U postgres -h localhost -p 5432 \
  --no-owner --no-privileges \
  --create --clean --if-exists \
  -F p -f ./db_ticket_dump.sql db_ticket
```

### Import (Başka Makinede)

```bash
# DB yoksa oluştur ve dump'ı yükle (--create flag'i ile DB otomatik oluşturulur)
PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 -f db_ticket_dump.sql

# Ardından Prisma client'ı oluştur
npm run db:generate
```

> Dump'ı kullanırsan seed script'lerini (adım 3-5) çalıştırmana gerek yok. Sadece `npm run db:generate` yeterli.

---
