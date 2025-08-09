document.addEventListener('DOMContentLoaded', () => {
    const { getWorkouts } = window.Storage;
    const { createEmptyState } = window.AppUI;

    const progressContainer = document.getElementById('progress-container');
    let volumeChart, frequencyChart, exerciseChart;

    const renderCharts = () => {
        const workouts = getWorkouts().sort((a, b) => new Date(a.date) - new Date(b.date));

        if (workouts.length === 0) {
            progressContainer.innerHTML = createEmptyState(
                'Log some workouts to see your progress here.',
                'Log a Workout',
                '/log.html'
            );
            return;
        }

        // Chart.js global settings
        Chart.defaults.color = '#9ca3af'; // medium-text
        Chart.defaults.borderColor = '#374151'; // dark-border

        renderVolumeChart(workouts);
        renderFrequencyChart(workouts);
        renderExerciseSelector(workouts);
    };

    const getChartOptions = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#374151' },
                ticks: { color: '#9ca3af' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
            }
        }
    });

    const renderVolumeChart = (workouts) => {
        const strengthWorkouts = workouts.filter(w => w.type === 'strength');
        const data = {
            labels: strengthWorkouts.map(w => new Date(w.date).toLocaleDateString('en-CA')), // YYYY-MM-DD
            datasets: [{
                label: 'Total Volume (kg)',
                data: strengthWorkouts.map(w => w.totalVolume),
                borderColor: '#22d3ee', // cyan-400
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                fill: true,
                tension: 0.3
            }]
        };
        const ctx = document.getElementById('volume-chart').getContext('2d');
        if(volumeChart) volumeChart.destroy();
        volumeChart = new Chart(ctx, { type: 'line', data, options: getChartOptions('Total Volume') });
    };

    const renderFrequencyChart = (workouts) => {
        const frequency = {};
        workouts.forEach(w => {
            const week = getWeekNumber(new Date(w.date));
            const year = new Date(w.date).getFullYear();
            const key = `${year}-W${week}`;
            frequency[key] = (frequency[key] || 0) + 1;
        });

        const sortedWeeks = Object.keys(frequency).sort();
        const data = {
            labels: sortedWeeks,
            datasets: [{
                label: 'Workouts per Week',
                data: sortedWeeks.map(week => frequency[week]),
                backgroundColor: '#a78bfa', // violet-400
                borderRadius: 4
            }]
        };
        const ctx = document.getElementById('frequency-chart').getContext('2d');
        if(frequencyChart) frequencyChart.destroy();
        frequencyChart = new Chart(ctx, { type: 'bar', data, options: getChartOptions('Workout Frequency') });
    };
    
    const renderExerciseSelector = (workouts) => {
        const exerciseSelect = document.getElementById('exercise-select');
        const strengthExercises = [...new Set(workouts.filter(w => w.type === 'strength').map(w => w.name.trim().toLowerCase()))];
        
        exerciseSelect.innerHTML = '<option value="">Select an exercise...</option>';
        strengthExercises.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            exerciseSelect.appendChild(option);
        });

        exerciseSelect.addEventListener('change', (e) => {
            renderExerciseChart(workouts, e.target.value);
        });
        
        // Initially render with the first exercise if available
        if (strengthExercises.length > 0) {
            exerciseSelect.value = strengthExercises[0];
            renderExerciseChart(workouts, strengthExercises[0]);
        } else {
             renderExerciseChart(workouts, null); // Render empty chart
        }
    };

    const renderExerciseChart = (workouts, exerciseName) => {
        let filteredData = [];
        if (exerciseName) {
             filteredData = workouts
                .filter(w => w.type === 'strength' && w.name.trim().toLowerCase() === exerciseName)
                .map(w => ({
                    date: new Date(w.date).toLocaleDateString('en-CA'),
                    maxWeight: Math.max(...w.sets.map(s => s.weight))
                }));
        }
        
        const data = {
            labels: filteredData.map(d => d.date),
            datasets: [{
                label: 'Max Weight (kg)',
                data: filteredData.map(d => d.maxWeight),
                borderColor: '#4ade80', // green-400
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                fill: true,
                tension: 0.3
            }]
        };
        const ctx = document.getElementById('exercise-chart').getContext('2d');
        if(exerciseChart) exerciseChart.destroy();
        exerciseChart = new Chart(ctx, { type: 'line', data, options: getChartOptions(`Max Weight for ${exerciseName}`) });
    };

    // Helper to get week number
    const getWeekNumber = (d) => {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };

    renderCharts();
});
