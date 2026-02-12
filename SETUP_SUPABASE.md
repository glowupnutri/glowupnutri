# 🔧 GlowUp Nutrition — Podłączenie bazy danych Supabase

## Krok 1: Skopiuj Connection String z Supabase

1. Wejdź na **[app.supabase.com](https://app.supabase.com)**
2. Otwórz swój projekt
3. Przejdź do **Project Settings** → **Database**
4. Skopiuj **Connection string** w formacie **URI** (Transaction mode, port `6543`)

Przykładowy format:
```
postgresql://postgres.abc123def:TwojeHaslo@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## Krok 2: Wklej do `.env`

Otwórz plik `my-medusa-store/.env` i zamień linię `DATABASE_URL=...` na skopiowany connection string:

```env
DATABASE_URL=postgresql://postgres.TWOJ_REF:TWOJE_HASLO@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## Krok 3: Uruchom migracje i backend

```bash
cd my-medusa-store
npx medusa db:migrate
npx medusa user -e admin@glowupnutrition.pl -p admin123
npm run dev
```

## Krok 4: Uruchom storefront

```bash
cd my-medusa-store-storefront
npm run dev
```

## Gotowe! 🎉

- **Backend API**: http://localhost:9000
- **Admin Panel**: http://localhost:9000/app
- **Storefront**: http://localhost:8000

---

### Dane logowania do admina (po utworzeniu):
- Email: `admin@glowupnutrition.pl`
- Hasło: `admin123` (zmień po pierwszym logowaniu)
