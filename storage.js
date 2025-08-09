const Storage = (() => {
    const WORKOUTS_KEY = 'fitTrack.workouts';

    const getWorkouts = () => {
        const workouts = localStorage.getItem(WORKOUTS_KEY);
        return workouts ? JSON.parse(workouts) : [];
    };

    const saveWorkout = (workout) => {
        const workouts = getWorkouts();
        workouts.push(workout);
        // Sort by date descending
        workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
        localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    };

    const deleteWorkout = (id) => {
        let workouts = getWorkouts();
        workouts = workouts.filter(w => w.id !== id);
        localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    };
    
    const getWorkoutById = (id) => {
        const workouts = getWorkouts();
        return workouts.find(w => w.id === id);
    };

    return {
        getWorkouts,
        saveWorkout,
        deleteWorkout,
        getWorkoutById
    };
})();

window.Storage = Storage;
