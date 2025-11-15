// Mobile Menu Toggle
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", () => {
        hamburgerBtn.classList.toggle("active");
        mobileMenu.classList.toggle("active");
    });
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Modals
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginForm = document.getElementById("login-form");

const dashboardModal = document.getElementById("dashboardModal");
const closeDashboard = document.getElementById("closeDashboard");

// User database
const users = [
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
        verified: true
    },
    { 
        id: 2,
        email: "admin@modditech.com", 
        password: "admin123", 
        firstName: "Admin",
        lastName: "User",
        name: "Admin User",
        role: "admin",
        avatar: "⚡",
        joinDate: "2024-01-15",
        verified: true
    },
    { 
        id: 3,
        email: "client@example.com", 
        password: "client123", 
        firstName: "John",
        lastName: "Client",
        name: "John Client",
        role: "client",
        avatar: "💼",
        joinDate: "2024-01-20",
        verified: true
    }
];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing application');
    initModals();
    initForms();
    ensureAdminLoggedIn();
    initDashboard();
});

// Ensure admin is logged in - NO POPUPS, NO MODALS
function ensureAdminLoggedIn() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (!loggedInUser) {
        // Auto-login with admin credentials silently
        const adminUser = users.find(u => u.email === "modditechdesigns@gmail.com");
        if (adminUser) {
            localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
            updateUIForLoggedInUser(adminUser);
            console.log('Auto-logged in as admin: Moddi Admin');
        }
    } else {
        // User already logged in
        const user = JSON.parse(loggedInUser);
        updateUIForLoggedInUser(user);
        console.log('User already logged in:', user.name);
    }
}

// Initialize modals - NO AUTOMATIC MODAL OPENING
function initModals() {
    console.log('Initializing modals...');
    
    // Login buttons - handle both desktop and mobile
    const loginBtns = document.querySelectorAll('#loginBtn, .nav-links #loginBtn');
    loginBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", openLoginModal);
            console.log('Login button event listener added');
        }
    });

    // Close buttons
    if (closeLogin) {
        closeLogin.addEventListener("click", () => {
            loginModal.classList.remove("active");
        });
    }

    if (closeDashboard) {
        closeDashboard.addEventListener("click", () => {
            dashboardModal.classList.remove("active");
        });
    }

    // Close modals on outside click
    window.addEventListener("click", (e) => {
        if (e.target === loginModal) loginModal.classList.remove("active");
        if (e.target === dashboardModal) dashboardModal.classList.remove("active");
    });
}

// Open login modal - ONLY when manually triggered
function openLoginModal() {
    console.log('Opening login modal manually');
    if (loginModal) {
        loginModal.classList.add("active");
        if (loginForm) loginForm.reset();
        
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains("active")) {
            hamburgerBtn.classList.remove("active");
            mobileMenu.classList.remove("active");
        }
    }
}

// Update UI when user logs in
function updateUIForLoggedInUser(user) {
    console.log('Updating UI for logged in user:', user);
    
    // Update all login buttons (desktop and mobile)
    const loginBtns = document.querySelectorAll('#loginBtn, .nav-links #loginBtn');
    
    loginBtns.forEach(loginBtn => {
        if (loginBtn) {
            // Clear and rebuild the button
            loginBtn.innerHTML = '';
            loginBtn.classList.add('logged-in');
            
            // Add avatar and name
            const avatarSpan = document.createElement('span');
            avatarSpan.textContent = user.avatar + ' ';
            avatarSpan.style.marginRight = '0.5rem';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = user.name;
            
            // Add user role badge
            const roleBadge = document.createElement('span');
            roleBadge.className = 'user-role';
            roleBadge.textContent = user.role;
            roleBadge.style.cssText = `
                margin-left: 0.5rem;
                background: ${getRoleColor(user.role)};
                color: white;
                padding: 0.2rem 0.5rem;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 600;
            `;
            
            loginBtn.appendChild(avatarSpan);
            loginBtn.appendChild(nameSpan);
            loginBtn.appendChild(roleBadge);
            
            // Remove any existing click listeners and add user menu
            loginBtn.onclick = showUserMenu;
        }
    });
}

// Get role-specific colors
function getRoleColor(role) {
    const colors = {
        'admin': '#EF4444',
        'client': '#10B981', 
        'designer': '#8B5CF6',
        'partner': '#F59E0B'
    };
    return colors[role] || '#6B7280';
}

// Show user menu
function showUserMenu() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;
    
    console.log('Showing user menu for:', user.name);
    
    // Remove any existing user menu
    const existingMenu = document.getElementById('userMenu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const userMenu = document.createElement('div');
    userMenu.id = 'userMenu';
    userMenu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1rem;
        min-width: 200px;
        box-shadow: var(--shadow-lg);
        z-index: 1002;
        margin-top: 0.5rem;
    `;
    
    userMenu.innerHTML = `
        <div style="border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
            <div style="font-weight: 600; color: var(--text-primary);">${user.avatar} ${user.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${user.email}</div>
            <div style="font-size: 0.7rem; background: ${getRoleColor(user.role)}; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; display: inline-block; margin-top: 0.5rem; text-transform: uppercase;">${user.role}</div>
        </div>
        <button class="user-menu-btn" onclick="viewDashboard()">
            <i class="fas fa-tachometer-alt"></i> Dashboard
        </button>
        <button class="user-menu-btn" onclick="viewProfile()">
            <i class="fas fa-user"></i> Profile
        </button>
        <button class="user-menu-btn logout-btn" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i> Logout
        </button>
    `;
    
    // Add styles for user menu buttons
    if (!document.getElementById('userMenuStyles')) {
        const style = document.createElement('style');
        style.id = 'userMenuStyles';
        style.textContent = `
            .user-menu-btn {
                width: 100%;
                text-align: left;
                background: none;
                border: none;
                color: var(--text-secondary);
                padding: 0.5rem 0;
                cursor: pointer;
                transition: var(--transition);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .user-menu-btn:hover {
                color: var(--text-primary);
            }
            .logout-btn {
                color: #EF4444;
                margin-top: 0.5rem;
            }
            .logout-btn:hover {
                color: #DC2626;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Attach to the clicked login button's parent
    this.parentNode.appendChild(userMenu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeUserMenu);
    }, 100);
}

// Close user menu
function closeUserMenu(event) {
    const userMenu = document.getElementById('userMenu');
    const loginBtns = document.querySelectorAll('#loginBtn, .nav-links #loginBtn');
    let isLoginButton = false;
    
    loginBtns.forEach(btn => {
        if (btn.contains(event.target)) {
            isLoginButton = true;
        }
    });
    
    if (userMenu && !userMenu.contains(event.target) && !isLoginButton) {
        userMenu.remove();
        document.removeEventListener('click', closeUserMenu);
    }
}

// Login function - NO AUTOMATIC MODAL REOPENING
function login(email, password) {
    console.log('Login attempt with:', email);
    
    if (!email || !password) {
        showMessage('Please enter both email and password.', 'error');
        return false;
    }

    // Check predefined users first
    let user = users.find(u => u.email === email && u.password === password);
    console.log('Found in predefined users:', user);
    
    // Check stored users (from signup - removed but keeping for compatibility)
    if (!user) {
        const storedUsers = JSON.parse(localStorage.getItem('moddiUsers') || '[]');
        user = storedUsers.find(u => u.email === email && u.password === password);
        console.log('Found in stored users:', user);
    }

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        console.log('User saved to localStorage:', user);
        
        updateUIForLoggedInUser(user);
        
        if (email === "modditechdesigns@gmail.com") {
            showMessage(`🎉 Welcome back, Moddi Admin! Full access granted.`, 'success');
        } else {
            showMessage(`Welcome back, ${user.name}!`, 'success');
        }
        
        // Close login modal and DO NOT reopen it
        if (loginModal) {
            loginModal.classList.remove("active");
        }
        return true;
    } else {
        showMessage('Invalid email or password. Please try again.', 'error');
        return false;
    }
}

// Logout function - NO AUTOMATIC MODAL REOPENING
function logout() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    localStorage.removeItem('loggedInUser');
    
    console.log('Logging out user:', user?.name);
    
    // Update all login buttons
    const loginBtns = document.querySelectorAll('#loginBtn, .nav-links #loginBtn');
    loginBtns.forEach(loginBtn => {
        if (loginBtn) {
            loginBtn.innerHTML = 'Login';
            loginBtn.classList.remove('logged-in');
            loginBtn.onclick = openLoginModal;
        }
    });
    
    showMessage(`Goodbye, ${user ? user.name : 'User'}! You have been logged out.`, 'success');
    
    const userMenu = document.getElementById('userMenu');
    if (userMenu) userMenu.remove();
    
    // DO NOT automatically open login modal after logout
}

// Show message function
function showMessage(message, type) {
    let messageEl = document.getElementById('loginMessage');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'loginMessage';
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            color: white;
            font-weight: 500;
            z-index: 3000;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
            transition: var(--transition);
            transform: translateX(100%);
        `;
        document.body.appendChild(messageEl);
    }

    messageEl.innerHTML = message;
    messageEl.style.background = type === 'success' ? 'var(--accent)' : 'var(--primary)';
    messageEl.style.opacity = '1';
    messageEl.style.transform = 'translateX(0)';

    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateX(100%)';
    }, 4000);
}

// Initialize forms - REMOVED SIGNUP FUNCTIONALITY
function initForms() {
    console.log('Initializing forms...');
    
    // Login form only
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            
            if (emailInput && passwordInput) {
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();
                console.log('Form values - Email:', email, 'Password:', password);
                login(email, password);
            } else {
                console.log('Login form inputs not found');
            }
        });
    } else {
        console.log('Login form not found');
    }
}

// Dashboard functionality
function initDashboard() {
    if (closeDashboard) {
        closeDashboard.addEventListener('click', () => {
            dashboardModal.classList.remove('active');
        });
    }

    initDashboardTabs();
    initNews();
    initReviews();
    initComments();
}

// Tab functionality
function initDashboardTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab') + 'Tab';
            const tabElement = document.getElementById(tabId);
            if (tabElement) {
                tabElement.classList.add('active');
            }
        });
    });
}

// News functionality
function initNews() {
    const newsForm = document.getElementById('newsForm');
    const refreshNews = document.getElementById('refreshNews');

    if (newsForm) {
        newsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('newsTitle');
            const contentInput = document.getElementById('newsContent');
            
            if (titleInput && contentInput) {
                const title = titleInput.value.trim();
                const content = contentInput.value.trim();
                
                if (title && content) {
                    postNewsUpdate(title, content);
                    newsForm.reset();
                }
            }
        });
    }

    if (refreshNews) {
        refreshNews.addEventListener('click', loadNews);
    }

    loadNews();
}

function loadNews() {
    const newsFeed = document.getElementById('newsFeed');
    if (!newsFeed) return;

    const news = JSON.parse(localStorage.getItem('moddiNews') || '[]');
    
    if (news.length === 0) {
        newsFeed.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <h4>No News Updates Yet</h4>
                <p>Be the first to share an update with the community!</p>
            </div>
        `;
        return;
    }

    news.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    newsFeed.innerHTML = news.map(item => `
        <div class="news-item ${item.authorRole === 'admin' ? 'admin-post' : ''} ${isCurrentUser(item.author) ? 'my-post' : ''}">
            <div class="news-header">
                <div>
                    <div class="news-title">${escapeHtml(item.title)}</div>
                    <div class="news-meta">
                        <span class="news-author ${isCurrentUser(item.author) ? 'current-user' : ''}">
                            ${escapeHtml(item.author)} ${isCurrentUser(item.author) ? '(You)' : ''}
                        </span>
                        • ${formatTimeAgo(item.timestamp)}
                        ${item.authorRole !== 'admin' ? `• ${getRoleBadge(item.authorRole)}` : ''}
                    </div>
                </div>
                <div class="post-badges">
                    ${item.authorRole === 'admin' ? '<span class="badge official-badge">Official</span>' : ''}
                    ${isCurrentUser(item.author) ? '<span class="badge my-badge">Your Post</span>' : ''}
                </div>
            </div>
            <div class="news-content">${escapeHtml(item.content)}</div>
            <div class="post-actions">
                <button class="action-btn" onclick="likePost('news', ${item.id})">
                    <i class="far fa-heart"></i> <span class="like-count">${item.likes || 0}</span>
                </button>
                ${isCurrentUser(item.author) ? `
                    <button class="action-btn delete-btn" onclick="deletePost('news', ${item.id})">
                        <i class="far fa-trash-alt"></i> Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function postNewsUpdate(title, content) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        showMessage('Please log in to post news updates', 'error');
        return;
    }

    const news = JSON.parse(localStorage.getItem('moddiNews') || '[]');
    const newUpdate = {
        id: Date.now(),
        title,
        content,
        author: user.name,
        authorRole: user.role,
        authorEmail: user.email,
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: []
    };

    news.unshift(newUpdate);
    localStorage.setItem('moddiNews', JSON.stringify(news));
    loadNews();
    updateProfileStats();
    showMessage('News update posted successfully!', 'success');
}

// Reviews functionality
function initReviews() {
    const addReviewBtn = document.getElementById('addReviewBtn');
    const cancelReview = document.getElementById('cancelReview');
    const reviewForm = document.getElementById('reviewForm');
    const ratingStars = document.querySelectorAll('.star');

    let currentRating = 0;

    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            star.addEventListener('click', () => {
                currentRating = parseInt(star.getAttribute('data-rating'));
                updateStarRating(currentRating);
            });
        });
    }

    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', () => {
            const reviewFormEl = document.getElementById('addReviewForm');
            if (reviewFormEl) {
                reviewFormEl.style.display = 'block';
                addReviewBtn.style.display = 'none';
            }
        });
    }

    if (cancelReview) {
        cancelReview.addEventListener('click', () => {
            const reviewFormEl = document.getElementById('addReviewForm');
            if (reviewFormEl) {
                reviewFormEl.style.display = 'none';
                if (addReviewBtn) addReviewBtn.style.display = 'flex';
                if (reviewForm) reviewForm.reset();
                currentRating = 0;
                updateStarRating(0);
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const reviewTextInput = document.getElementById('reviewText');
            if (!reviewTextInput) return;

            const reviewText = reviewTextInput.value.trim();
            
            if (currentRating === 0) {
                showMessage('Please select a rating', 'error');
                return;
            }

            if (reviewText) {
                submitReview(currentRating, reviewText);
                reviewForm.reset();
                currentRating = 0;
                updateStarRating(0);
                const reviewFormEl = document.getElementById('addReviewForm');
                if (reviewFormEl) reviewFormEl.style.display = 'none';
                if (addReviewBtn) addReviewBtn.style.display = 'flex';
            }
        });
    }

    loadReviews();
}

function updateStarRating(rating) {
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('ratingValue');
    
    if (stars.length > 0) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            star.classList.toggle('active', starRating <= rating);
        });
    }
    
    if (ratingValue) {
        ratingValue.textContent = rating;
    }
}

function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    const reviews = JSON.parse(localStorage.getItem('moddiReviews') || '[]');
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <h4>No Reviews Yet</h4>
                <p>Be the first to share your experience with the community!</p>
            </div>
        `;
        return;
    }

    reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item ${isCurrentUser(review.author) ? 'my-post' : ''}">
            <div class="review-header">
                <div class="review-author-info">
                    <span class="review-author ${isCurrentUser(review.author) ? 'current-user' : ''}">
                        ${escapeHtml(review.author)} ${isCurrentUser(review.author) ? '(You)' : ''}
                    </span>
                    <span class="review-role">${getRoleBadge(review.authorRole)}</span>
                </div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            <div class="review-content">${escapeHtml(review.content)}</div>
            <div class="review-meta">
                <span>Posted ${formatTimeAgo(review.timestamp)}</span>
                <span>Rating: ${review.rating}/5</span>
            </div>
            <div class="post-actions">
                <button class="action-btn" onclick="likePost('reviews', ${review.id})">
                    <i class="far fa-heart"></i> <span class="like-count">${review.likes || 0}</span>
                </button>
                ${isCurrentUser(review.author) ? `
                    <button class="action-btn delete-btn" onclick="deletePost('reviews', ${review.id})">
                        <i class="far fa-trash-alt"></i> Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function submitReview(rating, content) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        showMessage('Please log in to submit reviews', 'error');
        return;
    }

    const reviews = JSON.parse(localStorage.getItem('moddiReviews') || '[]');
    const newReview = {
        id: Date.now(),
        rating,
        content,
        author: user.name,
        authorRole: user.role,
        authorEmail: user.email,
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: []
    };

    reviews.unshift(newReview);
    localStorage.setItem('moddiReviews', JSON.stringify(reviews));
    loadReviews();
    updateProfileStats();
    showMessage('Review submitted successfully!', 'success');
}

// Comments functionality
function initComments() {
    const addCommentBtn = document.getElementById('addCommentBtn');
    const cancelComment = document.getElementById('cancelComment');
    const commentForm = document.getElementById('commentForm');

    if (addCommentBtn) {
        addCommentBtn.addEventListener('click', () => {
            const commentFormEl = document.getElementById('addCommentForm');
            if (commentFormEl) {
                commentFormEl.style.display = 'block';
                addCommentBtn.style.display = 'none';
            }
        });
    }

    if (cancelComment) {
        cancelComment.addEventListener('click', () => {
            const commentFormEl = document.getElementById('addCommentForm');
            if (commentFormEl) {
                commentFormEl.style.display = 'none';
                if (addCommentBtn) addCommentBtn.style.display = 'flex';
                if (commentForm) commentForm.reset();
            }
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('commentTitle');
            const contentInput = document.getElementById('commentText');
            
            if (!contentInput) return;

            const title = titleInput ? titleInput.value.trim() : '';
            const content = contentInput.value.trim();
            
            if (content) {
                submitComment(title, content);
                commentForm.reset();
                const commentFormEl = document.getElementById('addCommentForm');
                if (commentFormEl) commentFormEl.style.display = 'none';
                if (addCommentBtn) addCommentBtn.style.display = 'flex';
            }
        });
    }

    loadComments();
}

function loadComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    const comments = JSON.parse(localStorage.getItem('moddiComments') || '[]');
    
    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments"></i>
                <h4>No Community Comments Yet</h4>
                <p>Start the conversation and connect with others!</p>
            </div>
        `;
        return;
    }

    comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item ${isCurrentUser(comment.author) ? 'my-post' : ''}">
            <div class="comment-header">
                <div class="comment-author-info">
                    <span class="comment-author ${isCurrentUser(comment.author) ? 'current-user' : ''}">
                        ${escapeHtml(comment.author)} ${isCurrentUser(comment.author) ? '(You)' : ''}
                    </span>
                    <span class="comment-role">${getRoleBadge(comment.authorRole)}</span>
                </div>
                <div class="comment-meta">${formatTimeAgo(comment.timestamp)}</div>
            </div>
            ${comment.title ? `<div class="comment-title">${escapeHtml(comment.title)}</div>` : ''}
            <div class="comment-content">${escapeHtml(comment.content)}</div>
            <div class="post-actions">
                <button class="action-btn" onclick="likePost('comments', ${comment.id})">
                    <i class="far fa-heart"></i> <span class="like-count">${comment.likes || 0}</span>
                </button>
                ${isCurrentUser(comment.author) ? `
                    <button class="action-btn delete-btn" onclick="deletePost('comments', ${comment.id})">
                        <i class="far fa-trash-alt"></i> Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function submitComment(title, content) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        showMessage('Please log in to post comments', 'error');
        return;
    }

    const comments = JSON.parse(localStorage.getItem('moddiComments') || '[]');
    const newComment = {
        id: Date.now(),
        title,
        content,
        author: user.name,
        authorRole: user.role,
        authorEmail: user.email,
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: []
    };

    comments.unshift(newComment);
    localStorage.setItem('moddiComments', JSON.stringify(comments));
    loadComments();
    updateProfileStats();
    showMessage('Comment posted successfully!', 'success');
}

// Profile functionality
function loadProfile() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');
    const profileAvatar = document.getElementById('profileAvatar');
    const joinDate = document.getElementById('joinDate');

    if (profileName) profileName.textContent = user.name;
    if (profileEmail) profileEmail.textContent = user.email;
    if (profileRole) profileRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    if (profileAvatar) profileAvatar.textContent = user.avatar || '👤';
    if (joinDate) joinDate.textContent = user.joinDate || new Date().toISOString().split('T')[0];

    updateProfileStats();
}

function updateProfileStats() {
    const reviews = JSON.parse(localStorage.getItem('moddiReviews') || '[]');
    const comments = JSON.parse(localStorage.getItem('moddiComments') || '[]');
    const news = JSON.parse(localStorage.getItem('moddiNews') || '[]');
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!user) return;

    const userReviews = reviews.filter(review => review.author === user.name).length;
    const userComments = comments.filter(comment => comment.author === user.name).length;
    const userNews = news.filter(newsItem => newsItem.author === user.name).length;
    const totalLikes = calculateTotalLikes(user.name, reviews, comments, news);

    const reviewsCount = document.getElementById('reviewsCount');
    const commentsCount = document.getElementById('commentsCount');
    const newsCount = document.getElementById('newsCount');
    const likesCount = document.getElementById('likesCount');

    if (reviewsCount) reviewsCount.textContent = userReviews;
    if (commentsCount) commentsCount.textContent = userComments;
    if (newsCount) newsCount.textContent = userNews;
    if (likesCount) likesCount.textContent = totalLikes;
}

function calculateTotalLikes(username, reviews, comments, news) {
    let total = 0;
    
    reviews.forEach(review => {
        if (review.author === username) {
            total += review.likes || 0;
        }
    });
    
    comments.forEach(comment => {
        if (comment.author === username) {
            total += comment.likes || 0;
        }
    });
    
    news.forEach(newsItem => {
        if (newsItem.author === username) {
            total += newsItem.likes || 0;
        }
    });
    
    return total;
}

// Helper functions
function isCurrentUser(authorName) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    return user && user.name === authorName;
}

function getRoleBadge(role) {
    const colors = {
        'admin': '#EF4444',
        'client': '#10B981',
        'designer': '#8B5CF6',
        'partner': '#F59E0B'
    };
    const color = colors[role] || '#6B7280';
    return `<span style="background: ${color}; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.7rem; font-weight: 600;">${role}</span>`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

// Post interaction functions
function likePost(type, postId) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        showMessage('Please log in to like posts', 'error');
        return;
    }

    const storageKey = `moddi${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const itemIndex = items.findIndex(item => item.id === postId);

    if (itemIndex === -1) return;

    const item = items[itemIndex];
    if (!item.likedBy) item.likedBy = [];
    
    const userIndex = item.likedBy.indexOf(user.name);
    
    if (userIndex === -1) {
        item.likedBy.push(user.name);
        item.likes = (item.likes || 0) + 1;
        showMessage('Post liked!', 'success');
    } else {
        item.likedBy.splice(userIndex, 1);
        item.likes = Math.max(0, (item.likes || 1) - 1);
        showMessage('Post unliked', 'success');
    }

    items[itemIndex] = item;
    localStorage.setItem(storageKey, JSON.stringify(items));

    switch (type) {
        case 'news': loadNews(); break;
        case 'reviews': loadReviews(); break;
        case 'comments': loadComments(); break;
    }
    
    updateProfileStats();
}

function deletePost(type, postId) {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        return;
    }

    const storageKey = `moddi${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const filteredItems = items.filter(item => item.id !== postId);
    
    localStorage.setItem(storageKey, JSON.stringify(filteredItems));
    showMessage('Post deleted successfully', 'success');

    switch (type) {
        case 'news': loadNews(); break;
        case 'reviews': loadReviews(); break;
        case 'comments': loadComments(); break;
    }
    
    updateProfileStats();
}

// Dashboard and profile view functions
function viewDashboard() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        showMessage('Please log in to access the dashboard', 'error');
        return;
    }

    if (dashboardModal) {
        dashboardModal.classList.add('active');
        loadProfile();
        
        const userMenu = document.getElementById('userMenu');
        if (userMenu) userMenu.remove();
    }
}

function viewProfile() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        showMessage('Please log in to view your profile', 'error');
        return;
    }

    if (dashboardModal) {
        dashboardModal.classList.add('active');
        loadProfile();
        
        const profileTab = document.querySelector('[data-tab="profile"]');
        if (profileTab) profileTab.click();
        
        const userMenu = document.getElementById('userMenu');
        if (userMenu) userMenu.remove();
    }
}

// Utility function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
