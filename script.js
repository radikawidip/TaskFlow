let tasks = [];
let taskToDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initModals();
    
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('id-ID', dateOpts);

    loadData();
    setupEventListeners();
});

function loadData() {
    document.getElementById('loadingSkeleton').style.display = 'flex';
    document.getElementById('taskList').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';

    // Firebase Real-time Listener
    db.collection('tasks').onSnapshot((snapshot) => {
        const newTasks = [];
        snapshot.forEach((doc) => {
            newTasks.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        tasks = newTasks;
        
        // Inject mock data if DB is completely empty and hasn't been injected before
        if (tasks.length === 0 && !localStorage.getItem('mock_injected')) {
            initialTasks.forEach(task => {
                db.collection('tasks').add({
                    title: task.title,
                    category: task.category,
                    completed: task.completed,
                    createdAt: task.createdAt
                });
            });
            localStorage.setItem('mock_injected', 'true');
        }

        renderApp();
        document.getElementById('loadingSkeleton').style.display = 'none';
    }, (error) => {
        console.error("Error fetching tasks: ", error);
        showToast('Gagal memuat data dari Firebase', 'error');
        document.getElementById('loadingSkeleton').style.display = 'none';
    });
}

function renderApp() {
    renderStatsCards(tasks);
    renderTaskList();
}

function renderTaskList() {
    const listContainer = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const filterValue = document.getElementById('filterSelect').value;
    const searchValue = document.getElementById('searchInput').value.toLowerCase();

    let filteredTasks = tasks.filter(task => {
        const matchSearch = task.title.toLowerCase().includes(searchValue);
        if (filterValue === 'completed') return task.completed && matchSearch;
        if (filterValue === 'pending') return !task.completed && matchSearch;
        return matchSearch;
    });

    filteredTasks.sort((a, b) => {
        if (a.completed === b.completed) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.completed ? 1 : -1;
    });

    listContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
        listContainer.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
        listContainer.style.display = 'flex';
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item glass-effect ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-item-left">
                    <div class="task-checkbox" data-id="${task.id}">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div class="task-content">
                        <h4>${task.title}</h4>
                        <div class="task-meta">
                            <span class="badge ${task.category.toLowerCase()}">${task.category}</span>
                            ${task.completed ? '<span class="badge completed">Selesai</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="task-actions-btns">
                    <button class="icon-btn edit-btn" data-id="${task.id}" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="icon-btn delete delete-btn" data-id="${task.id}" title="Hapus">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            listContainer.appendChild(li);
        });
    }

    attachTaskEvents();
}

function attachTaskEvents() {
    document.querySelectorAll('.task-checkbox').forEach(box => {
        box.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            toggleTaskStatus(id);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openEditModal(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openDeleteModal(id);
        });
    });
}

function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        // Optimistic UI update could be placed here, but onSnapshot handles it quickly anyway.
        db.collection('tasks').doc(id).update({
            completed: !task.completed
        }).then(() => {
            showToast(!task.completed ? 'Tugas diselesaikan!' : 'Tugas dikembalikan ke pending', 'info');
        }).catch(err => {
            console.error(err);
            showToast('Gagal update status tugas', 'error');
        });
    }
}

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskCategory').value = task.category;
        
        document.getElementById('modalTitle').textContent = 'Edit Tugas';
        document.getElementById('taskModal').classList.add('active');
    }
}

function openDeleteModal(id) {
    taskToDeleteId = id;
    document.getElementById('deleteModal').classList.add('active');
}

function setupEventListeners() {
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Tambah Tugas Baru';
        document.getElementById('taskForm').reset();
        document.getElementById('taskId').value = '';
        document.getElementById('taskModal').classList.add('active');
    });

    document.getElementById('taskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('taskId').value;
        const title = document.getElementById('taskTitle').value.trim();
        const category = document.getElementById('taskCategory').value;

        if (!title) return;

        if (id) {
            db.collection('tasks').doc(id).update({
                title: title,
                category: category
            }).then(() => {
                showToast('Tugas berhasil diperbarui!');
                document.getElementById('taskModal').classList.remove('active');
            }).catch(err => {
                console.error(err);
                showToast('Gagal memperbarui tugas', 'error');
            });
        } else {
            db.collection('tasks').add({
                title: title,
                category: category,
                completed: false,
                createdAt: new Date().toISOString()
            }).then(() => {
                showToast('Tugas baru berhasil ditambahkan!');
                document.getElementById('taskModal').classList.remove('active');
            }).catch(err => {
                console.error(err);
                showToast('Gagal menambahkan tugas', 'error');
            });
        }
    });

    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        if (taskToDeleteId) {
            db.collection('tasks').doc(taskToDeleteId).delete().then(() => {
                showToast('Tugas berhasil dihapus!', 'success');
                document.getElementById('deleteModal').classList.remove('active');
                taskToDeleteId = null;
            }).catch(err => {
                console.error(err);
                showToast('Gagal menghapus tugas', 'error');
            });
        }
    });

    document.getElementById('filterSelect').addEventListener('change', renderTaskList);
    document.getElementById('searchInput').addEventListener('input', renderTaskList);

    // Setup Settings Actions
    setTimeout(() => {
        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                if (confirm('Anda yakin ingin menghapus SEMUA tugas dari Firebase? Tindakan ini tidak dapat dibatalkan.')) {
                    tasks.forEach(task => {
                        db.collection('tasks').doc(task.id).delete();
                    });
                    localStorage.removeItem('mock_injected');
                    showToast('Memproses hapus semua data...', 'info');
                }
            });
        }
    }, 100);
}
