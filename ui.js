const AppUI = (() => {
    const createDesktopNav = (links, currentPage) => {
        const linksHtml = links.map(link => {
            const isActive = link.href === currentPage;
            return `
                <a href="/${link.href}" class="flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brand-primary text-white' : 'text-medium-text hover:bg-dark-border hover:text-light-text'}">
                    <i class="fa-solid ${link.icon} fa-fw w-6"></i>
                    <span class="ml-3 font-semibold">${link.text}</span>
                </a>
            `;
        }).join('');

        return `
            <div class="flex flex-col space-y-2 h-full">
                <div class="flex items-center mb-6">
                     <i class="fa-solid fa-bolt text-brand-primary fa-2x"></i>
                     <h1 class="text-2xl font-bold ml-2 text-white">FitTrack</h1>
                </div>
                <nav class="flex-1">
                    ${linksHtml}
                </nav>
                 <div class="mt-auto">
                    <a href="/log.html" class="block w-full text-center bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:bg-brand-secondary transition-colors duration-200">
                        <i class="fas fa-plus mr-2"></i>New Workout
                    </a>
                </div>
            </div>
        `;
    };

    const createMobileNav = (links, currentPage) => {
        const linksHtml = links.map(link => {
            const isActive = link.href === currentPage;
            return `
                <a href="/${link.href}" class="flex flex-col items-center justify-center text-center w-full py-2 transition-colors ${isActive ? 'text-brand-primary' : 'text-medium-text hover:text-brand-primary'}">
                    <i class="fa-solid ${link.icon} fa-lg"></i>
                    <span class="text-xs mt-1 font-medium">${link.text}</span>
                </a>
            `;
        }).join('');

        return `<div class="flex justify-around items-center h-16">${linksHtml}</div>`;
    };

    const createRecentWorkoutItem = (workout) => {
        const { id, name, type, date, totalVolume, distance, duration } = workout;
        const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        let details = '';
        if (type === 'strength') {
            details = `<span class="font-semibold text-white">${totalVolume.toFixed(0)} kg</span> total volume`;
        } else {
            details = `<span class="font-semibold text-white">${distance} km</span> in ${duration} min`;
        }

        return `
            <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div class="flex items-center">
                    <div class="bg-dark-border p-3 rounded-full mr-4">
                        <i class="fa-solid ${type === 'strength' ? 'fa-dumbbell' : 'fa-person-running'} text-medium-text"></i>
                    </div>
                    <div>
                        <p class="font-bold text-white">${name}</p>
                        <p class="text-sm text-medium-text">${formattedDate}</p>
                    </div>
                </div>
                <p class="text-sm text-medium-text hidden sm:block">${details}</p>
            </div>
        `;
    };

    const createHistoryItem = (workout) => {
        const { id, name, type, date, sets, totalVolume, distance, duration, notes } = workout;
        const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let detailsHtml = '';
        let summaryHtml = '';

        if (type === 'strength') {
            summaryHtml = `<p class="text-medium-text"><strong class="text-white">${totalVolume.toFixed(0)} kg</strong> Total Volume</p>`;
            detailsHtml = sets.map((set, index) => `
                <li class="flex justify-between text-sm text-medium-text">
                    <span>Set ${index + 1}</span>
                    <span>${set.weight} kg x ${set.reps} reps</span>
                </li>
            `).join('');
        } else {
            summaryHtml = `<p class="text-medium-text"><strong class="text-white">${distance} km</strong> in <strong class="text-white">${duration} min</strong></p>`;
        }

        return `
            <div class="bg-dark-card rounded-lg shadow-lg overflow-hidden" data-id="${id}">
                <div class="p-5">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs text-brand-primary font-semibold uppercase">${type}</p>
                            <h3 class="text-xl font-bold text-white mt-1">${name}</h3>
                            <p class="text-sm text-medium-text mt-1">${formattedDate}</p>
                        </div>
                        <button class="delete-btn text-medium-text hover:text-red-500 transition-colors" data-id="${id}">
                            <i class="fas fa-trash fa-lg"></i>
                        </button>
                    </div>
                    <div class="mt-4">
                        ${summaryHtml}
                    </div>
                    ${detailsHtml ? `
                    <div class="mt-4 pt-4 border-t border-dark-border">
                        <h4 class="text-sm font-semibold text-light-text mb-2">Details</h4>
                        <ul class="space-y-1">
                           ${detailsHtml}
                        </ul>
                    </div>` : ''}
                    ${notes ? `
                    <div class="mt-4 pt-4 border-t border-dark-border">
                         <h4 class="text-sm font-semibold text-light-text mb-2">Notes</h4>
                         <p class="text-sm text-medium-text italic">${notes}</p>
                    </div>` : ''}
                </div>
            </div>
        `;
    };
    
    const createEmptyState = (message, buttonText, buttonHref) => {
        return `
            <div class="text-center py-16 px-6 bg-dark-card rounded-lg">
                <i class="fas fa-folder-open fa-3x text-medium-text"></i>
                <h3 class="mt-4 text-xl font-semibold text-white">No Data Yet</h3>
                <p class="mt-1 text-medium-text">${message}</p>
                <a href="${buttonHref}" class="mt-6 inline-block bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-secondary transition-colors">
                    ${buttonText}
                </a>
            </div>
        `;
    };

    return {
        createDesktopNav,
        createMobileNav,
        createRecentWorkoutItem,
        createHistoryItem,
        createEmptyState
    };
})();

window.AppUI = AppUI;
