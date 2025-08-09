document.addEventListener('DOMContentLoaded', () => {
    const { getWorkouts, deleteWorkout } = window.Storage;
    const { createHistoryItem, createEmptyState } = window.AppUI;

    const historyContainer = document.getElementById('history-container');

    const renderHistory = () => {
        const workouts = getWorkouts();
        
        if (workouts.length === 0) {
            historyContainer.innerHTML = createEmptyState(
                'You haven\'t logged any workouts yet.',
                'Log Your First Workout',
                '/log.html'
            );
            return;
        }

        historyContainer.innerHTML = workouts.map(createHistoryItem).join('');
    };

    historyContainer.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            const workoutId = btn.dataset.id;
            if (confirm('Are you sure you want to delete this workout?')) {
                deleteWorkout(workoutId);
                renderHistory(); // Re-render the list
            }
        }
    });

    renderHistory();
});
