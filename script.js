// Enhanced Mobile Menu Toggle with proper error handling
class MobileMenu {
    constructor() {
        this.hamburgerBtn = document.getElementById("hamburgerBtn");
        this.mobileMenu = document.getElementById("mobileMenu");
        this.navbar = document.querySelector(".navbar");
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.hamburgerBtn || !this.mobileMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }
        this.setupEventListeners();
        this.handleResize();
    }

    setupEventListeners() {
        // Hamburger button click
        this.hamburgerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close on resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.mobileMenu.contains(e.target) && !this.hamburgerBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.hamburgerBtn.classList.add("active");
        this.mobileMenu.classList.add("active");
        document.body.classList.add("menu-open");
        this.isOpen = true;
        this.createBackdrop();
    }

    closeMenu() {
        this.hamburgerBtn.classList.remove("active");
        this.mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
        this.isOpen = false;
        this.removeBackdrop();
    }

    createBackdrop() {
        this.removeBackdrop();
        
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            backdrop-filter: blur(2px);
        `;
        
        backdrop.addEventListener('click', () => this.closeMenu());
        document.body.appendChild(backdrop);
    }

    removeBackdrop() {
        const backdrop = document.querySelector('.mobile-menu-backdrop');
        if (backdrop) backdrop.remove();
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMenu();
        }
    }
}

// Enhanced User Management System
class UserManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
    }

    loadUsers() {
        try {
            const defaultUsers = [
                {
                    id: 1,
                    email: "modditechdesigns@gmail.com", 
                    password: "moddi2024", 
                    firstName: "Moddi",
                    lastName: "Admin",
                    name: "Moddi Admin",
                    role: "admin",
                    avatar: "👑",
                    joinDate: "2024-01-01",
                    verified: true,
                    bio: "Lead Administrator & Founder"
                },
                {
                    id: 2,
                    email: "designer@modditech.com",
                    password: "design123",
                    firstName: "Alex",
                    lastName: "Designer",
                    role: "designer",
                    avatar: "🎨",
                    joinDate: "2024-02-15",
                    bio: "Senior UI/UX Designer"
                },
                {
                    id: 3,
                    email: "client@example.com",
                    password: "client123",
                    firstName: "Sarah",
                    lastName: "Client",
                    role: "client",
                    avatar: "💼",
                    joinDate: "2024-03-20",
                    bio: "Project Manager at TechCorp"
                }
            ];

            const storedUsers = localStorage.getItem('moddiUsers');
            return storedUsers ? JSON.parse(storedUsers) : defaultUsers;
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('moddiUsers', JSON.stringify(this.users));
            return true;
        } catch (error) {
            console.error('Error saving users:', error);
            return false;
        }
    }

    loadCurrentUser() {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error loading current user:', error);
            return null;
        }
    }

    saveCurrentUser(user) {
        try {
            this.currentUser = user;
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('currentUser');
            }
            return true;
        } catch (error) {
            console.error('Error saving current user:', error);
            return false;
        }
    }

    register(userData) {
        try {
            // Validation
            if (!userData.email?.trim() || !userData.password?.trim() || 
                !userData.firstName?.trim() || !userData.role) {
                return { success: false, message: "All fields are required" };
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email.trim())) {
                return { success: false, message: "Invalid email format" };
            }

            if (userData.password.length < 6) {
                return { success: false, message: "Password must be at least 6 characters" };
            }

            const existingUser = this.users.find(u => u.email === userData.email.trim());
            if (existingUser) {
                return { success: false, message: "User already exists with this email" };
            }

            const newUser = {
                id: Date.now(),
                email: userData.email.trim(),
                password: userData.password,
                firstName: userData.firstName.trim(),
                lastName: userData.lastName?.trim() || '',
                role: userData.role,
                joinDate: new Date().toISOString().split('T')[0],
                avatar: this.getAvatarForRole(userData.role),
                bio: "New community member",
                verified: false
            };

            this.users.push(newUser);
            const saved = this.saveUsers();
            
            return saved ? 
                { success: true, user: newUser } : 
                { success: false, message: "Failed to save user data" };
                
        } catch (error) {
            console.error('Error registering user:', error);
            return { success: false, message: "Registration failed due to system error" };
        }
    }

    login(email, password) {
        try {
            if (!email?.trim() || !password?.trim()) {
                return { success: false, message: "Email and password are required" };
            }

            const user = this.users.find(u => 
                u.email === email.trim() && u.password === password
            );
            
            if (user) {
                const saved = this.saveCurrentUser(user);
                return saved ? 
                    { success: true, user } : 
                    { success: false, message: "Login failed to save session" };
            }
            
            return { success: false, message: "Invalid email or password" };
        } catch (error) {
            console.error('Error during login:', error);
            return { success: false, message: "Login failed due to system error" };
        }
    }

    logout() {
        try {
            const saved = this.saveCurrentUser(null);
            return { success: saved, message: saved ? null : "Logout failed" };
        } catch (error) {
            console.error('Error during logout:', error);
            return { success: false, message: "Logout failed due to system error" };
        }
    }

    getAvatarForRole(role) {
        const avatars = {
            'admin': '👑',
            'designer': '🎨',
            'client': '💼',
            'partner': '🤝'
        };
        return avatars[role] || '👤';
    }

    getAllUsers() {
        try {
            return this.users.filter(user => user.id !== this.currentUser?.id);
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    }

    getUserById(userId) {
        try {
            return this.users.find(user => user.id === parseInt(userId));
        } catch (error) {
            console.error('Error getting user by ID:', error);
            return null;
        }
    }

    updateUser(userId, updates) {
        try {
            const userIndex = this.users.findIndex(user => user.id === parseInt(userId));
            if (userIndex === -1) {
                return { success: false, message: "User not found" };
            }

            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            const saved = this.saveUsers();
            
            // Update current user if it's the same user
            if (this.currentUser && this.currentUser.id === parseInt(userId)) {
                this.saveCurrentUser(this.users[userIndex]);
            }

            return saved ? 
                { success: true, user: this.users[userIndex] } : 
                { success: false, message: "Failed to save user updates" };
                
        } catch (error) {
            console.error('Error updating user:', error);
            return { success: false, message: "Update failed due to system error" };
        }
    }
}

// Enhanced News Management System
class NewsManager {
    constructor() {
        this.news = this.loadNews();
    }

    loadNews() {
        try {
            const defaultNews = [
                {
                    id: 1,
                    userId: 1,
                    content: "Welcome to Moddi Tech Design! We're excited to launch our new community platform where designers, clients, and partners can collaborate and share ideas.",
                    timestamp: new Date('2024-01-15T10:00:00').toISOString(),
                    likes: 12,
                    likedBy: []
                },
                {
                    id: 2,
                    userId: 2,
                    content: "Just completed an amazing UI redesign for a fintech startup. The new dashboard features real-time analytics and improved user workflows!",
                    timestamp: new Date('2024-02-20T14:30:00').toISOString(),
                    likes: 8,
                    likedBy: []
                }
            ];

            const storedNews = localStorage.getItem('moddiNews');
            return storedNews ? JSON.parse(storedNews) : defaultNews;
        } catch (error) {
            console.error('Error loading news:', error);
            return [];
        }
    }

    saveNews() {
        try {
            localStorage.setItem('moddiNews', JSON.stringify(this.news));
            return true;
        } catch (error) {
            console.error('Error saving news:', error);
            return false;
        }
    }

    createPost(userId, content) {
        try {
            if (!userId || !content?.trim()) {
                return { success: false, message: "Content is required" };
            }

            if (content.trim().length < 5) {
                return { success: false, message: "Content must be at least 5 characters" };
            }

            const post = {
                id: Date.now(),
                userId: parseInt(userId),
                content: content.trim(),
                timestamp: new Date().toISOString(),
                likes: 0,
                likedBy: []
            };

            this.news.unshift(post);
            const saved = this.saveNews();
            
            return saved ? 
                { success: true, post } : 
                { success: false, message: "Failed to save post" };
                
        } catch (error) {
            console.error('Error creating post:', error);
            return { success: false, message: "Failed to create post due to system error" };
        }
    }

    deletePost(postId, userId) {
        try {
            const postIndex = this.news.findIndex(post => post.id === parseInt(postId));
            if (postIndex === -1) {
                return { success: false, message: "Post not found" };
            }

            const post = this.news[postIndex];
            const currentUser = userManager.currentUser;
            
            // Check permissions
            if (post.userId !== parseInt(userId) && currentUser?.role !== 'admin') {
                return { success: false, message: "Unauthorized to delete this post" };
            }

            this.news.splice(postIndex, 1);
            const saved = this.saveNews();
            
            return saved ? 
                { success: true } : 
                { success: false, message: "Failed to delete post" };
                
        } catch (error) {
            console.error('Error deleting post:', error);
            return { success: false, message: "Failed to delete post due to system error" };
        }
    }

    likePost(postId, userId) {
        try {
            const post = this.news.find(p => p.id === parseInt(postId));
            if (!post) {
                return { success: false, message: "Post not found" };
            }

            const likeIndex = post.likedBy.indexOf(parseInt(userId));
            if (likeIndex === -1) {
                post.likedBy.push(parseInt(userId));
                post.likes++;
            } else {
                post.likedBy.splice(likeIndex, 1);
                post.likes--;
            }
            
            const saved = this.saveNews();
            return saved ? 
                { success: true, likes: post.likes, isLiked: likeIndex === -1 } : 
                { success: false, message: "Failed to update like" };
                
        } catch (error) {
            console.error('Error liking post:', error);
            return { success: false, message: "Failed to like post due to system error" };
        }
    }

    getUserNewsCount(userId) {
        try {
            return this.news.filter(post => post.userId === parseInt(userId)).length;
        } catch (error) {
            console.error('Error getting user news count:', error);
            return 0;
        }
    }

    getNewsFeed() {
        try {
            return [...this.news].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error('Error getting news feed:', error);
            return [];
        }
    }

    getPostsByUser(userId) {
        try {
            return this.news.filter(post => post.userId === parseInt(userId))
                           .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error('Error getting user posts:', error);
            return [];
        }
    }
}

// Utility Functions
const utils = {
    getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    },

    showNotification(message, type = 'info') {
        try {
            // Remove existing notification
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 400px;
            `;

            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
                notification.style.opacity = '1';
            }, 100);

            // Remove after 4 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 4000);
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    },

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },

    getRoleColor(role) {
        const colors = {
            'admin': '#EF4444',
            'designer': '#8B5CF6',
            'client': '#10B981',
            'partner': '#F59E0B'
        };
        return colors[role] || '#6B7280';
    },

    formatTimeAgo(timestamp) {
        try {
            const now = new Date();
            const time = new Date(timestamp);
            const diffInSeconds = Math.floor((now - time) / 1000);
            
            if (diffInSeconds < 60) return 'just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
            if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
            return time.toLocaleDateString();
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'recently';
        }
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};

// Main Application Controller
const App = {
    init() {
        try {
            console.log('Initializing Moddi Tech Design App...');
            
            // Initialize mobile menu
            this.mobileMenu = new MobileMenu();
            
            // Initialize managers
            userManager = new UserManager();
            newsManager = new NewsManager();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Update UI based on current state
            this.updateUI();
            
            console.log('App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
            utils.showNotification('Failed to initialize application', 'error');
        }
    },

    setupEventListeners() {
        try {
            // Navbar scroll effect
            window.addEventListener('scroll', this.handleScroll.bind(this));
            
            // Login button
            const loginBtn = utils.getElement('loginBtn');
            if (loginBtn) {
                loginBtn.addEventListener('click', this.handleLoginClick.bind(this));
            }

            // Modal close buttons
            const closeLogin = utils.getElement('closeLogin');
            const closeDashboard = utils.getElement('closeDashboard');
            
            if (closeLogin) {
                closeLogin.addEventListener('click', this.closeLoginModal.bind(this));
            }
            if (closeDashboard) {
                closeDashboard.addEventListener('click', this.closeDashboardModal.bind(this));
            }

            // Auth forms
            this.setupAuthForms();
            
            // Dashboard functionality
            this.setupDashboard();
            
            // Close modals on outside click
            document.addEventListener('click', this.handleOutsideClick.bind(this));
            
            // Waitlist form
            const waitlistForm = utils.getElement('waitlist-form');
            if (waitlistForm) {
                waitlistForm.addEventListener('submit', this.handleWaitlistSubmit.bind(this));
            }
            
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    },

    handleWaitlistSubmit(e) {
        e.preventDefault();
        try {
            const emailInput = utils.getElement('email');
            if (emailInput && emailInput.value) {
                utils.showNotification('Thank you for joining our waitlist! We\\'ll be in touch soon.', 'success');
                e.target.reset();
            }
        } catch (error) {
            console.error('Error handling waitlist submission:', error);
        }
    },

    handleLoginClick() {
        if (userManager.currentUser) {
            this.openDashboard();
        } else {
            this.openLoginModal();
        }
    },

    setupAuthForms() {
        try {
            // Auth tabs
            const authTabs = document.querySelectorAll('.auth-tab');
            authTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const targetTab = e.target.getAttribute('data-tab');
                    this.switchAuthTab(targetTab);
                });
            });

            // Switch links
            const switchToSignup = document.querySelector('.switch-to-signup');
            const switchToLogin = document.querySelector('.switch-to-login');
            
            if (switchToSignup) {
                switchToSignup.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchAuthTab('signup');
                });
            }
            
            if (switchToLogin) {
                switchToLogin.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchAuthTab('login');
                });
            }

            // Form submissions
            const loginForm = utils.getElement('login-form');
            const signupForm = utils.getElement('signup-form');

            if (loginForm) {
                loginForm.addEventListener('submit', this.handleLogin.bind(this));
            }
            if (signupForm) {
                signupForm.addEventListener('submit', this.handleSignup.bind(this));
            }
        } catch (error) {
            console.error('Error setting up auth forms:', error);
        }
    },

    switchAuthTab(tab) {
        try {
            // Update tabs
            const authTabs = document.querySelectorAll('.auth-tab');
            authTabs.forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`[data-tab="${tab}"]`);
            if (activeTab) activeTab.classList.add('active');
            
            // Update forms
            const authForms = document.querySelectorAll('.auth-form');
            authForms.forEach(form => form.classList.remove('active'));
            const activeForm = utils.getElement(`${tab}-form`);
            if (activeForm) activeForm.classList.add('active');
        } catch (error) {
            console.error('Error switching auth tab:', error);
        }
    },

    handleLogin(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const email = formData.get('email')?.toString() || '';
            const password = formData.get('password')?.toString() || '';

            if (!email || !password) {
                utils.showNotification('Please fill in all fields', 'error');
                return;
            }

            const result = userManager.login(email, password);
            if (result.success) {
                utils.showNotification(`Welcome back, ${result.user.firstName}!`, 'success');
                this.closeLoginModal();
                this.updateUI();
                this.loadDashboardData();
            } else {
                utils.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error during login:', error);
            utils.showNotification('Login failed due to system error', 'error');
        }
    },

    handleSignup(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const userData = {
                firstName: formData.get('firstName')?.toString() || '',
                lastName: formData.get('lastName')?.toString() || '',
                email: formData.get('email')?.toString() || '',
                password: formData.get('password')?.toString() || '',
                role: formData.get('role')?.toString() || 'client'
            };

            const result = userManager.register(userData);
            if (result.success) {
                utils.showNotification('Account created successfully!', 'success');
                // Auto-login after registration
                const loginResult = userManager.login(userData.email, userData.password);
                if (loginResult.success) {
                    this.closeLoginModal();
                    this.updateUI();
                    this.loadDashboardData();
                }
            } else {
                utils.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            utils.showNotification('Registration failed due to system error', 'error');
        }
    },

    setupDashboard() {
        try {
            // News form
            const createNewsBtn = utils.getElement('createNewsBtn');
            const cancelNewsBtn = utils.getElement('cancelNewsBtn');
            const postNewsBtn = utils.getElement('postNewsBtn');
            const createNewsForm = utils.getElement('createNewsForm');

            if (createNewsBtn) {
                createNewsBtn.addEventListener('click', () => {
                    if (createNewsForm) createNewsForm.style.display = 'block';
                    if (createNewsBtn) createNewsBtn.style.display = 'none';
                });
            }

            if (cancelNewsBtn) {
                cancelNewsBtn.addEventListener('click', () => {
                    if (createNewsForm) createNewsForm.style.display = 'none';
                    if (createNewsBtn) createNewsBtn.style.display = 'flex';
                    const newsContent = utils.getElement('newsContent');
                    if (newsContent) newsContent.value = '';
                });
            }

            if (postNewsBtn) {
                postNewsBtn.addEventListener('click', this.handlePostNews.bind(this));
            }

            // Dashboard tabs
            this.setupDashboardTabs();

            // User search
            const userSearch = utils.getElement('userSearch');
            if (userSearch) {
                userSearch.addEventListener('input', utils.debounce(this.handleUserSearch.bind(this), 300));
            }

            // Logout button
            const logoutBtn = utils.getElement('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', this.logout.bind(this));
            }
        } catch (error) {
            console.error('Error setting up dashboard:', error);
        }
    },

    handlePostNews() {
        try {
            const newsContent = utils.getElement('newsContent');
            const createNewsForm = utils.getElement('createNewsForm');
            const createNewsBtn = utils.getElement('createNewsBtn');

            if (!newsContent || !userManager.currentUser) return;

            const content = newsContent.value.trim();
            if (!content) {
                utils.showNotification('Please enter some content', 'error');
                return;
            }

            const result = newsManager.createPost(userManager.currentUser.id, content);
            if (result.success) {
                utils.showNotification('Post published successfully!', 'success');
                this.loadNewsFeed();
                if (createNewsForm) createNewsForm.style.display = 'none';
                if (createNewsBtn) createNewsBtn.style.display = 'flex';
                newsContent.value = '';
            } else {
                utils.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error posting news:', error);
            utils.showNotification('Failed to post news', 'error');
        }
    },

    setupDashboardTabs() {
        try {
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.getAttribute('data-tab');
                    
                    // Update tabs
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update contents
                    tabContents.forEach(c => c.classList.remove('active'));
                    const targetTab = utils.getElement(`${tabId}Tab`);
                    if (targetTab) targetTab.classList.add('active');

                    // Load tab-specific data
                    switch(tabId) {
                        case 'news':
                            this.loadNewsFeed();
                            break;
                        case 'community':
                            this.loadCommunityUsers();
                            break;
                        case 'profile':
                            this.loadProfileData();
                            break;
                    }
                });
            });
        } catch (error) {
            console.error('Error setting up dashboard tabs:', error);
        }
    },

    handleUserSearch(e) {
        try {
            const searchTerm = e.target.value.toLowerCase();
            this.loadCommunityUsers(searchTerm);
        } catch (error) {
            console.error('Error handling user search:', error);
        }
    },

    handleOutsideClick(e) {
        const loginModal = utils.getElement('loginModal');
        const dashboardModal = utils.getElement('dashboardModal');
        
        if (e.target === loginModal) {
            this.closeLoginModal();
        }
        if (e.target === dashboardModal) {
            this.closeDashboardModal();
        }
    },

    handleScroll() {
        try {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }
        } catch (error) {
            console.error('Error handling scroll:', error);
        }
    },

    updateUI() {
        try {
            const user = userManager.currentUser;
            const loginBtn = utils.getElement('loginBtn');
            
            if (user && loginBtn) {
                loginBtn.innerHTML = `
                    <div class="user-avatar-small">${user.avatar}</div>
                    ${user.firstName}
                `;
                loginBtn.classList.add('logged-in');
            } else if (loginBtn) {
                loginBtn.innerHTML = 'Login';
                loginBtn.classList.remove('logged-in');
            }
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    },

    loadDashboardData() {
        try {
            const user = userManager.currentUser;
            if (!user) return;

            // Update dashboard header
            this.updateDashboardHeader(user);
            
            // Update stats
            this.updateUserStats(user);
            
            // Load initial tab content
            this.loadNewsFeed();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    },

    updateDashboardHeader(user) {
        const userAvatar = utils.getElement('userAvatar');
        const userName = utils.getElement('userName');
        const userRoleBadge = utils.getElement('userRoleBadge');

        if (userAvatar) userAvatar.textContent = user.avatar;
        if (userName) userName.textContent = `${user.firstName} ${user.lastName}`;
        if (userRoleBadge) {
            userRoleBadge.textContent = user.role;
            userRoleBadge.style.background = utils.getRoleColor(user.role);
        }
    },

    updateUserStats(user) {
        const newsCount = utils.getElement('newsCount');
        if (newsCount) {
            newsCount.textContent = newsManager.getUserNewsCount(user.id);
        }
    },

    loadProfileData() {
        try {
            const user = userManager.currentUser;
            if (!user) return;

            const profileAvatar = utils.getElement('profileAvatar');
            const profileName = utils.getElement('profileName');
            const profileEmail = utils.getElement('profileEmail');
            const profileRole = utils.getElement('profileRole');
            const joinDate = utils.getElement('joinDate');
            const userBio = utils.getElement('userBio');

            if (profileAvatar) profileAvatar.textContent = user.avatar;
            if (profileName) profileName.textContent = `${user.firstName} ${user.lastName}`;
            if (profileEmail) profileEmail.textContent = user.email;
            if (profileRole) {
                profileRole.textContent = user.role;
                profileRole.style.background = utils.getRoleColor(user.role);
            }
            if (joinDate) joinDate.textContent = user.joinDate;
            if (userBio) userBio.textContent = user.bio || 'No bio yet';

        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    },

    loadNewsFeed() {
        try {
            const newsFeed = utils.getElement('newsFeed');
            if (!newsFeed) return;

            const news = newsManager.getNewsFeed();

            if (news.length === 0) {
                newsFeed.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-newspaper"></i>
                        <h4>No News Yet</h4>
                        <p>Be the first to share an update!</p>
                    </div>
                `;
                return;
            }

            newsFeed.innerHTML = news.map(post => {
                const author = userManager.getUserById(post.userId);
                if (!author) return '';

                const isAuthor = userManager.currentUser?.id === post.userId;
                const isLiked = post.likedBy.includes(userManager.currentUser?.id);
                const canDelete = isAuthor || userManager.currentUser?.role === 'admin';

                return `
                    <div class="news-item" data-post-id="${post.id}">
                        <div class="news-header">
                            <div class="news-author">
                                <div class="author-avatar">${author.avatar}</div>
                                <div class="author-info">
                                    <h4>${utils.escapeHtml(author.firstName + ' ' + author.lastName)}</h4>
                                    <div class="author-role">${author.role}</div>
                                </div>
                            </div>
                            <div class="news-time">${utils.formatTimeAgo(post.timestamp)}</div>
                        </div>
                        <div class="news-content">${utils.escapeHtml(post.content)}</div>
                        <div class="news-actions">
                            <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="App.toggleLike(${post.id})">
                                <i class="fas fa-heart"></i> ${post.likes}
                            </button>
                            ${canDelete ? `
                                <button class="action-btn delete" onclick="App.deletePost(${post.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading news feed:', error);
            const newsFeed = utils.getElement('newsFeed');
            if (newsFeed) {
                newsFeed.innerHTML = '<div class="error-state">Failed to load news feed</div>';
            }
        }
    },

    loadCommunityUsers(searchTerm = '') {
        try {
            const usersList = utils.getElement('usersList');
            if (!usersList) return;

            let users = userManager.getAllUsers();
            
            if (searchTerm) {
                users = users.filter(user => 
                    user.firstName.toLowerCase().includes(searchTerm) ||
                    user.lastName.toLowerCase().includes(searchTerm) ||
                    user.role.toLowerCase().includes(searchTerm) ||
                    user.bio.toLowerCase().includes(searchTerm)
                );
            }

            if (users.length === 0) {
                usersList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h4>No Users Found</h4>
                        <p>${searchTerm ? 'Try a different search term' : 'No other users in the community'}</p>
                    </div>
                `;
                return;
            }

            usersList.innerHTML = users.map(user => `
                <div class="user-card">
                    <div class="user-avatar-card">${user.avatar}</div>
                    <h4>${utils.escapeHtml(user.firstName + ' ' + user.lastName)}</h4>
                    <p>${utils.escapeHtml(user.bio || 'No bio yet')}</p>
                    <div class="user-role-tag" style="background: ${utils.getRoleColor(user.role)}">
                        ${user.role}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading community users:', error);
        }
    },

    // Modal functions
    openLoginModal() {
        try {
            const loginModal = utils.getElement('loginModal');
            if (loginModal) {
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.error('Error opening login modal:', error);
        }
    },

    closeLoginModal() {
        try {
            const loginModal = utils.getElement('loginModal');
            if (loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset forms
                const loginForm = utils.getElement('login-form');
                const signupForm = utils.getElement('signup-form');
                if (loginForm) loginForm.reset();
                if (signupForm) signupForm.reset();
                
                // Switch back to login tab
                this.switchAuthTab('login');
            }
        } catch (error) {
            console.error('Error closing login modal:', error);
        }
    },

    openDashboard() {
        try {
            const dashboardModal = utils.getElement('dashboardModal');
            if (dashboardModal) {
                dashboardModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                this.loadDashboardData();
            }
        } catch (error) {
            console.error('Error opening dashboard:', error);
        }
    },

    closeDashboardModal() {
        try {
            const dashboardModal = utils.getElement('dashboardModal');
            if (dashboardModal) {
                dashboardModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        } catch (error) {
            console.error('Error closing dashboard:', error);
        }
    },

    // News actions
    toggleLike(postId) {
        try {
            if (!userManager.currentUser) {
                utils.showNotification('Please login to like posts', 'error');
                return;
            }

            const result = newsManager.likePost(postId, userManager.currentUser.id);
            if (result.success) {
                this.loadNewsFeed();
            } else {
                utils.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            utils.showNotification('Failed to like post', 'error');
        }
    },

    deletePost(postId) {
        try {
            if (!userManager.currentUser) return;

            if (confirm('Are you sure you want to delete this post?')) {
                const result = newsManager.deletePost(postId, userManager.currentUser.id);
                if (result.success) {
                    utils.showNotification('Post deleted successfully', 'success');
                    this.loadNewsFeed();
                    this.loadDashboardData(); // Refresh stats
                } else {
                    utils.showNotification(result.message, 'error');
                }
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            utils.showNotification('Failed to delete post', 'error');
        }
    },

    logout() {
        try {
            const result = userManager.logout();
            if (result.success) {
                utils.showNotification('Logged out successfully', 'success');
                this.closeDashboardModal();
                this.updateUI();
                this.mobileMenu.closeMenu();
            } else {
                utils.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            utils.showNotification('Logout failed', 'error');
        }
    }
};

// Initialize managers
let userManager;
let newsManager;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

// Make App methods globally available for onclick handlers
window.App = App;

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, UserManager, NewsManager, MobileMenu };
}