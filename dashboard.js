document.addEventListener('DOMContentLoaded', () => {
    const { getWorkouts } = window.Storage;
    const { createRecentWorkoutItem, createEmptyState } = window.AppUI;

    const workoutsThisWeekEl = document.getElementById('workouts-this-week');
    const volumeThisWeekEl = document.getElementById('volume-this-week');
    const totalWorkoutsEl = document.getElementById('total-workouts');
    const recentWorkoutsContainer = document.getElementById('recent-workouts-container');

    const renderDashboard = () => {
        const workouts = getWorkouts();

        // Calculate stats
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const workoutsThisWeek = workouts.filter(w => new Date(w.date) >= oneWeekAgo);
        const volumeThisWeek = workoutsThisWeek
            .filter(w => w.type === 'strength')
            .reduce((sum, w) => sum + w.totalVolume, 0);

        workoutsThisWeekEl.textContent = workoutsThisWeek.length;
        volumeThisWeekEl.textContent = `${volumeThisWeek.toFixed(0)} kg`;
        totalWorkoutsEl.textContent = workouts.length;

        // Render recent workouts
        if (workouts.length > 0) {
            const recentWorkouts = workouts.slice(0, 5);
            recentWorkoutsContainer.innerHTML = recentWorkouts.map(createRecentWorkoutItem).join('');
        } else {
            recentWorkoutsContainer.innerHTML = createEmptyState(
                'You have no recent activity.',
                'Log Your First Workout',
                '/log.html'
            );
        }
    };

    renderDashboard();
});
