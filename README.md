# GOFID Images

Depot statique pour heberger les images utilisees par GOFID.

## Objectif

Ce repo sert de base d'images publique. Les liens des images peuvent ensuite etre stockes dans la base GOFID, par exemple dans le champ `recompenses.image`.

## Structure

```text
images/
  rewards/      Images de recompenses affichees aux clients
  products/     Produits generiques
  categories/   Images ou icones de categories
  stores/       Logos ou images magasins
  banners/      Bannieres marketing
  misc/         Autres images
metadata/
  images.json   Index genere automatiquement
```

## Ajouter une image

1. Copier l'image dans le bon dossier, par exemple:

```bash
cp mon-produit.jpg images/rewards/
```

2. Regenerer l'index:

```bash
npm run index
```

3. Commit et push:

```bash
git add .
git commit -m "Add reward images"
git push
```

## URL a mettre en base

Option recommandee avec GitHub Pages:

```text
https://OWNER.github.io/gofid-images/images/rewards/mon-produit.jpg
```

Option directe GitHub Raw:

```text
https://raw.githubusercontent.com/OWNER/gofid-images/main/images/rewards/mon-produit.jpg
```

Dans GOFID, renseigner cette URL dans le champ image du produit recompense.

## Generer l'index avec les bonnes URLs

Par defaut, le script utilise:

```text
OWNER=OWNER
REPO=gofid-images
BRANCH=main
```

Pour generer avec ton compte GitHub:

```bash
GITHUB_OWNER=ton-compte GITHUB_REPO=gofid-images npm run index
```

Le fichier `metadata/images.json` contiendra les URLs `githubPagesUrl` et `rawUrl`.

## Activer GitHub Pages

Dans GitHub:

1. Ouvrir le repo `gofid-images`.
2. Aller dans `Settings`.
3. Aller dans `Pages`.
4. Source: `Deploy from a branch`.
5. Branch: `main`.
6. Folder: `/root`.

Ensuite les images seront disponibles sous:

```text
https://OWNER.github.io/gofid-images/images/...
```

## Formats conseilles

- `.jpg` ou `.webp` pour les photos produits.
- `.png` pour les logos avec transparence.
- Taille recommandee: moins de 500 Ko par image.
- Nommer les fichiers sans espaces, par exemple `riz-parfume-5kg.jpg`.
