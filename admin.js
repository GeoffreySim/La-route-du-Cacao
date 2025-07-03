// Admin JavaScript
class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.currentSection = 'dashboard';
        this.videos = JSON.parse(localStorage.getItem('adminVideos')) || [];
        this.lives = JSON.parse(localStorage.getItem('adminLives')) || [];
        this.playlists = JSON.parse(localStorage.getItem('adminPlaylists')) || [
            {
                id: 'recherche',
                name: 'Recherche Scientifique',
                description: 'Relevés environnementaux et études marines',
                icon: 'fas fa-microscope',
                videoCount: 0
            },
            {
                id: 'rencontres',
                name: 'Rencontres Humaines',
                description: 'Portraits et témoignages inspirants',
                icon: 'fas fa-users',
                videoCount: 0
            },
            {
                id: 'solutions',
                name: 'Solutions Durables',
                description: 'Innovations écologiques documentées',
                icon: 'fas fa-leaf',
                videoCount: 0
            },
            {
                id: 'vie-bord',
                name: 'Vie à Bord',
                description: 'Quotidien de l\'équipage en mer',
                icon: 'fas fa-ship',
                videoCount: 0
            }
        ];
        this.streamingStatus = {
            twitch: 'offline',
            youtube: 'offline'
        };
        
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.updateStats();
    }

    checkAuth() {
        const savedAuth = localStorage.getItem('adminAuth');
        if (savedAuth) {
            this.isAuthenticated = true;
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        this.showSection('dashboard');
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Navigation
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Add video button
        document.getElementById('addVideoBtn').addEventListener('click', () => {
            this.showVideoModal();
        });

        // Add live button
        document.getElementById('addLiveBtn').addEventListener('click', () => {
            this.showLiveModal();
        });

        // Add playlist button
        document.getElementById('addPlaylistBtn').addEventListener('click', () => {
            this.showPlaylistModal();
        });

        // Video URL change
        document.getElementById('videoUrl').addEventListener('input', (e) => {
            this.extractVideoId(e.target.value);
        });

        // Modal events
        this.bindModalEvents();

        // Contrôle du bouton HELP
        const toggleHelpBlink = document.getElementById('toggleHelpBlink');
        const helpBlinkStatus = document.getElementById('helpBlinkStatus');
        function updateAdminHelpBlink() {
            const blink = localStorage.getItem('helpBlink') === 'on';
            helpBlinkStatus.textContent = blink ? 'Clignotement ACTIVÉ' : 'Clignotement DÉSACTIVÉ';
            toggleHelpBlink.classList.toggle('help-blink', blink);
        }
        if(toggleHelpBlink && helpBlinkStatus) {
            updateAdminHelpBlink();
            toggleHelpBlink.onclick = function() {
                const blink = localStorage.getItem('helpBlink') === 'on';
                localStorage.setItem('helpBlink', blink ? 'off' : 'on');
                updateAdminHelpBlink();
                window.dispatchEvent(new Event('storage'));
            };
            window.addEventListener('storage', updateAdminHelpBlink);
        }

        // Gestion du formulaire de message HELP
        const helpMessageForm = document.getElementById('helpMessageForm');
        if(helpMessageForm) {
            helpMessageForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const type = document.getElementById('helpType').value;
                const message = document.getElementById('helpMessage').value.trim();
                if(!type || !message) {
                    alert('Merci de préciser le type de besoin et le message.');
                    return;
                }
                localStorage.setItem('helpMsgType', type);
                localStorage.setItem('helpMsgText', message);
                alert('Message d\'aide enregistré !');
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication (in production, use proper backend)
        if (username === 'admin' && password === 'cacao2024') {
            this.isAuthenticated = true;
            localStorage.setItem('adminAuth', 'true');
            this.showDashboard();
        } else {
            this.showLoginError();
        }
    }

    showLoginError() {
        const errorDiv = document.getElementById('loginError');
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('adminAuth');
        this.showLogin();
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from nav items
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        this.currentSection = sectionName;

        // Load section specific content
        switch(sectionName) {
            case 'videos':
                this.loadVideos();
                break;
            case 'playlists':
                this.loadPlaylists();
                break;
            case 'lives':
                this.loadLives();
                break;
        }
    }

    updateStats() {
        document.getElementById('totalVideos').textContent = this.videos.length;
        document.getElementById('totalLives').textContent = this.lives.length;
        document.getElementById('totalPlaylists').textContent = this.playlists.length;
        document.getElementById('totalViews').textContent = this.videos.reduce((sum, video) => sum + (video.views || 0), 0);
        
        // Mettre à jour le nombre de vidéos par playlist
        this.updatePlaylistCounts();
    }

    showVideoModal() {
        document.getElementById('videoModal').style.display = 'flex';
    }

    showLiveModal() {
        // Similar to video modal but for lives
        alert('Fonctionnalité live à implémenter');
    }

    bindModalEvents() {
        // Close modal
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.modal-cancel').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click
        document.getElementById('videoModal').addEventListener('click', (e) => {
            if (e.target.id === 'videoModal') {
                this.closeModal();
            }
        });

        document.getElementById('playlistModal').addEventListener('click', (e) => {
            if (e.target.id === 'playlistModal') {
                this.closePlaylistModal();
            }
        });

        // Video form submission
        document.getElementById('videoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addVideo();
        });

        // Playlist form submission
        document.getElementById('playlistForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPlaylist();
        });
    }

    closeModal() {
        document.getElementById('videoModal').style.display = 'none';
        document.getElementById('videoForm').reset();
        document.getElementById('videoId').value = '';
        document.getElementById('thumbnailUrl').value = '';
        
        // Reset modal title and button
        document.querySelector('.modal-header h3').textContent = 'Ajouter une vidéo';
        document.querySelector('.form-actions .btn-primary').textContent = 'Publier';
        
        // Clear editing state
        this.editingVideoId = null;
    }

    updateVideoUrlPlaceholder() {
        const platform = document.getElementById('videoPlatform').value;
        const urlInput = document.getElementById('videoUrl');
        const thumbnailInput = document.getElementById('thumbnailUrl');
        
        const placeholders = {
            youtube: 'https://www.youtube.com/watch?v=...',
            vimeo: 'https://vimeo.com/...',
            dailymotion: 'https://www.dailymotion.com/video/...',
            other: 'https://...'
        };
        
        urlInput.placeholder = placeholders[platform] || 'https://...';
        
        if (platform === 'youtube') {
            thumbnailInput.placeholder = 'https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg';
        } else {
            thumbnailInput.placeholder = 'URL de l\'image de prévisualisation';
        }
    }

    extractVideoId(url) {
        const platform = document.getElementById('videoPlatform').value;
        const videoIdInput = document.getElementById('videoId');
        const thumbnailInput = document.getElementById('thumbnailUrl');
        
        let videoId = '';
        
        switch(platform) {
            case 'youtube':
                // Support pour différents formats YouTube
                const youtubePatterns = [
                    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
                    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
                    /youtu\.be\/([^&\n?#]+)/
                ];
                
                for (let pattern of youtubePatterns) {
                    const match = url.match(pattern);
                    if (match) {
                        videoId = match[1];
                        videoIdInput.value = videoId;
                        if (!thumbnailInput.value) {
                            thumbnailInput.value = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                        }
                        break;
                    }
                }
                break;
                
            case 'vimeo':
                const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                if (vimeoMatch) {
                    videoId = vimeoMatch[1];
                    videoIdInput.value = videoId;
                }
                break;
                
            case 'dailymotion':
                const dailymotionMatch = url.match(/dailymotion\.com\/video\/([^_]+)/);
                if (dailymotionMatch) {
                    videoId = dailymotionMatch[1];
                    videoIdInput.value = videoId;
                }
                break;
        }
        
        console.log('Extracted video ID:', videoId);
    }

    addVideo() {
        const formData = new FormData(document.getElementById('videoForm'));
        
        // Check if we're editing an existing video
        if (this.editingVideoId) {
            // Update existing video
            const videoIndex = this.videos.findIndex(v => v.id === this.editingVideoId);
            if (videoIndex !== -1) {
                const existingVideo = this.videos[videoIndex];
                this.videos[videoIndex] = {
                    ...existingVideo,
                    title: formData.get('title'),
                    description: formData.get('description'),
                    platform: formData.get('platform'),
                    videoUrl: formData.get('videoUrl'),
                    videoId: formData.get('videoId'),
                    thumbnailUrl: formData.get('thumbnailUrl'),
                    duration: formData.get('duration'),
                    playlist: formData.get('playlist'),
                    tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                    lastModified: new Date().toISOString()
                };
                
                this.showNotification('Vidéo modifiée avec succès !', 'success');
            }
            this.editingVideoId = null;
        } else {
            // Add new video
            const video = {
                id: Date.now(),
                title: formData.get('title'),
                description: formData.get('description'),
                platform: formData.get('platform'),
                videoUrl: formData.get('videoUrl'),
                videoId: formData.get('videoId'),
                thumbnailUrl: formData.get('thumbnailUrl'),
                duration: formData.get('duration'),
                playlist: formData.get('playlist'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                date: new Date().toISOString(),
                views: 0
            };

            this.videos.push(video);
            this.showNotification('Vidéo ajoutée avec succès !', 'success');
        }

        localStorage.setItem('adminVideos', JSON.stringify(this.videos));
        
        this.closeModal();
        this.updateStats();
        this.loadVideos();
        this.updatePlaylistSelect();
    }

    loadVideos() {
        const videosList = document.querySelector('.videos-list');
        
        if (this.videos.length === 0) {
            videosList.innerHTML = `
                <div class="video-item">
                    <div class="video-info">
                        <h3>Aucune vidéo publiée</h3>
                        <p>Commencez par ajouter votre première vidéo</p>
                    </div>
                </div>
            `;
            return;
        }

        // Trier les vidéos par date (plus récentes en premier)
        const sortedVideos = [...this.videos].sort((a, b) => new Date(b.date) - new Date(a.date));

        videosList.innerHTML = sortedVideos.map(video => `
            <div class="video-item">
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <div class="video-meta">
                        <span class="video-platform">${video.platform.toUpperCase()}</span>
                        <span class="video-date">${new Date(video.date).toLocaleDateString()}</span>
                        <span class="video-views">${video.views} vues</span>
                        ${video.duration ? `<span class="video-duration">${video.duration}</span>` : ''}
                        ${video.playlist ? `<span class="video-playlist">${this.getPlaylistName(video.playlist)}</span>` : ''}
                    </div>
                    ${video.tags && video.tags.length > 0 ? `
                        <div class="video-tags">
                            ${video.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="video-actions">
                        <button class="btn btn-secondary" onclick="adminPanel.editVideo(${video.id})">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button class="btn btn-secondary" onclick="adminPanel.deleteVideo(${video.id})">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                        <a href="${video.videoUrl}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> Voir
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getPlaylistName(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        return playlist ? playlist.name : playlistId;
    }

    updatePlaylistCounts() {
        // Compter les vidéos par playlist
        this.playlists.forEach(playlist => {
            playlist.videoCount = this.videos.filter(video => video.playlist === playlist.id).length;
        });
        
        // Sauvegarder les playlists mises à jour
        localStorage.setItem('adminPlaylists', JSON.stringify(this.playlists));
    }

    loadPlaylists() {
        const playlistsGrid = document.querySelector('.playlists-grid');
        
        if (!playlistsGrid) return;
        
        playlistsGrid.innerHTML = this.playlists.map(playlist => `
            <div class="playlist-admin-card">
                <div class="playlist-icon">
                    <i class="${playlist.icon}"></i>
                </div>
                <h3>${playlist.name}</h3>
                <p>${playlist.description}</p>
                <span class="video-count">${playlist.videoCount} vidéo${playlist.videoCount > 1 ? 's' : ''}</span>
                <div class="playlist-actions">
                    <button class="btn btn-secondary" onclick="adminPanel.editPlaylist('${playlist.id}')">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    ${playlist.id !== 'recherche' && playlist.id !== 'rencontres' && playlist.id !== 'solutions' && playlist.id !== 'vie-bord' ? 
                        `<button class="btn btn-danger" onclick="adminPanel.deletePlaylist('${playlist.id}')">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>` : ''
                    }
                </div>
            </div>
        `).join('');
    }

    showPlaylistModal() {
        document.getElementById('playlistModal').style.display = 'flex';
    }

    addPlaylist() {
        const formData = new FormData(document.getElementById('playlistForm'));
        
        // Check if we're editing an existing playlist
        if (this.editingPlaylistId) {
            // Update existing playlist
            const playlistIndex = this.playlists.findIndex(p => p.id === this.editingPlaylistId);
            if (playlistIndex !== -1) {
                const existingPlaylist = this.playlists[playlistIndex];
                this.playlists[playlistIndex] = {
                    ...existingPlaylist,
                    name: formData.get('name'),
                    description: formData.get('description'),
                    icon: formData.get('icon')
                };
                
                this.showNotification('Playlist modifiée avec succès !', 'success');
            }
            this.editingPlaylistId = null;
        } else {
            // Add new playlist
            const playlist = {
                id: formData.get('id') || 'playlist-' + Date.now(),
                name: formData.get('name'),
                description: formData.get('description'),
                icon: formData.get('icon'),
                videoCount: 0
            };

            this.playlists.push(playlist);
            this.showNotification('Playlist créée avec succès !', 'success');
        }

        localStorage.setItem('adminPlaylists', JSON.stringify(this.playlists));
        
        this.closePlaylistModal();
        this.updateStats();
        this.loadPlaylists();
        this.updatePlaylistSelect();
    }

    closePlaylistModal() {
        document.getElementById('playlistModal').style.display = 'none';
        document.getElementById('playlistForm').reset();
        
        // Reset modal title and button
        document.querySelector('#playlistModal .modal-header h3').textContent = 'Créer une playlist';
        document.querySelector('#playlistForm .btn-primary').textContent = 'Créer';
        
        // Clear editing state
        this.editingPlaylistId = null;
    }

    updatePlaylistSelect() {
        const select = document.querySelector('select[name="playlist"]');
        if (select) {
            const currentValue = select.value;
            select.innerHTML = `
                <option value="">Aucune playlist</option>
                ${this.playlists.map(playlist => 
                    `<option value="${playlist.id}" ${playlist.id === currentValue ? 'selected' : ''}>${playlist.name}</option>`
                ).join('')}
            `;
        }
    }

    loadLives() {
        const livesList = document.querySelector('.lives-list');
        
        if (this.lives.length === 0) {
            livesList.innerHTML = `
                <div class="live-item">
                    <div class="live-info">
                        <h3>Aucun live programmé</h3>
                        <p>Programmez votre premier live streaming</p>
                    </div>
                </div>
            `;
        }
    }

    // Streaming functions
    connectTwitch() {
        this.updatePlatformStatus('twitch', 'connecting');
        setTimeout(() => {
            this.updatePlatformStatus('twitch', 'online');
            this.showNotification('Connecté à Twitch !', 'success');
        }, 2000);
    }

    connectYouTube() {
        this.updatePlatformStatus('youtube', 'connecting');
        setTimeout(() => {
            this.updatePlatformStatus('youtube', 'online');
            this.showNotification('Connecté à YouTube !', 'success');
        }, 2000);
    }

    startTwitchStream() {
        if (this.streamingStatus.twitch === 'online') {
            this.showNotification('Diffusion Twitch démarrée !', 'success');
        } else {
            this.showNotification('Connectez-vous d\'abord à Twitch', 'error');
        }
    }

    startYouTubeStream() {
        if (this.streamingStatus.youtube === 'online') {
            this.showNotification('Diffusion YouTube démarrée !', 'success');
        } else {
            this.showNotification('Connectez-vous d\'abord à YouTube', 'error');
        }
    }

    updatePlatformStatus(platform, status) {
        this.streamingStatus[platform] = status;
        const statusElement = document.querySelector(`.platform-card:nth-child(${platform === 'twitch' ? '1' : '2'}) .status-indicator`);
        const statusText = document.querySelector(`.platform-card:nth-child(${platform === 'twitch' ? '1' : '2'}) .platform-status span:last-child`);
        
        statusElement.className = `status-indicator ${status}`;
        statusText.textContent = status === 'online' ? 'Connecté' : status === 'connecting' ? 'Connexion...' : 'Déconnecté';
    }

    copyStreamKey(platform) {
        const streamKey = platform === 'twitch' ? 'rtmp://live.twitch.tv/app/' : 'rtmp://a.rtmp.youtube.com/live2/';
        navigator.clipboard.writeText(streamKey).then(() => {
            this.showNotification('Clé de diffusion copiée !', 'success');
        });
    }

    editVideo(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (video) {
            // Store the video ID being edited
            this.editingVideoId = videoId;
            
            // Populate modal with video data
            document.querySelector('input[name="title"]').value = video.title;
            document.querySelector('textarea[name="description"]').value = video.description;
            document.querySelector('select[name="platform"]').value = video.platform;
            document.querySelector('input[name="videoUrl"]').value = video.videoUrl;
            document.querySelector('input[name="videoId"]').value = video.videoId || '';
            document.querySelector('input[name="thumbnailUrl"]').value = video.thumbnailUrl || '';
            document.querySelector('input[name="duration"]').value = video.duration || '';
            document.querySelector('select[name="playlist"]').value = video.playlist || '';
            document.querySelector('input[name="tags"]').value = video.tags ? video.tags.join(', ') : '';
            
            // Change modal title and button
            document.querySelector('.modal-header h3').textContent = 'Modifier la vidéo';
            document.querySelector('.form-actions .btn-primary').textContent = 'Modifier';
            
            this.updateVideoUrlPlaceholder();
            this.showVideoModal();
        }
    }

    editPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist) {
            // Store the playlist ID being edited
            this.editingPlaylistId = playlistId;
            
            // Populate modal with playlist data
            document.querySelector('#playlistForm input[name="name"]').value = playlist.name;
            document.querySelector('#playlistForm textarea[name="description"]').value = playlist.description;
            document.querySelector('#playlistForm select[name="icon"]').value = playlist.icon;
            
            // Change modal title and button
            document.querySelector('#playlistModal .modal-header h3').textContent = 'Modifier la playlist';
            document.querySelector('#playlistForm .btn-primary').textContent = 'Modifier';
            
            this.showPlaylistModal();
        }
    }

    deleteVideo(videoId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
            this.videos = this.videos.filter(v => v.id !== videoId);
            localStorage.setItem('adminVideos', JSON.stringify(this.videos));
            this.updateStats();
            this.loadVideos();
            this.showNotification('Vidéo supprimée', 'success');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
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
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        if (adminPanel.isAuthenticated) {
            adminPanel.showVideoModal();
        }
    }
    
    if (e.key === 'Escape') {
        adminPanel.closeModal();
    }
}); 