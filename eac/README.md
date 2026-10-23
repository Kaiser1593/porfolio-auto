# Entr'Aide et Culture (EAC) — site web

Site statique (HTML/CSS/JS, sans dépendance) de l'association d'aide aux devoirs *Entr'Aide et Culture*.

| Page | Fichier |
|---|---|
| Accueil — aide aux devoirs | `index.html` |
| Infos & évènements | `infos.html` |
| Adhésion | `adhesion.html` |
| Dons | `don.html` |

## Modifier le site
- **Ajouter un évènement** : éditer `evenements.js` (copier un bloc, changer date/titre/lieu/description). Les évènements passés passent automatiquement dans « Évènements passés ».
- **E-mail, cotisation, liens de paiement** : `config.js`.
- **Paiement en ligne des dons/adhésions** : créer les formulaires sur [HelloAsso](https://www.helloasso.com) (gratuit pour les associations) puis coller les liens dans `lienDon` et `lienAdhesion` de `config.js`.
- **Horaires / lieu des séances** : à renseigner dans `index.html`.

## Publier
Activer GitHub Pages (Settings → Pages) sur la branche voulue, en servant le dossier contenant ce site.
