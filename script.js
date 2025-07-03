// EmailJS Configuration
(function() {
    emailjs.init("C7e5GOWi_3WRRYN_D"); // Clé publique EmailJS
})();

// Navigation mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fermer le menu mobile quand on clique sur un lien
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Gestion du menu déroulant sur mobile
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = toggle.nextElementSibling;
            const isOpen = dropdown.style.display === 'block';
            
            // Fermer tous les autres dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
            
            // Toggle le dropdown actuel
            dropdown.style.display = isOpen ? 'none' : 'block';
            
            // Rotation de l'icône
            const icon = toggle.querySelector('i');
            icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    });
});

// Effet de scroll sur la navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Navigation fluide vers les sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation de la navbar au scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(139, 69, 19, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animation des éléments au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les éléments à animer
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.expedition-card, .equipage-item, .partenaire-item, .stat, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Animation des statistiques
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '') + (stat.textContent.includes('%') ? '%' : '');
        }, 30);
    });
}

// Déclencher l'animation des stats quand la section est visible
const statsSection = document.querySelector('#histoire');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const nameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const messageInput = this.querySelector('textarea');
        const name = nameInput ? nameInput.value : '';
        const email = emailInput ? emailInput.value : '';
        const message = messageInput ? messageInput.value : '';
        
        // Validation basique
        if (!name || !email || !message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Envoi par EmailJS
        showNotification('Envoi en cours...', 'info');
        
        const formData = { name, email, message };
        sendFormEmail(formData, 'contact')
            .then(result => {
                if (result.success) {
                    showNotification('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
                    this.reset();
                } else {
                    showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            });
    });
}

// Validation email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonction pour envoyer les formulaires par email
function sendFormEmail(formData, formType) {
    const templateParams = {
        to_email: 'contact@larouteducacao.org',
        from_name: formData.name || formData.nom || 'Visiteur',
        from_email: formData.email || formData.mail || 'noreply@larouteducacao.org',
        subject: `Nouveau message - ${formType}`,
        message: formatFormMessage(formData, formType)
    };

    return emailjs.send('service_pz6ywo8', 'template_ggvli9r', templateParams)
        .then(function(response) {
            console.log('Email envoyé avec succès:', response);
            return { success: true, message: 'Message envoyé avec succès !' };
        })
        .catch(function(error) {
            console.error('Erreur lors de l\'envoi:', error);
            return { success: false, message: 'Erreur lors de l\'envoi du message.' };
        });
}

// Fonction pour formater le message selon le type de formulaire
function formatFormMessage(formData, formType) {
    let message = `Nouveau message reçu via le site web\n\n`;
    message += `Type de formulaire: ${formType}\n`;
    message += `Date: ${new Date().toLocaleString('fr-FR')}\n\n`;

    switch(formType) {
        case 'contact':
            message += `Nom: ${formData.name || 'Non renseigné'}\n`;
            message += `Email: ${formData.email || 'Non renseigné'}\n`;
            message += `Message: ${formData.message || 'Non renseigné'}\n`;
            break;
        case 'partenaire':
            message += `Organisation: ${formData.nom || 'Non renseigné'}\n`;
            message += `Secteur: ${formData.secteur || 'Non renseigné'}\n`;
            message += `Nom contact: ${formData.contact || 'Non renseigné'}\n`;
            message += `Email: ${formData.mail || 'Non renseigné'}\n`;
            message += `Téléphone: ${formData.telephone || 'Non renseigné'}\n`;
            message += `Type partenariat: ${formData.type || 'Non renseigné'}\n`;
            message += `Budget: ${formData.budget || 'Non renseigné'}\n`;
            message += `Projet: ${formData.projet || 'Non renseigné'}\n`;
            break;
        case 'bee-card':
            message += `Nom: ${formData.nom || 'Non renseigné'}\n`;
            message += `Email: ${formData.email || 'Non renseigné'}\n`;
            message += `Pays: ${formData.pays || 'Non renseigné'}\n`;
            message += `Message: ${formData.message || 'Non renseigné'}\n`;
            break;
        default:
            message += `Données reçues: ${JSON.stringify(formData, null, 2)}\n`;
    }

    return message;
}

// Système de notification
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Styles de la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Fermeture automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Fermeture manuelle
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Animation des cartes expédition au hover
document.querySelectorAll('.expedition-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Animation des icônes d'équipage
document.querySelectorAll('.equipage-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'rotate(360deg) scale(1.1)';
        this.style.transition = 'transform 0.6s ease';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'rotate(0deg) scale(1)';
    });
});

// Animation des partenaires
document.querySelectorAll('.partenaire-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.03)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy loading des images (pour les futures images)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialiser le lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Préchargement des polices pour une meilleure performance
if ('fonts' in document) {
    Promise.all([
        document.fonts.load('400 1em Poppins'),
        document.fonts.load('700 1em Poppins'),
        document.fonts.load('400 1em Playfair Display'),
        document.fonts.load('700 1em Playfair Display')
    ]).then(() => {
        document.body.style.fontFamily = 'Poppins, sans-serif';
    });
}

// Gestion du thème sombre/clair (optionnel)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Charger le thème sauvegardé
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
});

// Ajouter un bouton de retour en haut
function addBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(139, 69, 19, 0.3);
    `;
    
    document.body.appendChild(backToTop);
    
    // Afficher/masquer le bouton selon le scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Action du bouton
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Effet hover
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'translateY(-3px)';
        backToTop.style.background = 'var(--secondary-color)';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'translateY(0)';
        backToTop.style.background = 'var(--primary-color)';
    });
}

// Initialiser le bouton de retour en haut
document.addEventListener('DOMContentLoaded', addBackToTopButton);

document.addEventListener('DOMContentLoaded', function() {
    // Popup HELP
    const helpBtn = document.getElementById('helpBtn');
    const helpPopup = document.getElementById('helpPopup');
    const helpPopupContent = document.getElementById('helpPopupContent');
    const closeHelpPopup = document.getElementById('closeHelpPopup');
    const helpActionBtn = document.getElementById('helpActionBtn');
    if(helpBtn && helpPopup && helpPopupContent) {
        helpBtn.addEventListener('click', function() {
            // Récupérer le message d'aide depuis localStorage
            const type = localStorage.getItem('helpMsgType');
            const msg = localStorage.getItem('helpMsgText');
            let typeLabel = '';
            switch(type) {
                case 'aide-bateau': typeLabel = 'Aide sur le bateau'; break;
                case 'nourriture': typeLabel = 'Nourriture'; break;
                case 'argent': typeLabel = 'Argent'; break;
                case 'autre': typeLabel = 'Autre'; break;
                default: typeLabel = '';
            }
            if(typeLabel && msg) {
                helpPopupContent.innerHTML = `<strong>${typeLabel}</strong><br>${msg}`;
            } else {
                helpPopupContent.innerHTML = `<em>Aucun message d'aide n'a été défini pour le moment.</em>`;
            }
            helpPopup.style.display = 'flex';
        });
        closeHelpPopup.addEventListener('click', function() {
            helpPopup.style.display = 'none';
        });
        helpActionBtn.addEventListener('click', function() {
            helpPopup.style.display = 'none';
            // Ici, on pourrait ajouter une action (formulaire, contact, etc)
        });
    }
});

// Système de traduction complet
const translations = {
    fr: {
        // Navigation
        'presentation': 'Présentation',
        'qui-sommes-nous': 'Qui Sommes Nous',
        'notre-equipe': 'Notre Équipe',
        'projet': 'Projet',
        'notre-mission': 'Notre Mission',
        'nos-expeditions': 'Nos Expéditions',
        'lequipage': 'L\'Équipage',
        'reseau': 'Réseau',
        'partenaires': 'Partenaires',
        'devenir-partenaire': 'Devenir Partenaire',
        'presse': 'Presse',
        'jeux-concours': 'Jeux & Concours',
        'contact': 'Contact',
        'video': 'Vidéo',
        'help': 'HELP',
        
        // Page d'accueil
        'hero-title': 'La Route du Cacao',
        'hero-subtitle': 'Une expédition pour rêver, apprendre et agir',
        'mission-title': 'Notre Mission',
        'mission-subtitle': 'Mettre la lumière sur l\'écologie positive et active',
        'mission-heading': 'Une Renaissance Bleue pour une Cause Verte',
        'mission-text-1': 'À Brest, deux IMOCA mythiques reprennent la mer, restaurés, transformés, ils voguent vers un nouveau récit : celui d\'un monde en transition.',
        'mission-text-2': 'À leur bord, une équipe d\'étudiants engagés en énergie, écologie, architecture et audiovisuel, sélectionnés pour la pertinence de leur projet et passionnés par la rencontre et la transmission.',
        'bateaux-imoca': 'Bateaux IMOCA',
        'pays-traverses': 'Pays traversés',
        'mois-expedition': 'Mois d\'expédition',
        
        // Expéditions
        'expeditions-title': 'Nos Expéditions',
        'chantier-naval': 'Chantier Naval',
        'chantier-date': 'Juil. 2025 - Mars 2026',
        'chantier-desc': 'Restauration de nos 2 IMOCA mythiques transformés en laboratoires flottants pour l\'économie bleue.',
        'appel-projets': 'Appel à Projets',
        'appel-date': 'Sept. 2025 - Mai 2026',
        'appel-desc': 'Sélection de 12 étudiants ambassadeurs pour documenter les solutions durables locales.',
        'tours-europe': 'Tours d\'Europe',
        'tours-date': 'Mars 2026 - Août 2026',
        'tours-desc': '33 escales en Europe pour partager le rêve, rencontrer, inspirer et rassembler.',
        'expedition-transatlantique': 'Expédition Transatlantique',
        'expedition-date': 'Oct. 2026 - Avril 2027',
        'expedition-desc': 'Odyssée humaine et écologique à travers 12 pays d\'Amérique latine.',
        
        // Équipage
        'equipage-title': 'L\'Équipage',
        'equipage-subtitle': 'Une équipe d\'étudiants engagés pour la transition écologique',
        'laureats-bateau': '8 Lauréats par Bateau',
        'laureats-desc': 'Étudiants sélectionnés en énergie, écologie, architecture et audiovisuel pour documenter les solutions durables.',
        'recherche-scientifique': 'Recherche Scientifique',
        'recherche-desc': 'Partenariat avec l\'IFREMER pour des relevés environnementaux : température, biodiversité marine, pollution plastique.',
        'documentaire-immersif': 'Documentaire Immersif',
        'documentaire-desc': 'Mini-séries, carnets de bord, capsules vidéo pour partager l\'aventure et inspirer l\'action.',
        
        // Partenaires
        'partenaires-title': 'Partenaires RSE & Collaborations',
        'partenaires-subtitle': 'Un écosystème d\'acteurs engagés pour la transition écologique',
        'devenir-partenaire-btn': 'Devenir Partenaire',
        'partenaires-cta': 'Rejoignez notre écosystème d\'acteurs engagés pour la transition écologique',
        
        // Footer
        'footer-tagline': 'Une expédition pour rêver, apprendre et agir',
        'liens-rapides': 'Liens Rapides',
        'accueil': 'Accueil',
        'informations': 'Informations',
        'mentions-legales': 'Mentions légales',
        'politique-confidentialite': 'Politique de confidentialité',
        'cgv': 'CGV',
        'faq': 'FAQ',
        'votre-nom': 'Votre nom',
        'votre-email': 'Votre email',
        'votre-message': 'Votre message',
        'envoyer': 'Envoyer',
        'copyright': '© 2024 La Route du Cacao. Tous droits réservés.',
        'site-realise-par': 'Site réalisé par',
        
        // Popup construction
        'construction-title': '🚧 Site en cours de finalisation 🚧',
        'construction-text': 'Nous travaillons actuellement sur la finalisation de notre site web. Certaines fonctionnalités peuvent encore être en cours de développement.',
        'construction-thanks': 'Merci de votre patience !',
        'construction-btn': 'Compris, continuer',
        
        // HELP popup
        'help-title': 'Aidez-nous !',
        'help-btn': 'Donner un coup de main'
    },
    
    en: {
        // Navigation
        'presentation': 'Presentation',
        'qui-sommes-nous': 'Who We Are',
        'notre-equipe': 'Our Team',
        'projet': 'Project',
        'notre-mission': 'Our Mission',
        'nos-expeditions': 'Our Expeditions',
        'lequipage': 'The Crew',
        'reseau': 'Network',
        'partenaires': 'Partners',
        'devenir-partenaire': 'Become a Partner',
        'presse': 'Press',
        'jeux-concours': 'Games & Contests',
        'contact': 'Contact',
        'video': 'Video',
        'help': 'HELP',
        
        // Page d'accueil
        'hero-title': 'The Chocolate Route',
        'hero-subtitle': 'An expedition to dream, learn and act',
        'mission-title': 'Our Mission',
        'mission-subtitle': 'Shining a light on positive and active ecology',
        'mission-heading': 'A Blue Renaissance for a Green Cause',
        'mission-text-1': 'In Brest, two mythical IMOCAs return to sea, restored, transformed, they sail towards a new narrative: that of a world in transition.',
        'mission-text-2': 'On board, a team of students committed to energy, ecology, architecture and audiovisual, selected for the relevance of their project and passionate about meeting and transmission.',
        'bateaux-imoca': 'IMOCA Boats',
        'pays-traverses': 'Countries crossed',
        'mois-expedition': 'Months of expedition',
        
        // Expéditions
        'expeditions-title': 'Our Expeditions',
        'chantier-naval': 'Shipyard',
        'chantier-date': 'Jul. 2025 - Mar. 2026',
        'chantier-desc': 'Restoration of our 2 mythical IMOCAs transformed into floating laboratories for the blue economy.',
        'appel-projets': 'Project Call',
        'appel-date': 'Sep. 2025 - May 2026',
        'appel-desc': 'Selection of 12 student ambassadors to document local sustainable solutions.',
        'tours-europe': 'European Tours',
        'tours-date': 'Mar. 2026 - Aug. 2026',
        'tours-desc': '33 stops in Europe to share the dream, meet, inspire and gather.',
        'expedition-transatlantique': 'Transatlantic Expedition',
        'expedition-date': 'Oct. 2026 - Apr. 2027',
        'expedition-desc': 'Human and ecological odyssey across 12 Latin American countries.',
        
        // Équipage
        'equipage-title': 'The Crew',
        'equipage-subtitle': 'A team of students committed to ecological transition',
        'laureats-bateau': '8 Laureates per Boat',
        'laureats-desc': 'Students selected in energy, ecology, architecture and audiovisual to document sustainable solutions.',
        'recherche-scientifique': 'Scientific Research',
        'recherche-desc': 'Partnership with IFREMER for environmental surveys: temperature, marine biodiversity, plastic pollution.',
        'documentaire-immersif': 'Immersive Documentary',
        'documentaire-desc': 'Mini-series, logbooks, video capsules to share the adventure and inspire action.',
        
        // Partenaires
        'partenaires-title': 'CSR Partners & Collaborations',
        'partenaires-subtitle': 'An ecosystem of actors committed to ecological transition',
        'devenir-partenaire-btn': 'Become a Partner',
        'partenaires-cta': 'Join our ecosystem of actors committed to ecological transition',
        
        // Footer
        'footer-tagline': 'An expedition to dream, learn and act',
        'liens-rapides': 'Quick Links',
        'accueil': 'Home',
        'informations': 'Information',
        'mentions-legales': 'Legal notice',
        'politique-confidentialite': 'Privacy policy',
        'cgv': 'Terms & Conditions',
        'faq': 'FAQ',
        'votre-nom': 'Your name',
        'votre-email': 'Your email',
        'votre-message': 'Your message',
        'envoyer': 'Send',
        'copyright': '© 2024 The Chocolate Route. All rights reserved.',
        'site-realise-par': 'Website created by',
        
        // Popup construction
        'construction-title': '🚧 Website under construction 🚧',
        'construction-text': 'We are currently working on finalizing our website. Some features may still be under development.',
        'construction-thanks': 'Thank you for your patience!',
        'construction-btn': 'Got it, continue',
        
        // HELP popup
        'help-title': 'Help us!',
        'help-btn': 'Give a helping hand'
    },
    
    es: {
        // Navigation
        'presentation': 'Presentación',
        'qui-sommes-nous': 'Quiénes Somos',
        'notre-equipe': 'Nuestro Equipo',
        'projet': 'Proyecto',
        'notre-mission': 'Nuestra Misión',
        'nos-expeditions': 'Nuestras Expediciones',
        'lequipage': 'La Tripulación',
        'reseau': 'Red',
        'partenaires': 'Socios',
        'devenir-partenaire': 'Convertirse en Socio',
        'presse': 'Prensa',
        'jeux-concours': 'Juegos y Concursos',
        'contact': 'Contacto',
        'video': 'Vídeo',
        'help': 'AYUDA',
        
        // Page d'accueil
        'hero-title': 'La Ruta del Cacao',
        'hero-subtitle': 'Una expedición para soñar, aprender y actuar',
        'mission-title': 'Nuestra Misión',
        'mission-subtitle': 'Poner la luz sobre la ecología positiva y activa',
        'mission-heading': 'Un Renacimiento Azul para una Causa Verde',
        'mission-text-1': 'En Brest, dos IMOCA míticos vuelven al mar, restaurados, transformados, navegan hacia una nueva narrativa: la de un mundo en transición.',
        'mission-text-2': 'A bordo, un equipo de estudiantes comprometidos con la energía, ecología, arquitectura y audiovisual, seleccionados por la relevancia de su proyecto y apasionados por el encuentro y la transmisión.',
        'bateaux-imoca': 'Barcos IMOCA',
        'pays-traverses': 'Países atravesados',
        'mois-expedition': 'Meses de expedición',
        
        // Expéditions
        'expeditions-title': 'Nuestras Expediciones',
        'chantier-naval': 'Astillero',
        'chantier-date': 'Jul. 2025 - Mar. 2026',
        'chantier-desc': 'Restauración de nuestros 2 IMOCA míticos transformados en laboratorios flotantes para la economía azul.',
        'appel-projets': 'Convocatoria de Proyectos',
        'appel-date': 'Sep. 2025 - May. 2026',
        'appel-desc': 'Selección de 12 estudiantes embajadores para documentar soluciones sostenibles locales.',
        'tours-europe': 'Giras Europeas',
        'tours-date': 'Mar. 2026 - Ago. 2026',
        'tours-desc': '33 escalas en Europa para compartir el sueño, encontrarse, inspirar y reunir.',
        'expedition-transatlantique': 'Expedición Transatlántica',
        'expedition-date': 'Oct. 2026 - Abr. 2027',
        'expedition-desc': 'Odisea humana y ecológica a través de 12 países de América Latina.',
        
        // Équipage
        'equipage-title': 'La Tripulación',
        'equipage-subtitle': 'Un equipo de estudiantes comprometidos con la transición ecológica',
        'laureats-bateau': '8 Laureados por Barco',
        'laureats-desc': 'Estudiantes seleccionados en energía, ecología, arquitectura y audiovisual para documentar soluciones sostenibles.',
        'recherche-scientifique': 'Investigación Científica',
        'recherche-desc': 'Asociación con IFREMER para relevamientos ambientales: temperatura, biodiversidad marina, contaminación plástica.',
        'documentaire-immersif': 'Documental Inmersivo',
        'documentaire-desc': 'Miniseries, diarios de a bordo, cápsulas de video para compartir la aventura e inspirar la acción.',
        
        // Partenaires
        'partenaires-title': 'Socios RSE y Colaboraciones',
        'partenaires-subtitle': 'Un ecosistema de actores comprometidos con la transición ecológica',
        'devenir-partenaire-btn': 'Convertirse en Socio',
        'partenaires-cta': 'Únete a nuestro ecosistema de actores comprometidos con la transición ecológica',
        
        // Footer
        'footer-tagline': 'Una expedición para soñar, aprender y actuar',
        'liens-rapides': 'Enlaces Rápidos',
        'accueil': 'Inicio',
        'informations': 'Información',
        'mentions-legales': 'Aviso legal',
        'politique-confidentialite': 'Política de privacidad',
        'cgv': 'Términos y condiciones',
        'faq': 'FAQ',
        'votre-nom': 'Tu nombre',
        'votre-email': 'Tu email',
        'votre-message': 'Tu mensaje',
        'envoyer': 'Enviar',
        'copyright': '© 2024 La Ruta del Cacao. Todos los derechos reservados.',
        'site-realise-par': 'Sitio web creado por',
        
        // Popup construction
        'construction-title': '🚧 Sitio web en construcción 🚧',
        'construction-text': 'Actualmente estamos trabajando en la finalización de nuestro sitio web. Algunas funciones pueden estar aún en desarrollo.',
        'construction-thanks': '¡Gracias por tu paciencia!',
        'construction-btn': 'Entendido, continuar',
        
        // HELP popup
        'help-title': '¡Ayúdanos!',
        'help-btn': 'Echar una mano'
    }
};

// Fonction de traduction
function translatePage(lang) {
    if (!translations[lang]) return;
    
    // Mettre à jour l'attribut lang de la page
    document.documentElement.lang = lang;
    
    // Mettre à jour le drapeau actif
    const langActiveFlag = document.getElementById('langActiveFlag');
    if (langActiveFlag) {
        langActiveFlag.src = `https://flagcdn.com/${lang === 'en' ? 'gb' : lang}.svg`;
    }
    
    // Traduire tous les éléments avec data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Traduire les placeholders
    document.querySelectorAll('input[data-translate-placeholder], textarea[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Sauvegarder la langue choisie
    localStorage.setItem('selectedLanguage', lang);
}

// Initialiser la traduction au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer la langue sauvegardée ou utiliser le français par défaut
    const savedLang = localStorage.getItem('selectedLanguage') || 'fr';
    translatePage(savedLang);
    
    // Gérer les clics sur les boutons de langue
    document.querySelectorAll('.langDropBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            translatePage(lang);
        });
    });
    
    // Gérer l'ouverture/fermeture du dropdown de langue
    const langActiveBtn = document.getElementById('langActiveBtn');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langActiveBtn && langDropdown) {
        langActiveBtn.addEventListener('click', function() {
            langDropdown.style.display = langDropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        // Fermer le dropdown en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!langActiveBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.style.display = 'none';
            }
        });
    }
});

 