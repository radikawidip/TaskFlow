function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const body = document.body;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }

    const navItems = [
        { icon: 'fa-house', label: 'Dashboard', target: 'dashboard' },
        { icon: 'fa-list-check', label: 'Tugas Saya', target: 'tasks' },
        { icon: 'fa-chart-pie', label: 'Statistik', target: 'stats' },
        { icon: 'fa-gear', label: 'Pengaturan', target: 'settings' },
    ];

    const navList = document.getElementById('sidebarNavList');
    if (navList) {
        navList.innerHTML = navItems.map((item, index) => `
            <li>
                <a href="#" class="nav-item ${index === 0 ? 'active' : ''}" data-target="${item.target}">
                    <i class="fa-solid ${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            </li>
        `).join('');
    }

    // Handle Navigation Switch
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const target = e.currentTarget.getAttribute('data-target');
            switchPage(target);

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });

    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }

    const toggleTheme = () => {
        const isLight = body.getAttribute('data-theme') === 'light';
        const newTheme = isLight ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Attach to settings theme button as well if it exists
    setTimeout(() => {
        const settingsThemeBtn = document.getElementById('settingsThemeBtn');
        if (settingsThemeBtn) {
            settingsThemeBtn.addEventListener('click', toggleTheme);
        }
    }, 100);

    function updateThemeIcon(theme) {
        // Update sidebar button
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            const text = themeToggleBtn.querySelector('span');
            if (theme === 'light') {
                icon.className = 'fa-solid fa-moon';
                text.textContent = 'Dark Mode';
            } else {
                icon.className = 'fa-solid fa-sun';
                text.textContent = 'Light Mode';
            }
        }
        // Update settings button
        const settingsThemeBtn = document.getElementById('settingsThemeBtn');
        if (settingsThemeBtn) {
            const icon = settingsThemeBtn.querySelector('i');
            if (theme === 'light') {
                icon.className = 'fa-solid fa-moon';
                settingsThemeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Mode Gelap';
            } else {
                icon.className = 'fa-solid fa-sun';
                settingsThemeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Mode Terang';
            }
        }
    }
}

function switchPage(page) {
    const statsSection = document.getElementById('statsContainer');
    const tasksSection = document.querySelector('.task-section');
    const settingsSection = document.getElementById('settingsSection');
    const headerTitle = document.getElementById('pageTitle');

    // Reset display
    if (statsSection) statsSection.style.display = 'none';
    if (tasksSection) tasksSection.style.display = 'none';
    if (settingsSection) settingsSection.style.display = 'none';

    switch (page) {
        case 'dashboard':
            if (headerTitle) headerTitle.textContent = 'Dashboard';
            if (statsSection) statsSection.style.display = 'grid';
            if (tasksSection) tasksSection.style.display = 'block';
            break;
        case 'tasks':
            if (headerTitle) headerTitle.textContent = 'Tugas Saya';
            if (tasksSection) tasksSection.style.display = 'block';
            break;
        case 'stats':
            if (headerTitle) headerTitle.textContent = 'Statistik';
            if (statsSection) statsSection.style.display = 'grid';
            break;
        case 'settings':
            if (headerTitle) headerTitle.textContent = 'Pengaturan';
            if (settingsSection) settingsSection.style.display = 'block';
            break;
    }
}
