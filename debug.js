// debug.js - Add this to check what's happening
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - checking elements:');
    console.log('Login button:', document.getElementById('loginBtn'));
    console.log('Login modal:', document.getElementById('loginModal'));
    console.log('Dashboard modal:', document.getElementById('dashboardModal'));
    
    // Test click handler
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            console.log('Login button clicked!');
        });
    }
});