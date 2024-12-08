document.addEventListener('DOMContentLoaded', () => {
    const savePersonalInfoBtn = document.getElementById('save-personal-info-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    async function savePersonalInfo() {
        const username = usernameInput.value;
        const email = emailInput.value;
        try {
            const response = await fetch('http://localhost:3000/api/auth/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email })
            });
            if (response.ok) {
                alert('Personal information saved successfully.');
            } else {
                alert('Failed to save personal information.');
            }
        } catch (error) {
            console.error('Error saving personal information:', error);
            alert('Error saving personal information.');
        }
    }

    async function changePassword() {
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            if (response.ok) {
                alert('Password changed successfully.');
            } else {
                alert('Failed to change password.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Error changing password.');
        }
    }

    async function deleteAccount() {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/auth/delete-account', {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Account deleted successfully.');
                // Redirect to login page or homepage
                window.location.href = 'login.html';
            } else {
                alert('Failed to delete account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account.');
        }
    }

    savePersonalInfoBtn.addEventListener('click', savePersonalInfo);
    changePasswordBtn.addEventListener('click', changePassword);
    deleteAccountBtn.addEventListener('click', deleteAccount);
});
