document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('history-table-body');
    const filterDate = document.getElementById('filter-date');
    const filterStatus = document.getElementById('filter-status');
    const sortOptions = document.getElementById('sort-options');

    async function fetchData() {
        try {
            const response = await fetch('http://localhost:3000/api/auth/classifications');
            const data = await response.json();
            displayData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayData(data) {
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(item.created_at).toLocaleDateString()}</td>
                <td><img src="${item.image_url}" alt="Seedling Image" width="50"></td>
                <td>${item.classification}</td>
                <td>${item.location || 'N/A'}</td> <!-- Display Location, default to 'N/A' if not available -->
            `;
            tableBody.appendChild(row);
        });
    }

    function applyFilters() {
        const dateValue = filterDate.value;
        const statusValue = filterStatus.value;
        const sortValue = sortOptions.value;

        fetch('http://localhost:3000/api/auth/classifications')
            .then(response => response.json())
            .then(data => {
                if (dateValue) {
                    data = data.filter(item => new Date(item.created_at).toLocaleDateString() === new Date(dateValue).toLocaleDateString());
                }

                if (statusValue !== 'all') {
                    data = data.filter(item => item.classification.toLowerCase() === statusValue);
                }

                if (sortValue === 'date') {
                    data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                } else if (sortValue === 'status') {
                    data.sort((a, b) => a.classification.localeCompare(b.classification));
                }

                displayData(data);
            })
            .catch(error => console.error('Error fetching filtered data:', error));
    }

    document.querySelector('.filters button').addEventListener('click', applyFilters);

    fetchData();
});
