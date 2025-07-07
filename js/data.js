// Funciones para manejar los datos con localStorage

const DataManager = {
    // Guardar datos en localStorage
    saveData: function(data) {
        localStorage.setItem('truckLoggerData', JSON.stringify(data));
    },
    
    // Cargar datos desde localStorage
    loadData: function() {
        const data = localStorage.getItem('truckLoggerData');
        return data ? JSON.parse(data) : {
            trips: {}  // Objeto donde las claves serán fechas (YYYY-MM-DD)
        };
    },
    
    // Añadir un nuevo registro
    addTrip: function(date, tripData) {
        const data = this.loadData();
        data.trips[date] = tripData;
        this.saveData(data);
    },
    
    // Eliminar un registro
    deleteTrip: function(date) {
        const data = this.loadData();
        if (data.trips[date]) {
            delete data.trips[date];
            this.saveData(data);
            return true;
        }
        return false;
    },
    
    // Obtener registros por mes
    getTripsByMonth: function(year, month) {
        const data = this.loadData();
        const monthPrefix = `${year}-${month.toString().padStart(2, '0')}`;
        
        const monthData = {};
        for (const date in data.trips) {
            if (date.startsWith(monthPrefix)) {
                monthData[date] = data.trips[date];
            }
        }
        
        return monthData;
    },
    
    // Calcular estadísticas para un mes específico
    calculateMonthStats: function(year, month) {
        const monthData = this.getTripsByMonth(year, month);
        const days = Object.keys(monthData).length;
        
        let totalTrips = 0;
        let totalEarnings = 0;
        let totalMeds = 0;
        let totalCrack = 0;
        
        for (const date in monthData) {
            const trip = monthData[date];
            totalTrips += parseInt(trip.trips) || 0;
            totalEarnings += parseInt(trip.earnings) || 0;
            totalMeds += parseInt(trip.meds) || 0;
            totalCrack += parseInt(trip.crack) || 0;
        }
        
        const avgEarnings = days > 0 ? totalEarnings / days : 0;
        
        return {
            totalTrips,
            totalEarnings,
            avgEarnings,
            totalMeds,
            totalCrack,
            days
        };
    }
};
