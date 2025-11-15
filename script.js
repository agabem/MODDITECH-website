// Mobile Menu Toggle
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", () => {
        hamburgerBtn.classList.toggle("active");
        mobileMenu.classList.toggle("active");
    });
}

// Close mobile menu when clicking on links
const mobileLinks = document.querySelectorAll('.nav-links a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
    });
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Enhanced User Management System with YOUR Admin
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
        } catch (error) {
            console.error('Error saving users:', error);
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
        } catch (error) {
            console.error('Error saving current user:', error);
        }
    }

    register(userData) {
        try {
            if (!userData.email || !userData.password || !userData.firstName || !userData.role) {
                return { success: false, message: "All fields are required" };
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                return { success: false, message: "Invalid email format" };
            }

            const existingUser = this.users.find(u => u.email === userData.email);
            if (existingUser) {
                return { success: false, message: "User already exists with this email" };
            }

            const newUser = {
                id: Date.now(),
                ...userData,
                joinDate: new Date().toISOString().split('T')[0],
                avatar: this.getAvatarForRole(userData.role),
                bio: "New community member"
            };

            this.users.push(newUser);
            this.saveUsers();
            return { success: true, user: newUser };
        } catch (error) {
            console.error('Error registering user:', error);
            return { success: false, message: "Registration failed" };
        }
    }

    login(email, password) {
        try {
            if (!email || !password) {
                return { success: false, message: "Email and password are required" };
            }

            const user = this.users.find(u => u.email === email && u.password === password);
            if (user) {
                this.saveCurrentUser(user);
                return { success: true, user };
            }
            return { success: false, message: "Invalid email or password" };
        } catch (error) {
            console.error('Error during login:', error);
            return { success: false, message: "Login failed" };
        }
    }

    logout() {
        try {
            this.saveCurrentUser(null);
            return { success: true };
        } catch (error) {
            console.error('Error during logout:', error);
            return { success: false, message: "Logout failed" };
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
            return this.users.find(user => user.id === userId);
        } catch (error) {
            console.error('Error getting user by ID:', error);
            return null;
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
                    timestamp: new Date('2024-01-15').toISOString(),
                    likes: 12,
                    likedBy: []
                },
                {
                    id: 2,
                    userId: 2,
                    content: "Just completed an amazing UI redesign for a fintech startup. The new dashboard features real-time analytics and improved user workflows!",
                    timestamp: new Date('2024-02-20').toISOString(),
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
        } catch (error) {
            console.error('Error saving news:', error);
        }
    }

    createPost(userId, content) {
        try {
            if (!userId || !content || content.trim() === '') {
                return { success: false, message: "Content is required" };
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
            this.saveNews();
            return { success: true, post };
        } catch (error) {
            console.error('Error creating post:', error);
            return { success: false, message: "Failed to create post" };
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
            
            if (post.userId === userId || currentUser?.role === 'admin') {
                this.news.splice(postIndex, 1);
                this.saveNews();
                return { success: true };
            }
            
            return { success: false, message: "Unauthorized to delete this post" };
        } catch (error) {
            console.error('Error deleting post:', error);
            return { success: false, message: "Failed to delete post" };
        }
    }

    likePost(postId, userId) {
        try {
            const post = this.news.find(p => p.id === parseInt(postId));
            if (!post) {
                return { success: false, message: "Post not found" };
            }

            const likeIndex = post.likedBy.indexOf(userId);
            if (likeIndex === -1) {
                post.likedBy.push(userId);
                post.likes++;
            } else {
                post.likedBy.splice(likeIndex, 1);
                post.likes--;
            }
            
            this.saveNews();
            return { success: true, likes: post.likes, isLiked: likeIndex === -1 };
        } catch (error) {
            console.error('Error liking post:', error);
            return { success: false, message: "Failed to like post" };
        }
    }

    getUserNewsCount(userId) {
        try {
            return this.news.filter(post => post.userId === userId).length;
        } catch (error) {
            console.error('Error getting user news count:', error);
            return 0;
        }
    }

    getNewsFeed() {
        try {
            return this.news.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error('Error getting news feed:', error);
            return [];
        }
    }
}

// Initialize managers
let userManager;
let newsManager;

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
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => notification.classList.add('show'), 100);

            // Remove after 4 seconds
            setTimeout(() => {
                notification.classList.remove('show');
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
            return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
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
    }
};

// Main Application Controller
const App = {
    init() {
        try {
            console.log('Initializing Moddi Tech Design App...');
            
            // Initialize managers
            userManager = new UserManager();
            newsManager = new NewsManager();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Update UI based on current state
            this.updateUI();
            
            console.log('App initialized successfully');
            console.log('Available admin login:');
            console.log('Email: modditechdesigns@gmail.com');
            console.log('Password: moddi2024');
            
        } catch (error) {
            console.error('Error initializing app:', error);
            utils.showNotification('Failed to initialize application', 'error');
        }
    },

    setupEventListeners() {
        try {
            // Mobile menu
            const hamburgerBtn = utils.getElement('hamburgerBtn');
            const mobileMenu = utils.getElement('mobileMenu');
            
            if (hamburgerBtn && mobileMenu) {
                hamburgerBtn.addEventListener('click', () => {
                    hamburgerBtn.classList.toggle('active');
                    mobileMenu.classList.toggle('active');
                });
            }

            // Close mobile menu when clicking on links
            const mobileLinks = document.querySelectorAll('.nav-links a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (hamburgerBtn && mobileMenu) {
                        hamburgerBtn.classList.remove("active");
                        mobileMenu.classList.remove("active");
                    }
                });
            });

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
            
            // Navbar scroll effect
            window.addEventListener('scroll', this.handleScroll.bind(this));
            
            // Waitlist form
            const waitlistForm = utils.getElement('waitlist-form');
            if (waitlistForm) {
                waitlistForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = utils.getElement('email').value;
                    if (email) {
                        utils.showNotification('Thank you for joining our waitlist!', 'success');
                        waitlistForm.reset();
                    }
                });
            }
            
        } catch (error) {
            console.error('Error setting up event listeners:', error);
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
            const activeForm = utils.getElement(`${tab}Form`);
            if (activeForm) activeForm.classList.add('active');
        } catch (error) {
            console.error('Error switching auth tab:', error);
        }
    },

    handleLogin(e) {
        e.preventDefault();
        
        try {
            const emailInput = e.target.querySelector('input[type="email"]');
            const passwordInput = e.target.querySelector('input[type="password"]');
            
            const email = emailInput?.value;
            const password = passwordInput?.value;

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
            utils.showNotification('Login failed', 'error');
        }
    },

    handleSignup(e) {
        e.preventDefault();
        
        try {
            const firstNameInput = e.target.querySelector('input[placeholder="First Name"]');
            const lastNameInput = e.target.querySelector('input[placeholder="Last Name"]');
            const emailInput = e.target.querySelector('input[type="email"]');
            const passwordInput = e.target.querySelector('input[type="password"]');
            const userRoleSelect = utils.getElement('userRole');
            
            const userData = {
                firstName: firstNameInput?.value,
                lastName: lastNameInput?.value,
                email: emailInput?.value,
                password: passwordInput?.value,
                role: userRoleSelect ? userRoleSelect.value : 'client'
            };

            const result = userManager.register(userData);
            if (result.success) {
                utils.showNotification('Account created successfully!', 'success');
                userManager.login(userData.email, userData.password);
                this.closeLoginModal();
                this.updateUI();
                this.loadDashboardData();
            } else {
                utils.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            utils.showNotification('Registration failed', 'error');
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
                    if (tabId === 'community') {
                        this.loadCommunityUsers();
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
            const userAvatar = utils.getElement('userAvatar');
            const userName = utils.getElement('userName');
            const userRoleBadge = utils.getElement('userRoleBadge');

            if (userAvatar) userAvatar.textContent = user.avatar;
            if (userName) userName.textContent = `${user.firstName} ${user.lastName}`;
            if (userRoleBadge) {
                userRoleBadge.textContent = user.role;
                userRoleBadge.style.background = utils.getRoleColor(user.role);
            }

            // Update stats
            const newsCount = utils.getElement('newsCount');
            if (newsCount) newsCount.textContent = newsManager.getUserNewsCount(user.id);

            // Update profile
            const profileAvatar = utils.getElement('profileAvatar');
            const profileName = utils.getElement('profileName');
            const profileEmail = utils.getElement('profileEmail');
            const profileRole = utils.getElement('profileRole');
            const joinDate = utils.getElement('joinDate');

            if (profileAvatar) profileAvatar.textContent = user.avatar;
            if (profileName) profileName.textContent = `${user.firstName} ${user.lastName}`;
            if (profileEmail) profileEmail.textContent = user.email;
            if (profileRole) {
                profileRole.textContent = user.role;
                profileRole.style.background = utils.getRoleColor(user.role);
            }
            if (joinDate) joinDate.textContent = user.joinDate;

            // Load news feed
            this.loadNewsFeed();

            // Show/hide create post button based on role
            const createNewsBtn = utils.getElement('createNewsBtn');
            if (createNewsBtn) {
                createNewsBtn.style.display = user.role === 'client' ? 'none' : 'flex';
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
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

                return `
                    <div class="news-item">
                        <div class="news-header">
                            <div class="news-author">
                                <div class="author-avatar">${author.avatar}</div>
                                <div class="author-info">
                                    <h4>${author.firstName} ${author.lastName}</h4>
                                    <div class="author-role">${author.role}</div>
                                </div>
                            </div>
                            <div class="news-time">${utils.formatTimeAgo(post.timestamp)}</div>
                        </div>
                        <div class="news-content">${post.content}</div>
                        <div class="news-actions">
                            <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="App.toggleLike(${post.id})">
                                <i class="fas fa-heart"></i> ${post.likes}
                            </button>
                            ${isAuthor || userManager.currentUser?.role === 'admin' ? `
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
                    user.role.toLowerCase().includes(searchTerm)
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
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <p>${user.bio}</p>
                    <div class="user-role-tag" style="background: ${utils.getRoleColor(user.role)}">${user.role}</div>
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
                    this.loadDashboardData();
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
            } else {
                utils.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            utils.showNotification('Logout failed', 'error');
        }
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

// Make App methods globally available for onclick handlers
window.App = App;