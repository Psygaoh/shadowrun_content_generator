# Shadowrun Assistant — README

## Qu’est-ce que c’est ?
**Shadowrun Assistant** est une petite application pensée pour le/la **MJ**. Elle génère en quelques secondes des **PNJ**, des **descriptions de lieux** et des **ambiances** prêtes à jouer, afin d’aider pendant la préparation **et** à l’impro pendant la partie.

## Pour qui ?
- **MJ** de Shadowrun qui veut gagner du temps, improviser mieux et garder de la cohérence.
- (Plus tard) **Joueurs** en lecture seule, pour consulter ce que le MJ décide de partager.

## Ce que l’app fait (MVP)
- **Générer des PNJ** : archétype, traits marquants, compétences clés, équipement/augmentations, tics de roleplay, accroches de scène.
- **Décrire des lieux** : ce qu’on voit/entend/ressent, sécurité, complications, petit “gardien” du lieu, accroches.
- **Proposer des ambiances** : mini-textes à lire, mood/sons/odeurs, 2–3 variantes rapides.

Chaque sortie est **courte, jouable, et copiable** (texte/Markdown). Le but : vous donner de la matière utilisable **tout de suite**, sans noyer la table.

## Comment on s’en sert (flux simple)
1. **Choisir la campagne active** (votre partie en cours).
2. Cliquer **PNJ**, **Lieu** ou **Ambiance** → remplir un mini-formulaire (quelques champs).
3. Lire le résultat (streamé), puis au besoin : **Condenser**, **Développer** ou **Varier**.
4. **Copier** dans vos notes / VTT, ou **enregistrer** dans la campagne pour le retrouver plus tard.

> Au lancement, on **ignore les villes, les tons, les niveaux et les packs de lore** : l’objectif est d’avoir un noyau utile immédiatement. Ces options seront ajoutées ensuite, quand on alimentera l’IA avec du contexte plus riche.

## Principes clés
- **Rapidité** : 2–3 clics, un texte prêt à jouer.
- **Cohérence** : l’app s’appuie sur un **contexte de campagne** (résumé, thèmes, contraintes) défini par le MJ.
- **Sobriété** : pas d’écrans compliqués, pas de réglages interminables.
- **Portabilité** : utilisable sur ordinateur et mobile, **installable comme une app** (PWA).
- **Cloisonnement** : ce projet **Shadowrun** est séparé de vos autres univers. Rien ne “fuit” entre projets.

## Ce que l’app n’essaie pas de faire (MVP)
- Pas d’images ni d’illustrations.
- Pas de cartes interactives.
- Pas de chat en temps réel avec les joueurs.
- Pas d’exports profonds vers des VTT (on reste sur du texte/Markdown copiable).

## Ce qui viendra ensuite
- **Villes / tons / niveaux** (Seattle, Paris, etc.) et **packs de lore** sélectionnables.
- **Accès joueur** (lecture seule) pour partager PNJ/lieux/handouts.
- **Exports** vers Notion / Foundry / autres.
- Variantes “rue / corpo / magie”, favoris, recherche, et petites qualités-de-vie.

## Terminologie
- **PNJ** : Personnage Non Joueur.
- **Lieu** : cadre de scène jouable (visuel/sonore/risques).
- **Ambiance** : court texte d’atmosphère à lire pendant la partie.
- **Campagne** : votre partie en cours (contexte, notes, éléments enregistrés).

---

*Objectif du MVP : une app minimaliste, fiable et rapide qui vous donne, quand vous en avez besoin, de quoi faire respirer votre Shadowrun.*

---

## Prise en main du squelette actuel

Ce dépôt contient désormais une base Next.js 14 minimaliste :

```
.
├── app/                # Front-end et routes app router
│   ├── api/hello/      # API route renvoyant "Hello Shadowrun World"
│   ├── globals.css     # Style global très léger (mode sombre)
│   ├── layout.tsx      # Layout racine
│   └── page.tsx        # Page principale qui consomme l’API
├── lib/hello.ts        # Lecture du message depuis Postgres via Prisma
├── lib/prisma.ts       # Client Prisma mutualisé pour Next.js
├── prisma/schema.prisma# Table de test "TestHello"
├── .github/workflows/  # Workflow CI
└── ...
```

### Prérequis
- Node.js ≥ 18.17 (recommandé : 20.x)
- npm ≥ 9

### Installation
```bash
npm install
```

### Lancer le serveur de développement
```bash
npm run dev
```
La page d’accueil appelle `/api/hello` et affiche le message retourné par l’API.

### Lint
```bash
npm run lint
```

### Base de données & Prisma
- `prisma/schema.prisma` cible PostgreSQL (local ou Supabase).
- `prisma/migrations/` contient la migration initiale créant la table `TestHello`.
- `lib/hello.ts` interroge désormais la table via Prisma. Si aucune ligne n’existe, un message par défaut est renvoyé.

Copiez les exemples d’environnement pour configurer Prisma :

```bash
cp .env.local.example .env.local           # développement (Postgres local)
cp .env.production.example .env.production # déploiement (Supabase)
```

> **Important :** adaptez `DATABASE_URL` et `DIRECT_URL` aux connexions fournies par Supabase. `DATABASE_URL` doit utiliser PgBouncer (`?pgbouncer=true&connection_limit=1`) alors que `DIRECT_URL` pointe vers le port standard 5432 et sert aux migrations Prisma.

#### Commandes utiles
- `npm run prisma:migrate` — applique la migration à votre base locale et génère le client.
- `npm run prisma:migrate-deploy` — applique les migrations sur Supabase (le script force `DIRECT_URL` à basculer sur `DATABASE_URL` si la variable n’est pas définie).
- `npm run prisma:migrate-reset` — réinitialise la base (utile pendant le développement).
- `npx prisma studio` — optionnel : UI pour vérifier les données.

> Les scripts `prisma:migrate*` définissent automatiquement `DIRECT_URL` à partir de `DATABASE_URL` lorsqu’elle est absente, ce qui évite l’erreur `Environment variable not found: DIRECT_URL` pendant le développement local.

> Lors de la première exécution, pensez à insérer au moins une ligne dans `TestHello` (via Prisma Studio ou un script) afin que la page affiche un message provenant de la base.

### Gestion des variables d’environnement
- `.env.local.example` et `.env.production.example` recensent toutes les variables nécessaires (Postgres + clés Supabase).
- Le workflow GitHub Actions [`sync-vercel-env.yml`](.github/workflows/sync-vercel-env.yml) pousse ces variables vers Vercel à partir des secrets GitHub (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, en plus de `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).
- Côté Vercel, assurez-vous que le projet est bien lié à Supabase afin de disposer des bons identifiants. Lancez ensuite manuellement le workflow (`Actions` > `Sync environment with Vercel` > `Run workflow`) ou laissez-le s’exécuter lors du prochain push sur `main`.

### Déploiement
Le workflow GitHub Actions `ci.yml` installe les dépendances, exécute `npm run lint` puis `npm run build`. Il constitue une base pour vérifier la qualité avant les déploiements (p. ex. sur Vercel).

### Suivre un flux Git propre (Gitflow simplifié)
Pour appliquer des modifications (comme l’itération en cours) dans une nouvelle branche et ouvrir une Pull Request propre, voici la séquence recommandée :

1. **Récupérer l’état à jour de `main`**
   ```bash
   git checkout main
   git pull origin main
   ```
   Assurez-vous que votre branche principale locale reflète bien la version distante avant de dériver du travail.

2. **Créer une branche de fonctionnalité**
   ```bash
   git checkout -b feature/nom-clair
   ```
   Utilisez un nom descriptif (par ex. `feature/hello-world-ui`). Toutes les modifications pour la tâche se font sur cette branche.

3. **Mettre à jour le code**
   - Éditez/ajoutez les fichiers nécessaires.
   - Validez régulièrement votre progression :
     ```bash
     git status
     git add <fichiers>
     git commit -m "message explicite"
     ```

4. **Synchroniser avec la branche distante**
   ```bash
   git push -u origin feature/nom-clair
   ```
   Le `-u` enregistre la branche distante par défaut pour les futurs `git push`/`git pull`.

5. **Ouvrir la Pull Request**
   - Rendez-vous sur GitHub : un bandeau propose automatiquement d’ouvrir une PR depuis votre branche.
   - Décrivez le contexte, les changements et les tests effectués.
   - Demandez une relecture, apportez les ajustements si nécessaire (commits supplémentaires sur la même branche).

6. **Fusionner puis nettoyer**
   - Une fois la PR approuvée, fusionnez-la (merge ou squash selon votre politique).
   - Revenez sur `main`, récupérez les dernières modifications, puis supprimez la branche locale :
     ```bash
     git checkout main
     git pull origin main
     git branch -d feature/nom-clair
     git push origin --delete feature/nom-clair   # optionnel mais conseillé
     ```

Ce flux léger reste compatible avec un Gitflow complet (branches `develop`, `release`, etc.) si vous décidez de l’étendre plus tard.
