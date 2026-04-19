# Projekt Indítási Útmutató

## Követelmények

Csak egyet kell telepíteni: **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**

> Node.js, npm vagy bármilyen más eszköz telepítése **nem szükséges**.

---

## Hogyan indítsd el?

### Windows
1. Indítsd el a **Docker Desktop** alkalmazást (várj, amíg elindul a bálna ikon a tálcán)
2. Kattints duplán a `START.bat` fájlra
3. Nyisd meg a böngészőt, és menj erre a címre: **http://localhost:3000**

### Mac / Linux
1. Indítsd el a **Docker Desktop** alkalmazást (várj, amíg elindul a bálna ikon a menüsorban)
2. Nyiss egy terminált a projekt mappájában, és futtasd:
   ```bash
   ./START.sh
   ```
3. Nyisd meg a böngészőt, és menj erre a címre: **http://localhost:3000**

---

## Első indítás

Az első indítás **néhány percet vehet igénybe**, mivel a Docker letölti és felépíti a szükséges fájlokat.  
A következő indítások már sokkal gyorsabbak lesznek.

---

## Leállítás

A terminál ablakban nyomd meg: `Ctrl + C`

---

## Gyakori problémák

**A Docker nem indul el?**  
Győződj meg róla, hogy a Docker Desktop alkalmazás fut (látható a bálna ikon a tálcán / menüsorban).

**A 3000-es port foglalt?**  
Nyisd meg a `docker-compose.yml` fájlt, és írd át a `"3000:3000"` sort `"3001:3000"`-re.  
Ezután a **http://localhost:3001** címen érhető el az alkalmazás.

**Valami más probléma?**  
Futtasd ezt a parancsot a terminálban a projekt mappájából:
```bash
docker compose down && docker compose up --build
```
# Tesztdokumentáció – Playwright E2E Tesztek

## Áttekintés

Ez a dokumentum leírja, hogyan lehet futtatni az alkalmazás végponttól végpontig (E2E) tesztjeit.  
A tesztek **Playwright** segítségével készültek, és a frontend főbb funkcióit ellenőrzik automatikusan, valódi böngészőben.

---

## Előfeltételek

A tesztek futtatásához az alábbiak szükségesek:

- **Node.js** (v18 vagy újabb) – [letöltés](https://nodejs.org)
- **Docker Desktop** – [letöltés](https://www.docker.com/products/docker-desktop)
- **npm** (a Node.js-sel együtt települ)

---

## Az alkalmazás elindítása

A tesztek futtatása előtt az alkalmazást el kell indítani Docker segítségével.

**1. lépés – Nyiss egy terminált és navigálj a projekt gyökérkönyvtárába:**

```bash
cd dh-vizsgaremek
```

**2. lépés – Indítsd el a Docker konténereket:**

```bash
docker compose up
```

> Várj amíg minden konténer elindul. Ez az első alkalommal néhány percet vehet igénybe.

**3. lépés – Ellenőrizd, hogy minden konténer fut:**

```bash
docker ps
```

A következő konténereknek kell futnia:
- `dh-vizsgaremek-app-1` – Frontend (Next.js) – port: **3000**
- `app_backend` – Backend (.NET) – port: **7261**
- `app_db` – Adatbázis (PostgreSQL) – port: **5432**
- `app_mail` – Levelező szerver (MailHog) – port: **8025**

Az alkalmazás ezután elérhető a böngészőben: [http://localhost:3000](http://localhost:3000)

---

## A tesztek futtatása

**1. lépés – Navigálj a frontend mappába:**

```bash
cd frontend
```

**2. lépés – Telepítsd a függőségeket (első alkalommal):**

```bash
npm install
npx playwright install
```

**3. lépés – Futtasd a teszteket:**

```bash
npx playwright test
```

### Vizuális mód (böngészőben látható futtatás)

Ha szeretnéd látni, ahogy a tesztek valódi böngészőben futnak:

```bash
npx playwright test --headed
```

### Részletes riport megtekintése

A tesztek lefutása után egy részletes HTML riportot is meg lehet tekinteni:

```bash
npx playwright show-report
```

---

## A tesztek leírása

| # | Teszt neve | Leírás |
|---|-----------|--------|
| 1 | A bejelentkezési oldalon megjelenik az email és jelszó mező | Ellenőrzi, hogy a bejelentkezési oldal helyesen töltődik be és láthatóak az input mezők |
| 2 | A regisztrációs oldal sikeresen betöltődik | Ellenőrzi, hogy a regisztrációs oldal elérhető és nem dob hibát |
| 3 | A tanár főoldala megfelelően betöltődik | Tanár fiókkal bejelentkezik és ellenőrzi, hogy a főoldal betöltődik |
| 4 | A diák főoldala megfelelően betöltődik | Diák fiókkal bejelentkezik és ellenőrzi, hogy a főoldal betöltődik |

A tesztek mindhárom főbb böngészőben futnak: **Chromium**, **Firefox** és **WebKit (Safari)**.

---

## Teszt felhasználói fiókok

A tesztek az alábbi előre létrehozott fiókokat használják:

| Típus | Email | Jelszó |
|-------|-------|--------|
| Tanár (matek) | janos.kovacs@szkola.hu | SzkoLa123! |
| Diák | adam.lazar@szkola.hu | SzkoLaDiak1! |

> Ezek a fiókok már szerepelnek az adatbázisban, külön regisztráció nem szükséges.

---

## Hibaelhárítás

**„No tests found" hiba:**  
Ellenőrizd, hogy a `tests/app.spec.ts` fájl létezik a `frontend/tests/` mappában.

**Időtúllépés (timeout) hiba:**  
Ellenőrizd, hogy a Docker konténerek futnak-e (`docker ps`), és az alkalmazás elérhető-e a [http://localhost:3000](http://localhost:3000) címen.

**Docker nem indul el:**  
Indítsd el a Docker Desktop alkalmazást, és várj amíg a státusza „Engine running" lesz, majd próbáld újra.
