function renderStatsCards(tasks) {
    const container = document.getElementById('statsContainer');
    if (!container) return;

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    container.innerHTML = `
        <div class="stat-card glass-effect">
            <div class="stat-icon total">
                <i class="fa-solid fa-layer-group"></i>
            </div>
            <div class="stat-info">
                <h3>Total Tugas</h3>
                <p>${total}</p>
            </div>
        </div>
        <div class="stat-card glass-effect">
            <div class="stat-icon completed">
                <i class="fa-solid fa-check-double"></i>
            </div>
            <div class="stat-info">
                <h3>Selesai</h3>
                <p>${completed}</p>
            </div>
        </div>
        <div class="stat-card glass-effect">
            <div class="stat-icon pending">
                <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div class="stat-info">
                <h3>Pending</h3>
                <p>${pending}</p>
            </div>
        </div>
        <div class="stat-card glass-effect">
            <div class="stat-icon progress">
                <i class="fa-solid fa-chart-line"></i>
            </div>
            <div class="stat-info">
                <h3>Progress</h3>
                <p>${progress}%</p>
            </div>
        </div>
    `;
}
