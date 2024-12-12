document.addEventListener('DOMContentLoaded', () => {
    const savePersonalInfoBtn = document.getElementById('save-personal-info-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const emailInput = document.getElementById('email');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const avatarUploadInput = document.getElementById('avatar-upload');
    const profileAvatar = document.getElementById('profile-avatar');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');

    // Fetch user data from the server
    async function fetchUserProfile() {
        try {
            const response = await fetch('http://localhost:3000/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any required authentication headers
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const data = await response.json();
            // Update the profile section with the fetched user data
            userNameElement.textContent = `${data.first_name} ${data.last_name}`;
            userEmailElement.textContent = data.email;
            emailInput.value = data.email; // Set the input field with current data

            // If user has an avatar, update the image
            if (data.avatar_url) {
                profileAvatar.src = data.avatar_url;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            alert('Error fetching user profile.');
        }
    }

    // Save personal information
    async function savePersonalInfo() {
        const email = emailInput.value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
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

    // Change password
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

    // Delete account
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
                window.location.href = 'index.html';
            } else {
                alert('Failed to delete account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account.');
        }
    }

    // Handle avatar upload
    avatarUploadInput.addEventListener('change', async () => {
        const file = avatarUploadInput.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch('http://localhost:3000/api/auth/upload-avatar', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                profileAvatar.src = data.avatarUrl; // Update profile image
                alert('Profile picture updated successfully.');
            } else {
                alert('Failed to upload profile picture.');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar.');
        }
    });

    // Event listeners for buttons
    savePersonalInfoBtn.addEventListener('click', savePersonalInfo);
    changePasswordBtn.addEventListener('click', changePassword);
    deleteAccountBtn.addEventListener('click', deleteAccount);

    // Fetch the user profile when the page loads
    fetchUserProfile();
});
