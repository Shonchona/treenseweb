document.addEventListener('DOMContentLoaded', () => {
    const healthChartCtx = document.getElementById('healthChart').getContext('2d');

    async function fetchData() {
        try {
            const response = await fetch('http://localhost:3000/api/auth/classifications');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    function createChart(data) {
        const labels = [...new Set(data.map(item => new Date(item.created_at).toLocaleDateString()))];
        const healthyData = labels.map(label => data.filter(item => new Date(item.created_at).toLocaleDateString() === label && item.classification === 'Healthy').length);
        const unhealthyData = labels.map(label => data.filter(item => new Date(item.created_at).toLocaleDateString() === label && item.classification === 'Unhealthy').length);

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Healthy',
                    data: healthyData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Unhealthy',
                    data: unhealthyData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        };

        new Chart(healthChartCtx, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    async function init() {
        const data = await fetchData();
        createChart(data);
    }

    function exportCSV() {
        fetch('http://localhost:3000/api/auth/classifications')
            .then(response => response.json())
            .then(data => {
                const csvData = data.map(item => `${item.created_at},${item.image_url},${item.classification}`).join('\n');
                const blob = new Blob([csvData], { type: 'text/csv' });
                saveAs(blob, 'classifications.csv');
            })
            .catch(error => console.error('Error exporting data:', error));
    }

    document.getElementById('exportCsv').addEventListener('click', exportCSV);

    async function exportPDF() {
        const data = await fetchData();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const rows = data.map(item => [new Date(item.created_at).toLocaleDateString(), item.image_url, item.classification]);
        doc.autoTable({
            head: [['Date', 'Image URL', 'Classification']],
            body: rows,
        });
        doc.save('classifications.pdf');
    }

    document.getElementById('exportPdf').addEventListener('click', exportPDF);

    init();
});
