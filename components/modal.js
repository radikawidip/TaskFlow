function initModals() {
    const taskModal = document.getElementById('taskModal');
    const closeTaskModalBtn = document.getElementById('closeModalBtn');
    const cancelTaskModalBtn = document.getElementById('cancelModalBtn');

    const closeTaskModal = () => {
        taskModal.classList.remove('active');
        document.getElementById('taskForm').reset();
        document.getElementById('taskId').value = '';
    };

    if (closeTaskModalBtn) closeTaskModalBtn.addEventListener('click', closeTaskModal);
    if (cancelTaskModalBtn) cancelTaskModalBtn.addEventListener('click', closeTaskModal);

    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === taskModal) closeTaskModal();
        if (e.target === deleteModal) deleteModal.classList.remove('active');
    });
}
