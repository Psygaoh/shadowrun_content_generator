# Shadowrun Content Creator Assistant

Shadowrun Content Creator Assistant is a cyberpunk-flavored toolkit that helps game masters generate NPCs, locations, and ambience snippets in seconds while staying true to their campaign.

## Contexte produit (FR)

### Qu'est-ce que c'est ?
**Shadowrun Assistant** est une petite application pensee pour le/la **MJ**. Elle genere en quelques secondes des **PNJ**, des **descriptions de lieux** et des **ambiances** pretes a jouer, afin d'aider pendant la preparation **et** a l'impro pendant la partie.

### Pour qui ?
- **MJ** de Shadowrun qui veut gagner du temps, improviser mieux et garder de la coherence.
- (Plus tard) **Joueurs** en lecture seule, pour consulter ce que le MJ decide de partager.

### Ce que l'app fait (MVP)
- **Generer des PNJ** : archetype, traits marquants, competences cles, equipement/augmentations, tics de roleplay, accroches de scene.
- **Decrire des lieux** : ce qu'on voit/entend/ressent, securite, complications, petit "gardien" du lieu, accroches.
- **Proposer des ambiances** : mini-textes a lire, mood/sons/odeurs, 2-3 variantes rapides.

Chaque sortie est courte, jouable et copiable (texte/Markdown). Le but : fournir de la matiere utilisable tout de suite sans ralentir la table.

### Flux utilisateur
1. Choisir la campagne active (votre partie en cours).
2. Cliquer **PNJ**, **Lieu** ou **Ambiance** -> remplir un mini-formulaire.
3. Lire le resultat (stream), puis au besoin : **Condenser**, **Developper** ou **Varier**.
4. Copier dans vos notes / VTT, ou enregistrer dans la campagne pour le retrouver plus tard.

> Au lancement, on ignore les villes, les tons, les niveaux et les packs de lore : l'objectif est d'avoir un noyau utile immediatement. Ces options reviendront plus tard avec un contexte IA enrichi.

### Principes cles
- **Rapidité** : 2-3 clics, un texte pret a jouer.
- **Coherence** : l'app s'appuie sur un contexte de campagne (resume, themes, contraintes) defini par le MJ.
- **Sobriete** : pas d'ecrans charges, pas de reglages interminables.
- **Portabilite** : utilisable sur ordinateur et mobile, installable comme une app (PWA).
- **Cloisonnement** : chaque projet Shadowrun reste separe de vos autres univers.

### Hors scope (MVP)
- Pas d'images ni d'illustrations.
- Pas de cartes interactives.
- Pas de chat en temps reel avec les joueurs.
- Pas d'exports profonds vers des VTT (on reste sur du texte/Markdown copiable).

### Etapes suivantes
- Villes / tons / niveaux (Seattle, Paris, etc.) et packs de lore selectionnables.
- Acces joueur (lecture seule) pour partager PNJ, lieux et handouts.
- Exports vers Notion, Foundry et autres outils.
- Variantes rue / corpo / magie, favoris, recherche et ameliorations ergonomiques.

### Terminologie
- **PNJ** : Personnage Non Joueur.
- **Lieu** : cadre de scene jouable (visuel, sonore, risques).
- **Ambiance** : court texte d'atmosphere a lire pendant la partie.
- **Campagne** : votre partie en cours (contexte, notes, elements enregistres).

> Objectif du MVP : une app minimaliste, fiable et rapide qui donne de quoi faire respirer votre Shadowrun, pile quand vous en avez besoin.

## Tech stack

- [Next.js 14+ (App Router)](https://nextjs.org)
- [Supabase](https://supabase.com) pour l'authentification et la persistence
- [Tailwind CSS](https://tailwindcss.com) et shadcn/ui pour l'UI
- TypeScript, ESLint, Prettier, et Turbopack pour une DX rapide

## Project structure

```
app/                 # Pages et layouts (App Router)
  (app)/             # Zone protegee pour les utilisateurs connectes
  auth/              # Flux d'authentification Supabase
  notes/             # Exemples d'integration avec Supabase
components/          # UI partagee (header, footer, boutons, etc.)
  chrome/            # Elements de chrome reutilisables (header, footer, neon backdrop)
lib/                 # Clients Supabase (server/browser), utilitaires
public/              # Assets statiques, si necessaire
```

## Environment configuration

Renseignez vos secrets Supabase avant de lancer l'app :

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
```

- En local, copiez `.env.example` vers `.env.local` puis remplissez les valeurs.
- Pour des builds de production locaux, copiez `.env.production.example` vers `.env.production`.
- Sur Vercel (ou autre hebergeur), ajoutez ces variables dans les reglages de projet avant `next build`.

## Local development

1. Installez les dependances :
   ```bash
   npm install
   ```
2. Lancez le serveur de dev :
   ```bash
   npm run dev
   ```
   L'app est disponible sur http://localhost:3000.
3. Analysez le code :
   ```bash
   npm run lint
   ```
   Les builds generent des fichiers `.next/`; ils sont ignores par ESLint via `.eslintignore`.

## Deployment

1. Assurez-vous que les variables d'environnement sont definies sur la plateforme cible.
2. Construisez puis lancez :
   ```bash
   npm run build
   npm run start
   ```
3. Pour Vercel, liez votre projet Supabase et verifiez la sync des variables avant de deployer.

## Workflow Git recommande

1. Mettez `main` a jour :
   ```bash
   git checkout main
   git pull origin main
   ```
2. Creez une branche dediee :
   ```bash
   git checkout -b feature/nom-clair
   ```
3. Commitez regulierement :
   ```bash
   git status
   git add <fichiers>
   git commit -m "message explicite"
   ```
4. Poussez et ouvrez une PR :
   ```bash
   git push -u origin feature/nom-clair
   ```
5. Apres merge, nettoyez :
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/nom-clair
   git push origin --delete feature/nom-clair
   ```

## Roadmap immediate

- Finaliser les generateurs PNJ / lieux / ambiances cote back-end.
- Ajouter la persistance par campagne et le partage lecture seule.
- Etendre le chrome neon (backgrounds, overlays) a des composants reutilisables supplementaires si besoin.
- Couvrir les nouveaux flux par des tests et des exemples de donnees.

