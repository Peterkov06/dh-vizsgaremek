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
