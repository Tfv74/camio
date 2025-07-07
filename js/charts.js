// Configuración y manejo de gráficos con Chart.js

let earningsChart = null;
let itemsChart = null;

function initCharts() {
    // Crear gráfico de líneas para ganancias
    const earningsCtx = document.getElementById('earnings-chart').getContext('2d');
    earningsChart = new Chart(earningsCtx, {
        type: 'line',
        data: {
            labels: [], // Se llenarán dinámicamente
            datasets: [{
                label: 'Ganancias ($)',
                data: [], // Se llenarán dinámicamente
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgb(43, 199, 173)',
                borderWidth: 3,
                tension: 0.1,
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Crear gráfico de pastel para distribución de objetos
    const itemsCtx = document.getElementById('items-chart').getContext('2d');
    itemsChart = new Chart(itemsCtx, {
        type: 'pie',
        data: {
            labels: ['Medicamentos', 'Crack'],
            datasets: [{
                data: [0, 0], // Se llenarán dinámicamente
                backgroundColor: [
                    'rgba(255, 0, 0, 0.7)',
                    'rgba(49, 43, 42, 0.7)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateCharts(year, month) {
    const monthData = DataManager.getTripsByMonth(year, month);
    
    // Ordenar las fechas
    const sortedDates = Object.keys(monthData).sort();
    
    // Datos para el gráfico de líneas
    const days = [];
    const earnings = [];
    
    // Acumuladores para el gráfico de pastel
    let totalMeds = 0;
    let totalCrack = 0;
    
    sortedDates.forEach(date => {
        // Extraer solo el día del mes para etiquetas
        const day = new Date(date).getDate();
        days.push(day);
        
        const trip = monthData[date];
        earnings.push(trip.earnings);
        
        totalMeds += parseInt(trip.meds) || 0;
        totalCrack += parseInt(trip.crack) || 0;
    });
    
    // Actualizar gráfico de líneas
    earningsChart.data.labels = days;
    earningsChart.data.datasets[0].data = earnings;
    earningsChart.update();
    
    // Actualizar gráfico de pastel
    itemsChart.data.datasets[0].data = [totalMeds, totalCrack];
    itemsChart.update();
}
