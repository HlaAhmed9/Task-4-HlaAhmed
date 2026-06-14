document.addEventListener('DOMContentLoaded', () => {
    // Isolated Structural Initializations
    initSmoothNavigation();
    initReadingTrackerAndFavorites();
    initDarkThemeToggle();
    initBookFormValidator(); // Project 4 Entry Pipeline Call
});

/* --------------------------------------------------------------------------
   1. MODULE: SMOOTH NAVIGATION MANIPULATOR
   -------------------------------------------------------------------------- */
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a, .cta-button');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                event.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/* --------------------------------------------------------------------------
   2. MODULE: READING PROGRESS TRACKER & DATA CORES (Exposed Hook Engine)
   -------------------------------------------------------------------------- */
// Global reference array scope pointer to safely share registration functions across modules
let attachCardInteractionHandlers = null; 

function initReadingTrackerAndFavorites() {
    const bookCards = document.querySelectorAll('.book-card');
    const goalsCounter = document.getElementById('goals-counter');
    
    let booksReadCount = 0;

    const updateSidebarCounter = () => {
        goalsCounter.textContent = booksReadCount;
    };

    // DECOUPLED EXTENSION HOOK: Exposes an orchestration gateway to handle card attachments dynamically
    attachCardInteractionHandlers = (card, index = 4) => {
        const bookInfo = card.querySelector('.book-info');
        
        const readBtn = document.createElement('button');
        readBtn.className = 'read-toggle-btn';
        readBtn.style.marginTop = '12px';
        readBtn.style.padding = '8px 14px';
        readBtn.style.borderRadius = '6px';
        readBtn.style.border = '1px solid #6c5ce7';
        readBtn.style.backgroundColor = '#ffffff';
        readBtn.style.color = '#6c5ce7';
        readBtn.style.fontWeight = '600';
        readBtn.style.cursor = 'pointer';
        readBtn.innerHTML = '<i class="fa-solid fa-book-open"></i>Mark as Read';
        
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-toggle-btn';
        favoriteBtn.style.marginTop = '8px';
        favoriteBtn.style.padding = '8px 14px';
        favoriteBtn.style.borderRadius = '6px';
        favoriteBtn.style.border = '1px solid #ccc';
        favoriteBtn.style.backgroundColor = '#ffffff';
        favoriteBtn.style.color = '#333333';
        favoriteBtn.style.fontWeight = '600';
        favoriteBtn.style.cursor = 'pointer';
        favoriteBtn.innerHTML = '<i class="fa-regular fa-heart"></i>Favorite';

        bookInfo.appendChild(readBtn);
        bookInfo.appendChild(favoriteBtn);

        if (index < 2) {
            markBookAsRead(card, readBtn);
        }

        readBtn.addEventListener('click', () => {
            const isRead = card.classList.contains('is-read');
            if (!isRead) {
                markBookAsRead(card, readBtn);
            } else {
                unmarkBookAsRead(card, readBtn);
            }
        });

        favoriteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isFavorited = card.classList.contains('is-favorited');
            
            if (!isFavorited) {
                card.classList.add('is-favorited');
                card.style.backgroundColor = '#fef5f7';
                favoriteBtn.innerHTML = '<i class="fa-solid fa-heart" style="color: #e74c3c;"></i>Favorited!';
                favoriteBtn.style.borderColor = '#e74c3c';
                favoriteBtn.style.color = '#e74c3c';
            } else {
                card.classList.remove('is-favorited');
                card.style.backgroundColor = card.classList.contains('is-read') ? '#f0eeff' : '';
                favoriteBtn.innerHTML = '<i class="fa-regular fa-heart"></i>Favorite';
                favoriteBtn.style.borderColor = '#ccc';
                favoriteBtn.style.color = '#333333';
            }
        });
    };

    // Bind original 4 static layout container nodes on initialization
    bookCards.forEach((card, index) => {
        attachCardInteractionHandlers(card, index);
    });

    function markBookAsRead(card, button) {
        card.classList.add('is-read');
        card.style.borderTop = '4px solid #2ecc71';
        if (!card.classList.contains('is-favorited')) {
            card.style.backgroundColor = '#f0eeff';
        }
        button.innerHTML = '<i class="fa-solid fa-circle-check"></i>Read';
        button.style.backgroundColor = '#2ecc71';
        button.style.color = '#ffffff';
        button.style.borderColor = '#2ecc71';
        
        booksReadCount++;
        updateSidebarCounter();
    }

    function unmarkBookAsRead(card, button) {
        card.classList.remove('is-read');
        card.style.borderTop = 'none';
        if (!card.classList.contains('is-favorited')) {
            card.style.backgroundColor = '';
        }
        button.innerHTML = '<i class="fa-solid fa-book-open"></i>Mark as Read';
        button.style.backgroundColor = '#ffffff';
        button.style.color = '#6c5ce7';
        button.style.borderColor = '#6c5ce7';
        
        booksReadCount--;
        updateSidebarCounter();
    }
}

/* --------------------------------------------------------------------------
   3. MODULE: SYSTEM ENVIRONMENT THEME SWITCHER
   -------------------------------------------------------------------------- */
function initDarkThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.className = 'fa-solid fa-sun';
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeText.textContent = 'Dark Mode';
        }
    });
}

/* --------------------------------------------------------------------------
   4. MODULE: PROJECT 4 INPUT FORM FIELD VALIDATION MATRIX
   -------------------------------------------------------------------------- */
function initBookFormValidator() {
    const form = document.getElementById('add-book-form');
    const booksGrid = document.querySelector('.books-grid');
    const successBanner = document.getElementById('form-success-banner');

    // Select form input fields
    const titleInput = document.getElementById('book-title');
    const authorInput = document.getElementById('book-author');
    const synopsisInput = document.getElementById('book-synopsis');
    const genreSelect = document.getElementById('book-genre');

    form.addEventListener('submit', (event) => {
        // FAIL-SAFE ACTIVATED: Prevents browser refresh to stop state data loss
        event.preventDefault();

        // Run validation tracks and check overall compliance state
        let isFormValid = true;

        // 1. Title Field Inspection
        if (titleInput.value.trim() === '') {
            invalidateField('title-group');
            isFormValid = false;
        } else {
            validateField('title-group');
        }

        // 2. Author Field Inspection
        if (authorInput.value.trim() === '') {
            invalidateField('author-group');
            isFormValid = false;
        } else {
            validateField('author-group');
        }

        // 3. Synopsis Character Range Inspection (Must be at least 15 chars long)
        if (synopsisInput.value.trim().length < 15) {
            invalidateField('synopsis-group');
            isFormValid = false;
        } else {
            validateField('synopsis-group');
        }

        // 4. Genre Option Inspection
        if (genreSelect.value === '') {
            invalidateField('genre-group');
            isFormValid = false;
        } else {
            validateField('genre-group');
        }

        // --- PIPELINE OUTFLOW OUTCOME EVALUATION ---
        if (isFormValid) {
            // Create a brand new DOM book card node programmatically
            const newCard = document.createElement('article');
            newCard.className = 'book-card';
            
            // Set generic book cover artwork placeholder asset based on chosen genre
            const imageAsset = genreSelect.value === 'Science Fiction' ? 'Sources/PHM.avif' : 'Sources/Mistborn.avif';

            newCard.innerHTML = `
                <img src="${imageAsset}" alt="Dynamic Catalog Cover" class="book-cover">
                <div class="book-info">
                    <h3>${titleInput.value.trim()}</h3>
                    <p class="author">By ${authorInput.value.trim()}</p>
                    <p class="synopsis">${synopsisInput.value.trim()}</p>
                    <span class="tag genre-tag">${genreSelect.value}</span>
                </div>
            `;

            // Bridge to Project 3 module: Inject tracking buttons into this new card item safely
            if (attachCardInteractionHandlers) {
                attachCardInteractionHandlers(newCard, 4); // Index 4 treats it as an unread book on arrival
            }

            // Append the fully operational new card right into your active grid layout view
            booksGrid.appendChild(newCard);

            // Display success feedback message across banner element
            successBanner.style.display = 'flex';
            
            // Reset input field states smoothly
            form.reset();
            clearAllValidationClasses();

            // Clear success notification banner after 4 seconds automatically
            setTimeout(() => {
                successBanner.style.display = 'none';
            }, 4000);
        }
    });

    // Helper Actions: Mutation handlers for error indicator classes
    function invalidateField(groupId) {
        const group = document.getElementById(groupId);
        group.classList.add('error-active');
        group.classList.remove('success-active');
    }

    function validateField(groupId) {
        const group = document.getElementById(groupId);
        group.classList.add('success-active');
        group.classList.remove('error-active');
    }

    function clearAllValidationClasses() {
        const groups = document.querySelectorAll('.input-group');
        groups.forEach(group => {
            group.classList.remove('error-active', 'success-active');
        });
    }
}