# Gestion des Absences - Frontend

Ce projet est le frontend pour l'application de gestion des absences.

Application **Next.js** (App Router) en **TypeScript** avec une UI **dashboard sombre** (Bootstrap 5) pour la gestion d’absences et le suivi de projets.

Pages principales : **Dashboard**, **Absences**, **Classes**, **Projets**.

> La page **Élèves** n’est volontairement pas créée (choix de conception demandé).

## Fonctionnalités

### Dashboard

- KPI et visuels (répartition) basés sur les données d’absences
- Données **dynamiques** : quand un statut d’absence change, le dashboard se met à jour

### Absences

- KPIs (total / non justifiées / justifiées / retards)
- Recherche + filtres (classe, statut, période)
- Table avec lien vers le projet associé
- Changement de statut **instantané** (mise à jour optimiste + persistance locale)

### Classes

- Page de synthèse (KPIs, recherche, tableau)
- Données fictives “réalistes”

### Projets

- Liste des projets (cartes) avec recherche + filtres (classe, statut, période)
- Détails projet :
  - informations générales (dates, progression)
  - table “Élèves du projet” (présence %, absences)
  - matrice “Absences par projet” :
    - lignes = élèves, colonnes = dates
    - checkbox = absent
    - commentaire/justification par cellule (modal)
- Création de projets (participants : nom + classe)
- Suppression :
  - projets créés localement : suppression “hard”
  - projets mock : suppression “soft” (masqué via un flag stocké)

## Persistance (sans backend)

Le projet fonctionne en mode démo grâce à :

- `src/lib/mocks/*` : données fictives (seed)
- `localStorage` : enregistre les modifications côté navigateur

Exemples :

- statuts d’absences modifiés
- projets créés / supprimés
- participants d’un projet
- absences + commentaires dans la matrice projet (overrides)

## Démarrer l’application

### Prérequis

- Node.js (LTS recommandé)

### Installation

```powershell
npm install
```

### Lancer en prod

```powershell
npm start
```

### Lancer en dev

#### Option A — standard

```powershell
npm run dev
```

#### Option B — si PowerShell bloque `npm.ps1` (ExecutionPolicy)

```powershell
cmd /c "cd /d \"c:\\Users\\pu36pdx\\OneDrive - Education Vaud\\Bureau\\MA Métié\\absencenextnew\" && node node_modules\\next\\dist\\bin\\next dev -p 3020"
```

Puis ouvre :

- http://localhost:3020

> Note : selon les ports déjà utilisés, Next peut démarrer sur un autre port. Le terminal indique l’URL exacte.

## Où sont les pages ?

- Dashboard : `src/app/page.tsx`
- Absences : `src/app/absences/page.tsx`
- Classes : `src/app/classes/page.tsx`
- Projets (liste) : `src/app/projets/page.tsx`
- Projets (détail) : `src/app/projets/[id]/page.tsx`

## Layout / UI

- Layout racine : `src/app/layout.tsx`
- Shell (sidebar + topbar) : `src/components/layout/AppShell.tsx`
- Wrapper client du shell : `src/components/layout/ClientShell.tsx`
- Styles globaux (dark theme) : `src/app/globals.css`

## Architecture data (API-ready)

### Mocks

- Absences / Classes : `src/lib/mocks/absences.ts`
- Projets : `src/lib/mocks/projects.ts`

### Services

- Absences (localStorage) : `src/lib/services/absences.local.ts`
- Stats dashboard (calculs) : `src/lib/services/absences.stats.ts`
- Projets (façade) : `src/lib/services/projects.ts`
- Projets (localStorage) : `src/lib/services/projects.local.ts`
- Permissions (mock) : `src/lib/services/permissions.ts`

### Hooks

- `useAbsences()` + events (ui dynamique) : `src/lib/hooks/useAbsences.ts`

## Scripts NPM

- `npm run dev` : serveur de dev
- `npm run build` : build production
- `npm run start` : run production
- `npm run lint` : lint

## Pistes d’amélioration (si backend)

- Remplacer les services locaux par des appels API (`fetch`) sans changer les composants UI
- Auth + rôles réels
- Synchronisation multi-utilisateurs (base de données) + historique
