# Configuration EmailJS pour La Route du Cacao

## 🚀 Installation et Configuration

### 1. Créer un compte EmailJS
1. Allez sur [EmailJS.com](https://www.emailjs.com/)
2. Créez un compte gratuit
3. Vérifiez votre email

### 2. Configurer un service email
1. Dans votre dashboard EmailJS, allez dans "Email Services"
2. Cliquez sur "Add New Service"
3. Choisissez votre fournisseur email (Gmail, Outlook, etc.)
4. Connectez votre compte email
5. Notez l'ID du service créé (ex: `service_xxxxxxx`)

### 3. Créer un template email
1. Allez dans "Email Templates"
2. Cliquez sur "Create New Template"
3. Créez un template avec les variables suivantes :
   - `{{to_email}}` - Email de destination
   - `{{from_name}}` - Nom de l'expéditeur
   - `{{from_email}}` - Email de l'expéditeur
   - `{{subject}}` - Sujet du message
   - `{{message}}` - Contenu du message
4. Notez l'ID du template créé (ex: `template_xxxxxxx`)

### 4. Obtenir votre clé publique
1. Allez dans "Account" > "API Keys"
2. Copiez votre "Public Key"

### 5. Mettre à jour le code
Dans le fichier `script.js`, remplacez les valeurs suivantes :

```javascript
// Ligne 3 : Remplacez YOUR_EMAILJS_PUBLIC_KEY
emailjs.init("VOTRE_CLE_PUBLIQUE_ICI");

// Ligne 25 : Remplacez YOUR_SERVICE_ID et YOUR_TEMPLATE_ID
return emailjs.send('VOTRE_SERVICE_ID', 'VOTRE_TEMPLATE_ID', templateParams)
```

### 6. Exemple de configuration complète
```javascript
// EmailJS Configuration
(function() {
    emailjs.init("user_abc123def456"); // Votre clé publique
})();

// Dans la fonction sendFormEmail
return emailjs.send('service_xyz789', 'template_abc123', templateParams)
```

## 📧 Types de formulaires supportés

Le système envoie automatiquement les emails vers `contact@larouteducacao.org` pour :

1. **Formulaire de contact** (page d'accueil)
   - Nom, email, téléphone, message

2. **Formulaire partenaire** (page devenir-partenaire)
   - Organisation, secteur, contact, type de partenariat, budget, projet

3. **Formulaire carte d'abeille** (page qui-sommes-nous)
   - Nom, email, pays, message

## 🔧 Test de la configuration

1. Ouvrez la console du navigateur (F12)
2. Remplissez un formulaire sur le site
3. Vérifiez que l'email est bien envoyé
4. Vérifiez les logs dans la console

## 📝 Notes importantes

- Le compte gratuit EmailJS permet 200 emails par mois
- Les emails sont envoyés depuis votre compte email configuré
- Tous les emails arrivent sur `contact@larouteducacao.org`
- Le système inclut une validation basique des formulaires
- Les erreurs sont affichées à l'utilisateur

## 🆘 Dépannage

### Email non envoyé
- Vérifiez que votre clé publique est correcte
- Vérifiez que l'ID du service et du template sont corrects
- Vérifiez la console du navigateur pour les erreurs

### Erreur de configuration
- Assurez-vous que votre service email est bien connecté
- Vérifiez que votre template utilise les bonnes variables
- Testez avec un email simple d'abord

### Limite d'emails atteinte
- Passez à un plan payant EmailJS
- Ou configurez un autre service email 