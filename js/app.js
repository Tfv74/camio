// Funcionalidad principal de la aplicación

// Variables para seguir el mes/año actual seleccionado
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1; // JavaScript meses son 0-11

// Elementos DOM
const currentMonthEl = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const tripForm = document.getElementById('trip-form');
const dataBody = document.getElementById('data-body');
const totalTripsEl = document.getElementById('total-trips');
const totalEarningsEl = document.getElementById('total-earnings');
const avgEarningsEl = document.getElementById('avg-earnings');

// Formato para mostrar el mes y año
function formatMonthYear(year, month) {
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

// Actualizar el texto del mes actual
function updateCurrentMonthDisplay() {
    currentMonthEl.textContent = formatMonthYear(currentYear, currentMonth);
}

// Cargar datos del mes seleccionado
function loadMonthData() {
    // Actualizar encabezado del mes
    updateCurrentMonthDisplay();
    
    // Limpiar tabla
    dataBody.innerHTML = '';
    
    // Obtener datos del mes
    const monthData = DataManager.getTripsByMonth(currentYear, currentMonth);
    
    // Ordenar fechas
    const sortedDates = Object.keys(monthData).sort();
    
    // Llenar tabla
    sortedDates.forEach(date => {
        const trip = monthData[date];
        const row = document.createElement('tr');
        
        // Extraer solo el día para mostrar
        const day = new Date(date).getDate();
        
        row.innerHTML = `
            <td>${day}</td>
            <td>${trip.trips}</td>
            <td>$${trip.earnings}</td>
            <td>${trip.meds}</td>
            <td>${trip.crack}</td>
            <td>
                <button class="delete-btn" data-date="${date}">Eliminar</button>
            </td>
        `;
        
        dataBody.appendChild(row);
    });
    
    // Actualizar estadísticas
    updateStats();
    
    // Actualizar gráficos
    updateCharts(currentYear, currentMonth);
}

// Actualizar estadísticas para el mes actual
function updateStats() {
    const stats = DataManager.calculateMonthStats(currentYear, currentMonth);
    
    totalTripsEl.textContent = stats.totalTrips;
    totalEarningsEl.textContent = `$${stats.totalEarnings}`;
    avgEarningsEl.textContent = `$${Math.round(stats.avgEarnings)}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gráficos
    initCharts();
    
    // Cargar datos iniciales
    loadMonthData();
    
    // Navegación entre meses
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
        }
        loadMonthData();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
        loadMonthData();
    });
    
    // Formulario para añadir recorrido
    tripForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const date = document.getElementById('date').value;
        const trips = document.getElementById('trips').value;
        const earnings = document.getElementById('earnings').value;
        const meds = document.getElementById('meds').value;
        const crack = document.getElementById('crack').value;
        
        // Validar fecha
        if (!date) {
            alert('Por favor selecciona una fecha');
            return;
        }
        
        // Guardar datos
        DataManager.addTrip(date, {
            trips,
            earnings,
            meds,
            crack
        });
        
        // Resetear formulario
        tripForm.reset();
        
        // Recargar datos
        loadMonthData();
    });
    
    // Delegación de eventos para botones de eliminar
    dataBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const date = e.target.getAttribute('data-date');
            if (confirm('¿Estás seguro de eliminar este registro?')) {
                DataManager.deleteTrip(date);
                loadMonthData();
            }
        }
    });
});
