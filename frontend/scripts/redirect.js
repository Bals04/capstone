// redirect.js

function redirectToDashboard(userType) {
    let targetUrl;
    alert("utype " + userType)
    switch (userType) {
        case 'Member':
            targetUrl = '/frontend/views/member/memberDashboard.html';
            break;
        case 'Trainer':
            targetUrl = '/frontend/views/trainer/index.html';
            break;
        case 'Gym admin':
            targetUrl = '/frontend/views/gym_admin/gymAdminDashboard.html';
            break;
        case 'Admin':
            targetUrl = '/frontend/views/admin/adminDashboard.html';
            break;
        default:
            targetUrl = '/frontend/views/Landing Page/index.html';
            break;
    }
    window.location.href = targetUrl;
}
