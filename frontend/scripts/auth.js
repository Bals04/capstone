document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    const userType = localStorage.getItem('userType');
    const isLoggedIn = !!token;

    const currentPath = window.location.pathname;
    // alert(`user type: ${userType}`)
    // Redirect logged-in users away from the login page
    if (currentPath === 'frontend/views/features/login.html' && isLoggedIn) {
        if (userType === 'Member') {
            window.location.href = '/frontend/views/member/index.html';
        } else if (userType === 'Trainer') {
            window.location.href = '/frontend/views/trainer/index.html';
        } else if (userType === 'Admin') {
            window.location.href = '/frontend/views/admin/adminDashboard.html';
        } else if (userType === 'Gym admin') {
            window.location.href = '/frontend/views/admin/Pending.html';
        } else {
            window.location.href = '/frontend/views/Landing Page/index.html'; // Fallback
        }
    }

    // Redirect not logged-in users to the login page
    if (!isLoggedIn) {
        if (currentPath === '/frontend/views/features/login.html') {
            return
        }else{
            window.location.href = '/frontend/views/features/login.html'; // Fallback
            return; // Stop further processing if redirecting
        }
    }
    // Restrict access to dashboards based on user roles
    if (isLoggedIn) {
        switch (userType) {
            case 'Member':
                if (!currentPath.endsWith('index.html') && !currentPath.includes('memberdashboard.html')) {
                    window.location.href = '/frontend/views/member/index.html';
                }
                break;
            case 'Trainer':
                if (!currentPath.endsWith('index.html') && !currentPath.includes('trainerdashboard.html')) {
                    window.location.href = '/frontend/views/trainer/index.html';
                }
                break;
            case 'Gym admin':
                if (!currentPath.endsWith('adminDashboard.html')) {
                    window.location.href = '/frontend/views/admin/adminDashboard.html';
                }
                break;
            default:
                window.location.href = '/frontend/views/Landing Page/index.html'; // Fallback
                break;
        }
    }
});
