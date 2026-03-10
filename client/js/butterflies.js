document.addEventListener('DOMContentLoaded', () => {
    // Check if background container exists
    let bg = document.querySelector('.butterfly-bg');
    if (!bg) {
        bg = document.createElement('div');
        bg.className = 'butterfly-bg';
        document.body.appendChild(bg); // Append at the end, css handles z-index
    }

    const numButterflies = 18;

    for (let i = 0; i < numButterflies; i++) {
        createButterfly(bg);
    }

    function createButterfly(container) {
        let butterfly = document.createElement('div');
        butterfly.className = 'butterfly';

        // Random properties
        const size = Math.random() * 20 + 15; // 15px to 35px
        const left = Math.random() * 100; // 0 to 100vw
        const duration = Math.random() * 5 + 6; // 6s to 11s
        const delay = Math.random() * 10; // 0s to 10s

        // Apply random properties
        butterfly.style.width = `${size}px`;
        butterfly.style.height = `${size}px`;
        butterfly.style.left = `${left}vw`;
        butterfly.style.animationDuration = `0.25s, ${duration}s`;

        // Wait random delay before adding
        setTimeout(() => {
            container.appendChild(butterfly);
        }, delay * 1000);

        // Recreate butterfly after animation ends to keep it infinite
        setInterval(() => {
            butterfly.remove();
            let newObj = document.createElement('div');
            newObj.className = 'butterfly';
            newObj.style.width = `${size}px`;
            newObj.style.height = `${size}px`;
            newObj.style.left = `${Math.random() * 100}vw`;
            newObj.style.animationDuration = `0.25s, ${Math.random() * 5 + 6}s`;
            container.appendChild(newObj);

            // Re-assign pointer to newObj
            butterfly = newObj;
        }, (duration + delay) * 1000);
    }
});
