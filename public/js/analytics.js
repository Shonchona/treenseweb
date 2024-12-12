document.addEventListener('DOMContentLoaded', () => {
    const healthChartCtx = document.getElementById('healthChart').getContext('2d');
    const classificationPieChartCtx = document.getElementById('classificationPieChart').getContext('2d'); // Pie chart context

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

    function createBarChart(data) {
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
                        ticks: {
                            stepSize: 1, // Ensures the interval between ticks is 1
                            callback: function(value) {
                                return Number.isInteger(value) ? value : null; // Display only whole numbers
                            },
                        },
                    },
                },
            },
        });
    }

    // Create Pie Chart for classification distribution with percentages
    function createPieChart(data) {
        const healthyCount = data.filter(item => item.classification === 'Healthy').length;
        const unhealthyCount = data.filter(item => item.classification === 'Unhealthy').length;
        const total = healthyCount + unhealthyCount;
        const healthyPercentage = ((healthyCount / total) * 100).toFixed(2);
        const unhealthyPercentage = ((unhealthyCount / total) * 100).toFixed(2);

        const pieData = {
            labels: ['Healthy', 'Unhealthy'],
            datasets: [{
                data: [healthyCount, unhealthyCount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        };

        new Chart(classificationPieChartCtx, {
            type: 'pie',
            data: pieData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw + ' entries (' + (tooltipItem.raw / total * 100).toFixed(2) + '%)';
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        formatter: (value, context) => {
                            let percentage = (value / total * 100).toFixed(2);
                            return `${percentage}%`; // Show percentage in each segment
                        },
                        color: 'white',
                        font: {
                            weight: 'bold',
                            size: 14
                        }
                    }
                }
            }
        });
    }

    async function init() {
        const data = await fetchData();
        createBarChart(data);
        createPieChart(data); // Create the pie chart
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
