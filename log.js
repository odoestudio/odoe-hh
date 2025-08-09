document.addEventListener('DOMContentLoaded', () => {
    const { saveWorkout } = window.Storage;

    const form = document.getElementById('log-form');
    const workoutTypeSelect = document.getElementById('workout-type');
    const strengthFields = document.getElementById('strength-fields');
    const cardioFields = document.getElementById('cardio-fields');
    const setsContainer = document.getElementById('sets-container');
    const addSetBtn = document.getElementById('add-set-btn');
    const dateInput = document.getElementById('date');

    // Set default date to today
    dateInput.valueAsDate = new Date();

    const toggleWorkoutTypeFields = () => {
        if (workoutTypeSelect.value === 'strength') {
            strengthFields.style.display = 'block';
            cardioFields.style.display = 'none';
            if (setsContainer.children.length === 0) {
                addSet();
            }
        } else {
            strengthFields.style.display = 'none';
            cardioFields.style.display = 'block';
        }
    };

    const addSet = () => {
        const setNumber = setsContainer.children.length + 1;
        const setEl = document.createElement('div');
        setEl.classList.add('flex', 'items-center', 'space-x-2');
        setEl.innerHTML = `
            <span class="font-semibold text-medium-text w-10">Set ${setNumber}</span>
            <input type="number" placeholder="Weight (kg)" class="set-weight w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary" required>
            <span class="text-medium-text">x</span>
            <input type="number" placeholder="Reps" class="set-reps w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary" required>
            <button type="button" class="remove-set-btn text-medium-text hover:text-red-500"><i class="fas fa-times"></i></button>
        `;
        setsContainer.appendChild(setEl);

        setEl.querySelector('.remove-set-btn').addEventListener('click', () => {
            setEl.remove();
            // Re-number sets
            Array.from(setsContainer.children).forEach((child, index) => {
                child.querySelector('span').textContent = `Set ${index + 1}`;
            });
        });
    };

    workoutTypeSelect.addEventListener('change', toggleWorkoutTypeFields);
    addSetBtn.addEventListener('click', addSet);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const workout = {
            id: Date.now().toString(),
            name: formData.get('workout-name'),
            type: formData.get('workout-type'),
            date: formData.get('date'),
            notes: formData.get('notes'),
        };

        if (workout.type === 'strength') {
            workout.sets = [];
            workout.totalVolume = 0;
            const setElements = setsContainer.querySelectorAll('.flex');
            setElements.forEach(setEl => {
                const weight = parseFloat(setEl.querySelector('.set-weight').value) || 0;
                const reps = parseInt(setEl.querySelector('.set-reps').value) || 0;
                if (weight > 0 && reps > 0) {
                    workout.sets.push({ weight, reps });
                    workout.totalVolume += weight * reps;
                }
            });
        } else {
            workout.distance = parseFloat(formData.get('distance')) || 0;
            workout.duration = parseInt(formData.get('duration')) || 0;
        }

        saveWorkout(workout);
        alert('Workout saved successfully!');
        window.location.href = '/history.html';
    });

    // Initial setup
    toggleWorkoutTypeFields();
});
