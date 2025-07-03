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
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const message = this.querySelector('textarea').value;
        
        // Validation basique
        if (!name || !email || !message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Simulation d'envoi
        showNotification('Envoi en cours...', 'info');
        
        setTimeout(() => {
            showNotification('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
            this.reset();
        }, 2000);
    });
}

// Validation email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

// === TRADUCTION DYNAMIQUE ===
const translations = {
  fr: {
    nav: [
      'Présentation', 'Projet', 'Réseau', 'Jeux & Concours', 'Contact', 'Vidéo',
      'Qui Sommes Nous', 'Notre Équipe', 'Notre Mission', 'Nos Expéditions', "L'Équipage", 'RSE', 'ODD', 'Presse'
    ],
    heroTitle: 'La Route du Cacao',
    heroSubtitle: 'Une expédition pour rêver, apprendre et agir',
    heroDesc: "2 bateaux légendaires, 1 génération d'espoirs, 2 continents de solutions. Une odyssée humaine et écologique à travers 12 pays d'Amérique latine.",
    heroBtn1: 'Découvrir',
    heroBtn2: 'Nous Rejoindre',
    // Ajoute ici d'autres textes à traduire si besoin
  },
  en: {
    nav: [
      'Presentation', 'Project', 'Network', 'Games & Contests', 'Contact', 'Video',
      'About Us', 'Our Team', 'Our Mission', 'Our Expeditions', 'The Crew', 'CSR', 'SDGs', 'Press'
    ],
    heroTitle: 'The Cocoa Route',
    heroSubtitle: 'An expedition to dream, learn and act',
    heroDesc: '2 legendary boats, 1 generation of hope, 2 continents of solutions. A human and ecological odyssey through 12 Latin American countries.',
    heroBtn1: 'Discover',
    heroBtn2: 'Join Us',
  },
  es: {
    nav: [
      'Presentación', 'Proyecto', 'Red', 'Juegos y Concursos', 'Contacto', 'Vídeo',
      'Quiénes Somos', 'Nuestro Equipo', 'Nuestra Misión', 'Nuestras Expediciones', 'La Tripulación', 'RSE', 'ODS', 'Prensa'
    ],
    heroTitle: 'La Ruta del Cacao',
    heroSubtitle: 'Una expedición para soñar, aprender y actuar',
    heroDesc: '2 barcos legendarios, 1 generación de esperanzas, 2 continentes de soluciones. Una odisea humana y ecológica a través de 12 países de América Latina.',
    heroBtn1: 'Descubrir',
    heroBtn2: 'Únete',
  }
};

function setLang(lang) {
  localStorage.setItem('siteLang', lang);
  applyLang(lang);
}

function applyLang(lang) {
  const t = translations[lang] || translations.fr;
  // Menu principal
  const navMenu = document.querySelectorAll('.nav-menu > li');
  if(navMenu.length >= 5) {
    navMenu[0].querySelector('.dropdown-toggle').childNodes[0].nodeValue = t.nav[0] + ' ';
    navMenu[1].querySelector('.dropdown-toggle').childNodes[0].nodeValue = t.nav[1] + ' ';
    navMenu[2].querySelector('.dropdown-toggle').childNodes[0].nodeValue = t.nav[2] + ' ';
    navMenu[3].querySelector('a').textContent = t.nav[3];
    navMenu[4].querySelector('.dropdown-toggle').childNodes[0].nodeValue = t.nav[4] + ' ';
  }
  // Vidéo
  const videoBtn = document.querySelector('.nav-video-btn');
  if(videoBtn) videoBtn.childNodes[2].nodeValue = t.nav[5];
  // Dropdown Présentation
  const presDropdown = navMenu[0].querySelectorAll('.dropdown-menu a');
  if(presDropdown.length >= 2) {
    presDropdown[0].textContent = t.nav[6];
    presDropdown[1].textContent = t.nav[7];
  }
  // Dropdown Projet
  const projDropdown = navMenu[1].querySelectorAll('.dropdown-menu a');
  if(projDropdown.length >= 3) {
    projDropdown[0].textContent = t.nav[8];
    projDropdown[1].textContent = t.nav[9];
    projDropdown[2].textContent = t.nav[10];
    if(projDropdown[3]) projDropdown[3].textContent = t.nav[11];
    if(projDropdown[4]) projDropdown[4].textContent = t.nav[12];
    if(projDropdown[5]) projDropdown[5].textContent = t.nav[13];
  }
  // Dropdown Réseau
  const netDropdown = navMenu[2].querySelectorAll('.dropdown-menu a');
  if(netDropdown.length >= 3) {
    netDropdown[0].textContent = t.nav[11];
    netDropdown[1].textContent = t.nav[12];
    netDropdown[2].textContent = t.nav[13];
  }
  // Hero
  const heroTitle = document.querySelector('.hero-content h1');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroDesc = document.querySelector('.hero-description');
  const heroBtns = document.querySelectorAll('.hero-buttons .btn');
  if(heroTitle) heroTitle.textContent = t.heroTitle;
  if(heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
  if(heroDesc) heroDesc.textContent = t.heroDesc;
  if(heroBtns.length >= 2) {
    heroBtns[0].textContent = t.heroBtn1;
    heroBtns[1].textContent = t.heroBtn2;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...
  // Sélecteur de langue (drapeau unique + menu custom)
  const langActiveBtn = document.getElementById('langActiveBtn');
  const langActiveFlag = document.getElementById('langActiveFlag');
  const langDropdown = document.getElementById('langDropdown');
  if(langActiveBtn && langActiveFlag && langDropdown) {
    // Appliquer la langue au chargement
    let lang = localStorage.getItem('siteLang') || 'fr';
    setLangFlag(lang);
    applyLang(lang);
    hideCurrentFlag(lang);
    langActiveBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.querySelectorAll('.langDropBtn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const newLang = this.dataset.lang;
        setLang(newLang);
        setLangFlag(newLang);
        hideCurrentFlag(newLang);
        langDropdown.style.display = 'none';
      });
    });
    document.addEventListener('click', function() {
      langDropdown.style.display = 'none';
    });
  }
});

function setLangFlag(lang) {
  const langActiveFlag = document.getElementById('langActiveFlag');
  if(!langActiveFlag) return;
  let flag = '';
  switch(lang) {
    case 'fr': flag = 'https://flagcdn.com/fr.svg'; break;
    case 'en': flag = 'https://flagcdn.com/gb.svg'; break;
    case 'es': flag = 'https://flagcdn.com/es.svg'; break;
    default: flag = 'https://flagcdn.com/fr.svg';
  }
  langActiveFlag.src = flag;
}
function hideCurrentFlag(lang) {
  document.querySelectorAll('.langDropBtn').forEach(btn => {
    btn.style.display = (btn.dataset.lang === lang) ? 'none' : 'block';
  });
}

 