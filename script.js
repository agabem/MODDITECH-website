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
// Enhanced User Management System with Error Handling
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
                    email: "admin@modditech.com",
                    password: "admin123",
                    firstName: "Moddi",
                    lastName: "Admin",
                    role: "admin",
                    avatar: "👑",
                    joinDate: "2024-01-01",
                    bio: "Lead Administrator"
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
            // Validate required fields
            if (!userData.email || !userData.password || !userData.firstName || !userData.role) {
                return { success: false, message: "All fields are required" };
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                return { success: false, message: "Invalid email format" };
            }

            // Check if user already exists
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

// Enhanced News Management System with Error Handling
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

// DOM Elements Cache
const elements = {
    loginBtn: null,
    loginModal: null,
    dashboardModal: null,
    closeLogin: null,
    closeDashboard: null
};

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

            // Add styles if not already present
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 100px;
                        right: 20px;
                        background: var(--bg-secondary);
                        border: 1px solid var(--border);
                        border-radius: var(--radius);
                        padding: 1rem 1.5rem;
                        color: var(--text-primary);
                        box-shadow: var(--shadow-lg);
                        z-index: 3000;
                        transform: translateX(100%);
                        transition: var(--transition);
                        max-width: 300px;
                    }
                    .notification.success {
                        border-left: 4px solid var(--accent);
                    }
                    .notification.error {
                        border-left: 4px solid var(--danger);
                    }
                    .notification.info {
                        border-left: 4px solid var(--primary);
                    }
                    .notification.show {
                        transform: translateX(0);
                    }
                    .notification-content {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    .notification i {
                        font-size: 1.2rem;
                    }
                    .notification.success i {
                        color: var(--accent);
                    }
                    .notification.error i {
                        color: var(--danger);
                    }
                    .notification.info i {
                        color: var(--primary);
                    }
                `;
                document.head.appendChild(style);
            }

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
            
            // Cache DOM elements
            this.cacheElements();
            
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

    cacheElements() {
        elements.loginBtn = utils.getElement('loginBtn');
        elements.loginModal = utils.getElement('loginModal');
        elements.dashboardModal = utils.getElement('dashboardModal');
        elements.closeLogin = utils.getElement('closeLogin');
        elements.closeDashboard = utils.getElement('closeDashboard');
    },

    setupEventListeners() {
        try {
            // Modal controls
            if (elements.loginBtn) {
                elements.loginBtn.addEventListener('click', this.handleLoginClick.bind(this));
            }
            if (elements.closeLogin) {
                elements.closeLogin.addEventListener('click', this.closeLoginModal.bind(this));
            }
            if (elements.closeDashboard) {
                elements.closeDashboard.addEventListener('click', this.closeDashboardModal.bind(this));
            }

            // Auth forms
            this.setupAuthForms();
            
            // Dashboard functionality
            this.setupDashboard();
            
            // Close modals on outside click
            document.addEventListener('click', this.handleOutsideClick.bind(this));
            
            // Navbar scroll effect
            window.addEventListener('scroll', this.handleScroll.bind(this));
            
            // Mobile menu
            this.setupMobileMenu();
            
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
            document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
            
            // Update forms
            const authForms = document.querySelectorAll('.auth-form');
            authForms.forEach(form => form.classList.remove('active'));
            utils.getElement(`${tab}Form`).classList.add('active');
        } catch (error) {
            console.error('Error switching auth tab:', error);
        }
    },

    handleLogin(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const email = formData.get('email') || e.target.querySelector('input[type="email"]')?.value;
            const password = formData.get('password') || e.target.querySelector('input[type="password"]')?.value;

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
            const formData = new FormData(e.target);
            const userRoleSelect = utils.getElement('userRole');
            
            const userData = {
                firstName: formData.get('firstName') || e.target.querySelector('input[placeholder="First Name"]')?.value,
                lastName: formData.get('lastName') || e.target.querySelector('input[placeholder="Last Name"]')?.value,
                email: formData.get('email') || e.target.querySelector('input[type="email"]')?.value,
                password: formData.get('password') || e.target.querySelector('input[type="password"]')?.value,
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

    setupMobileMenu() {
        try {
            const hamburgerBtn = utils.getElement('hamburgerBtn');
            const mobileMenu = utils.getElement('mobileMenu');

            if (hamburgerBtn && mobileMenu) {
                hamburgerBtn.addEventListener('click', () => {
                    hamburgerBtn.classList.toggle('active');
                    mobileMenu.classList.toggle('active');
                });
            }
        } catch (error) {
            console.error('Error setting up mobile menu:', error);
        }
    },

    handleOutsideClick(e) {
        if (e.target === elements.loginModal) {
            this.closeLoginModal();
        }
        if (e.target === elements.dashboardModal) {
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
            
            if (user && elements.loginBtn) {
                elements.loginBtn.innerHTML = `
                    <div class="user-avatar-small">${user.avatar}</div>
                    ${user.firstName}
                `;
                elements.loginBtn.classList.add('logged-in');
            } else if (elements.loginBtn) {
                elements.loginBtn.innerHTML = 'Login';
                elements.loginBtn.classList.remove('logged-in');
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
            if (elements.loginModal) {
                elements.loginModal.classList.add('active');
            }
        } catch (error) {
            console.error('Error opening login modal:', error);
        }
    },

    closeLoginModal() {
        try {
            if (elements.loginModal) {
                elements.loginModal.classList.remove('active');
            }
        } catch (error) {
            console.error('Error closing login modal:', error);
        }
    },

    openDashboard() {
        try {
            if (elements.dashboardModal) {
                elements.dashboardModal.classList.add('active');
                this.loadDashboardData();
            }
        } catch (error) {
            console.error('Error opening dashboard:', error);
        }
    },

    closeDashboardModal() {
        try {
            if (elements.dashboardModal) {
                elements.dashboardModal.classList.remove('active');
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
