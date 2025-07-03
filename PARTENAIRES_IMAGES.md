# 📋 Guide de préparation des images partenaires

## 🎯 Objectif
Créer un bandeau défilant avec 10 logos de partenaires pour la section "Partenaires RSE & Collaborations"

## 📁 Structure des fichiers
Placez vos images dans le dossier `images/` avec les noms suivants :

```
images/
├── partenaire1.png
├── partenaire2.png
├── partenaire3.png
├── partenaire4.png
├── partenaire5.png
├── partenaire6.png
├── partenaire7.png
├── partenaire8.png
├── partenaire9.png
└── partenaire10.png
```

## 🖼️ Spécifications techniques

### Format recommandé
- **Format** : PNG (avec fond transparent) ou JPG
- **Résolution** : Minimum 300x150px
- **Taille fichier** : Maximum 500KB par image

### Dimensions optimales
- **Largeur** : 150px (120px sur mobile)
- **Hauteur** : 80px (60px sur mobile)
- **Ratio** : 2:1 ou 3:1 (paysage)

### Qualité visuelle
- **Fond** : Transparent ou blanc
- **Couleurs** : Logos en couleur (seront en noir/blanc par défaut, couleur au survol)
- **Lisibilité** : Logo clair et reconnaissable même en petit

## 🔧 Fonctionnalités du bandeau

### Animation
- **Défilement continu** : 30 secondes pour un cycle complet
- **Pause au survol** : L'animation se met en pause quand on survole
- **Défilement fluide** : Transition continue sans interruption

### Effets visuels
- **Grayscale par défaut** : Logos en noir/blanc
- **Couleur au survol** : Retour aux couleurs originales
- **Élévation** : Effet 3D au survol
- **Bordure dorée** : Accent de couleur au survol

### Responsive
- **Desktop** : 150x80px
- **Mobile** : 120x60px
- **Vitesse adaptée** : Plus rapide sur mobile (20s vs 30s)

## 📝 Liste des partenaires suggérés

1. **IFREMER** - Institut français de recherche pour l'exploitation de la mer
2. **Universités partenaires** - Logo générique ou consortium
3. **Chantiers Bretons** - Partenaires navals
4. **OTECI** - Association d'ex-cadres
5. **Virtual Regatta** - Partenaire jeu virtuel
6. **Organismes environnementaux** - ONG, associations
7. **Institutions publiques** - Régions, départements
8. **Entreprises RSE** - Partenaires privés engagés
9. **Médias partenaires** - Presse, audiovisuel
10. **Sponsors techniques** - Équipement, technologie

## 🚀 Installation

1. **Préparez vos images** selon les spécifications ci-dessus
2. **Renommez-les** : `partenaire1.png`, `partenaire2.png`, etc.
3. **Placez-les** dans le dossier `images/`
4. **Testez** : Ouvrez la page pour vérifier l'affichage

## ⚠️ Notes importantes

- Les images doivent être de **même taille** pour un rendu uniforme
- Privilégiez les **formats PNG** avec fond transparent
- Testez sur **mobile** pour vérifier la lisibilité
- Optimisez les **tailles de fichiers** pour le web

## 🎨 Personnalisation

Pour modifier l'apparence du bandeau, éditez les styles dans `styles.css` :
- Vitesse de défilement : `.partenaires-scroll` animation-duration
- Taille des logos : `.partenaire-logo` width/height
- Couleurs : Variables CSS dans `:root` 