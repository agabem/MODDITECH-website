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
    }
];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing application');
    ensureAdminLoggedIn(); // MUST BE FIRST - login before any modal initialization
    initModals();
    initForms();
    initDashboard();
});

// Ensure admin is logged in - ABSOLUTELY NO POPUPS
function ensureAdminLoggedIn() {
    console.log('Ensuring admin is logged in...');
    
    // Force admin login - no conditions
    const adminUser = users.find(u => u.email === "modditechdesigns@gmail.com");
    if (adminUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
        updateUIForLoggedInUser(adminUser);
        console.log('Admin auto-logged in: Moddi Admin');
        
        // CRITICAL: Ensure login modal is closed
        if (loginModal) {
            loginModal.classList.remove("active");
        }
    }
}

// Initialize modals - NO AUTOMATIC OPENING
function initModals() {
    console.log('Initializing modals...');
    
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

    // CRITICAL: Ensure login modal starts closed
    if (loginModal) {
        loginModal.classList.remove("active");
    }
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
            
            // Change click behavior to show user menu
            loginBtn.onclick = showUserMenu;
        }
    });

    // CRITICAL: Ensure login modal is closed after UI update
    if (loginModal) {
        loginModal.classList.remove("active");
    }
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

    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        console.log('User saved to localStorage:', user);
        
        updateUIForLoggedInUser(user);
        
        showMessage(`🎉 Welcome back, ${user.name}!`, 'success');
        
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
    // User must manually click login if they want to log back in
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

// Initialize forms
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
            }
        });
    }

    // Waitlist form
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            if (email) {
                showMessage('Thank you for joining our waitlist!', 'success');
                waitlistForm.reset();
            }
        });
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
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

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
    if (!user) return;

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

    // Rating stars
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            setRating(rating);
        });
    });

    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', () => {
            document.getElementById('addReviewForm').style.display = 'block';
            addReviewBtn.style.display = 'none';
        });
    }

    if (cancelReview) {
        cancelReview.addEventListener('click', () => {
            document.getElementById('addReviewForm').style.display = 'none';
            addReviewBtn.style.display = 'flex';
            reviewForm.reset();
            setRating(0);
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = parseInt(document.getElementById('ratingValue').textContent);
            const text = document.getElementById('reviewText').value.trim();
            
            if (rating === 0) {
                showMessage('Please select a rating.', 'error');
                return;
            }
            
            if (text) {
                postReview(rating, text);
                reviewForm.reset();
                setRating(0);
                document.getElementById('addReviewForm').style.display = 'none';
                addReviewBtn.style.display = 'flex';
            }
        });
    }

    loadReviews();
}

function setRating(rating) {
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('ratingValue');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    ratingValue.textContent = rating;
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
                <p>Be the first to share your experience!</p>
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
                    ${review.authorRole !== 'admin' ? `<span class="review-role">${getRoleBadge(review.authorRole)}</span>` : ''}
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <div class="review-content">${escapeHtml(review.text)}</div>
            <div class="review-meta">
                <span>${formatTimeAgo(review.timestamp)}</span>
                ${isCurrentUser(review.author) ? `
                    <button class="action-btn delete-btn" onclick="deleteReview(${review.id})">
                        <i class="far fa-trash-alt"></i> Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function postReview(rating, text) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    const reviews = JSON.parse(localStorage.getItem('moddiReviews') || '[]');
    const newReview = {
        id: Date.now(),
        rating,
        text,
        author: user.name,
        authorRole: user.role,
        authorEmail: user.email,
        timestamp: new Date().toISOString()
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
            document.getElementById('addCommentForm').style.display = 'block';
            addCommentBtn.style.display = 'none';
        });
    }

    if (cancelComment) {
        cancelComment.addEventListener('click', () => {
            document.getElementById('addCommentForm').style.display = 'none';
            addCommentBtn.style.display = 'flex';
            commentForm.reset();
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('commentTitle').value.trim();
            const text = document.getElementById('commentText').value.trim();
            
            if (text) {
                postComment(title, text);
                commentForm.reset();
                document.getElementById('addCommentForm').style.display = 'none';
                addCommentBtn.style.display = 'flex';
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
                <h4>No Comments Yet</h4>
                <p>Start the conversation!</p>
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
                    ${comment.authorRole !== 'admin' ? `<span class="comment-role">${getRoleBadge(comment.authorRole)}</span>` : ''}
                </div>
            </div>
            ${comment.title ? `<div class="comment-title">${escapeHtml(comment.title)}</div>` : ''}
            <div class="comment-content">${escapeHtml(comment.text)}</div>
            <div class="comment-meta">
                <span>${formatTimeAgo(comment.timestamp)}</span>
                ${isCurrentUser(comment.author) ? `
                    <button class="action-btn delete-btn" onclick="deleteComment(${comment.id})">
                        <i class="far fa-trash-alt"></i> Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function postComment(title, text) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    const comments = JSON.parse(localStorage.getItem('moddiComments') || '[]');
    const newComment = {
        id: Date.now(),
        title,
        text,
        author: user.name,
        authorRole: user.role,
        authorEmail: user.email,
        timestamp: new Date().toISOString()
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

    // Update profile information
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('profileAvatar').textContent = user.avatar;
    document.getElementById('joinDate').textContent = user.joinDate;

    // Update stats
    updateProfileStats();
}

function updateProfileStats() {
    const news = JSON.parse(localStorage.getItem('moddiNews') || '[]');
    const reviews = JSON.parse(localStorage.getItem('moddiReviews') || '[]');
    const comments = JSON.parse(localStorage.getItem('moddiComments') || '[]');
    
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    const userNews = news.filter(item => item.authorEmail === user.email).length;
    const userReviews = reviews.filter(item => item.authorEmail === user.email).length;
    const userComments = comments.filter(item => item.authorEmail === user.email).length;

    document.getElementById('newsCount').textContent = userNews;
    document.getElementById('reviewsCount').textContent = userReviews;
    document.getElementById('commentsCount').textContent = userComments;
}

// Dashboard and profile view functions
function viewDashboard() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    if (dashboardModal) {
        dashboardModal.classList.add('active');
        loadProfile();
        
        const userMenu = document.getElementById('userMenu');
        if (userMenu) userMenu.remove();
    }
}

function viewProfile() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    if (dashboardModal) {
        dashboardModal.classList.add('active');
        loadProfile();
        
        const profileTab = document.querySelector('[data-tab="profile"]');
        if (profileTab) profileTab.click();
        
        const userMenu = document.getElementById('userMenu');
        if (userMenu) userMenu.remove();
    }
}

// Delete functions
function deletePost(type, id) {
    if (confirm('Are you sure you want to delete this post?')) {
        let items = JSON.parse(localStorage.getItem(`moddi${type.charAt(0).toUpperCase() + type.slice(1)}`) || '[]');
        items = items.filter(item => item.id !== id);
        localStorage.setItem(`moddi${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(items));
        
        if (type === 'news') loadNews();
        updateProfileStats();
        showMessage('Post deleted successfully!', 'success');
    }
}

function deleteReview(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        let reviews = JSON.parse(localStorage.getItem('moddiReviews') || '[]');
        reviews = reviews.filter(review => review.id !== id);
        localStorage.setItem('moddiReviews', JSON.stringify(reviews));
        loadReviews();
        updateProfileStats();
        showMessage('Review deleted successfully!', 'success');
    }
}

function deleteComment(id) {
    if (confirm('Are you sure you want to delete this comment?')) {
        let comments = JSON.parse(localStorage.getItem('moddiComments') || '[]');
        comments = comments.filter(comment => comment.id !== id);
        localStorage.setItem('moddiComments', JSON.stringify(comments));
        loadComments();
        updateProfileStats();
        showMessage('Comment deleted successfully!', 'success');
    }
}

// Like function
function likePost(type, id) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    let items = JSON.parse(localStorage.getItem(`moddi${type.charAt(0).toUpperCase() + type.slice(1)}`) || '[]');
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        const item = items[itemIndex];
        if (!item.likedBy) item.likedBy = [];
        
        const userIndex = item.likedBy.indexOf(user.email);
        if (userIndex === -1) {
            item.likedBy.push(user.email);
            item.likes = (item.likes || 0) + 1;
        } else {
            item.likedBy.splice(userIndex, 1);
            item.likes = (item.likes || 0) - 1;
        }
        
        localStorage.setItem(`moddi${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(items));
        
        if (type === 'news') loadNews();
    }
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