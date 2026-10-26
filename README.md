# Portfolio — ELI-Anrif · BTS SIO option SISR

One-page glassmorphism, univers réseau. **HTML + CSS + JS vanilla** — aucun framework, aucun build : dépliable sur GitHub Pages tel quel.

---

## ✦ Fichiers

| Fichier        | Rôle                                                                 |
| -------------- | -------------------------------------------------------------------- |
| `index.html`   | Structure sémantique (hero, à propos, projets, compétences, E5, contact) |
| `style.css`    | Variables CSS (sombre / clair), verre dépoli, hero flouté, responsive, `prefers-reduced-motion` |
| `script.js`    | Thème clair/sombre, nav à encoches + pilule active, menu compact, reveal, compteurs, modales, magnétisme, parallaxe du hero |
| `README.md`    | Ce fichier — checklist pour personnaliser                            |

## ✦ Assets à préparer (liste)

### Images (format recommandé WebP/AVIF, ~1600 px de large pour le hero)
- [x] `photos/infrastructure-réseau.webp` — photo de fond du hero (fournie). Pour la remplacer, déposez une image dans `photos/` et mettez à jour `--hero-img` dans `.hero` (style.css).
- [ ] `assets/img/projets/p1-cover.jpg` — visuel du projet « Réseau PME sécurisé » (idéal : capture du schéma Packet Tracer).
- [ ] `assets/img/projets/p2-cover.jpg` — visuel « OpenShowroom AD & GLPI » (idéal : console Active Directory ou GLPI).
- [ ] `assets/img/projets/p3-cover.jpg` — visuel « Agent GLPI / parc hétérogène » (idéal : inventaire GLPI).
- [ ] `assets/img/projets/p1/shot-1.jpg`, `shot-2.jpg` — captures modale projet 1.
- [ ] `assets/img/projets/p2/shot-1.jpg`, `shot-2.jpg` — captures modale projet 2.
- [ ] `assets/img/projets/p3/shot-1.jpg`, `shot-2.jpg` — captures modale projet 3.
- [ ] `assets/img/avatar.jpg` — **photo réelle** (remplace le monogramme « EA » dans la section À propos).

### Documents PDF (liens actuellement neutralisés `[data-placeholder-todo]`)
- [ ] `assets/pdf/tableau-synthese-e5.pdf` — tableau de synthèse de l'épreuve E5.
- [ ] `assets/pdf/projet-1-documentation.pdf` — documentation réseau PME.
- [ ] `assets/pdf/projet-2-procedure-installation.pdf` — procédure AD + GLPI.
- [ ] `assets/pdf/projet-3-procedure-deploiement.pdf` — déploiement agent GLPI.

> ⚠ **Une fois un PDF fourni** : remplacer `href="#"` par `assets/pdf/…` et supprimer l'attribut `data-placeholder-todo` (et `aria-disabled="true"`).

### Divers
- [ ] Mettre à jour les liens **LinkedIn** et **GitHub** (section contact).
- [ ] Vérifier l'adresse e-mail de contact (`ibnasri.sio@gmail.com` actuellement).

---

## ✦ Personnalisation rapide

- **Palette** : extraite de `photos/palette.jpeg`, déclinée en **émeraude froid** — fond `#072B26`, vert `#1F7A63`, sauge `#77C0A3`, lime `#E2F362`, crème `#F7FADF` ; variables dans `:root` (`style.css`). Le thème clair utilise un fond crème `#F4F7F2`, des cartes blanches translucides et un accent émeraude `#2B745D`.
- **Polices** : Google Fonts (Montserrat / Inter / JetBrains Mono), modifiable en tête de `index.html`.
- **Texte** : tout le contenu (français) est directement dans `index.html`, sections commentées.

## ✦ Lancer en local

```bash
# Option A — simple : double-clic sur index.html
# Option B — serveur :
python3 -m http.server 8080     # puis http://localhost:8080
```

## ✦ Déploiement GitHub Pages

1. `git init && git add . && git commit -m "Portfolio BTS SIO SISR"`
2. Créer un dépôt (ex. `eli-anrif.github.io` sur GitHub), `git push`.
3. GitHub → **Settings → Pages** → source `Deploy from a branch` → branche `main` → `/ (root)`.
4. Le site est en ligne sur `https://<nom>.github.io`.

## ✦ Notes techniques

- **Navigation** : barre à encoches inspirée du modèle *adaptive notch navigation* — logo, onglets avec pilule active animée et action Contact sur desktop ; îlot compact avec menu déroulant sous `1280 px`. La pilule suit l'onglet actif pendant le scroll.
- **Hero** : une seule image, **légèrement floutée sur toute sa surface** (flou doux responsive) ; le titre est **transparent** (l'image traverse les lettres) avec un fin contour blanc.
- **Halo émeraude/lime (projets & compétences)** : au **survol** (ou focus clavier), le `conic-gradient` est **flouté et projeté autour de la carte** : il devient une ombre/halo animé aux couleurs du site (émeraude, sauge, lime, crème), et non un contour net. CSS pur, sans React. Réglages : `--beam-speed` (14 s par défaut), `--beam-width` (épaisseur du halo, 6 px), `--beam-intensity` sur `.proj-card` et `.skill`.
- **Verre liquide (projets & compétences)** : fond quasi transparent, `backdrop-filter: blur(42px) saturate(195%)`, reflets internes, arête lumineuse image/verre (projets), reflet qui balaie l'image au survol (projets), éclat qui suit le curseur, et ambiance douce (vert/lime) derrière les grilles pour rendre la transparence lisible.
- **Mobile** : mise en page verticale, îlot de navigation compact et menu déroulant.
- **Thème clair / sombre** : bouton soleil/lune dans la barre (desktop et mobile), mémorisé dans `localStorage` (`eli-theme`) et restauré avant le premier rendu. Le thème clair est le mode par défaut ; le thème sombre reste disponible au clic. Le hero conserve sa photo sombre et ses textes crème dans les deux thèmes pour le contraste.
- **Accessibilité** : `prefers-reduced-motion`, `:focus-visible`, alt, aria, attrs sémantiques, zones tactiles confortables.
- **Formulaire** : démo locale — brancher [Formspree](https://formspree.io) (voir remarque dans `script.js`) pour un envoi réel.