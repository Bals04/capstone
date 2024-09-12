document.addEventListener('DOMContentLoaded', () => {
    // Helper function to fetch session data from the server
    async function getSessionData() {
        try {
            const response = await axios.get('http://localhost:3000/auth/session-data', { withCredentials: true });

            // Axios automatically parses JSON response, so no need to call .json()
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error fetching session data:', error);
            return null;
        }
    }

    // Function to handle redirection based on session data
    function handleRedirection(sessionData) {
        const { authorized, userType, accessToken } = sessionData;

        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/');
        const thirdPart = pathParts[3];

        if (authorized) {
            // Redirect logged-in users away from the login page
            if (currentPath === '/frontend/views/features/login.html') {
                if (userType === 'Member') {
                    window.location.href = '/frontend/views/member/memberDashboard.html';
                } else if (userType === 'Trainer') {
                    window.location.href = '/frontend/views/trainer/index.html';
                } else if (userType === 'Admin') {
                    window.location.href = '/frontend/views/admin/adminDashboard.html';
                } else if (userType === 'Gym admin') {
                    window.location.href = '/frontend/views/gym_admin/gymAdminDashboard.html';
                } else {
                    window.location.href = '/frontend/views/Landing Page/index.html'; // Fallback
                }
                return;
            }

            // Restrict access to dashboards based on user roles
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
                    if (thirdPart !== 'gym_admin') {
                        window.location.href = '/frontend/views/gym_admin/gymAdminDashboard.html';
                    }
                    break;
                case 'Admin':
                    if (thirdPart !== 'admin') {
                        window.location.href = '/frontend/views/admin/adminDashboard.html';
                    }
                    break;
                default:
                    window.location.href = '/frontend/views/Landing Page/index.html'; // Fallback
                    break;
            }
        } else {
            // Redirect not logged-in users to the login page
            if (currentPath !== '/frontend/views/features/login.html') {
                window.location.href = '/frontend/views/features/login.html'; // Fallback
            }
        }
    }

    // Fetch session data and handle redirection
    getSessionData().then(sessionData => {
        if (sessionData) {
            handleRedirection(sessionData);
        } else {
            console.error('No session data available');
        }
    });
});
