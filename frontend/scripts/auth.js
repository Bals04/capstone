document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    const userType = localStorage.getItem('userType');
    const isLoggedIn = !!token;

    const currentPath = window.location.pathname; // Gets the current path
    const pathParts = currentPath.split('/'); // Split the path by "/"
    const thirdPart = pathParts[3];

    // Decode JWT token to get user information
    userId = null;
    if (token) {
        try {
            const decodedToken = jwt_decode(token); // Use jwt_decode(token) for decoding
            console.log('Decoded Token:', decodedToken); // Log the entire decoded token for inspection
            userId = decodedToken.id; // Replace 'id' with the actual key in your token payload

        } catch (error) { 
            console.error('Failed to decode token', error);
        }
    } else {
        console.log('No token found in localStorage.');
    }
    // Redirect logged-in users away from the login page
    if (currentPath === '/frontend/views/features/login.html' && isLoggedIn) {
        if (userType === 'Member') {
            window.location.href = '/frontend/views/member/memberDashboard.html';
        } else if (userType === 'Trainer') {
            window.location.href = '/frontend/views/trainer/index.html';
        } else if (userType === 'Admin') {
            window.location.href = '/frontend/views/admin/adminDashboard.html';
        } else if (userType === 'Gym admin') {
            window.location.href = '/frontend/views/admin/adminDashboard.html';
        } else {
            window.location.href = '/frontend/views/Landing Page/index.html'; // Fallback
        }
        return;
    }

    // Redirect not logged-in users to the login page
    if (!isLoggedIn) {
        if (currentPath !== '/frontend/views/features/login.html') {
            window.location.href = '/frontend/views/features/login.html'; // Fallback
            return;
        }
    }

    // Restrict access to dashboards based on user roles
    if (isLoggedIn) {
        switch (userType) {
            case 'Member':
                if (thirdPart !== 'member') {
                    window.location.href = '/frontend/views/member/memberDashboard.html';
                }
                break;
            case 'Trainer':
                if (thirdPart !== 'trainer') {
                    window.location.href = '/frontend/views/trainer/index.html';
                }
                break;
            case 'Gym admin':
                if (thirdPart !== 'admin') {
                    window.location.href = '/frontend/views/admin/adminDashboard.html';
                }
                break;
            default:
                // Handle cases where the userType is not recognized
                window.location.href = '/frontend/views/Landing Page/index.html'; // Fallback
                break;
        }
    }
});
