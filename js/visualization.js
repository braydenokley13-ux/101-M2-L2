/**
 * Visualization - Chart.js implementation for revenue comparison
 */

let revenueChart = null;

/**
 * Initialize or update the revenue chart
 */
function updateChart(results) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    // Prepare data
    const labels = results.map(team => team.name);
    const baseRevenues = results.map(team => team.baseRevenue);
    const finalRevenues = results.map(team => team.finalRevenue);

    // Colors based on market size
    const backgroundColors = results.map(team => {
        switch(team.market) {
            case 'big': return 'rgba(231, 76, 60, 0.8)';
            case 'mid': return 'rgba(243, 156, 18, 0.8)';
            case 'small': return 'rgba(0, 184, 148, 0.8)';
            default: return 'rgba(116, 185, 255, 0.8)';
        }
    });

    const borderColors = results.map(team => {
        switch(team.market) {
            case 'big': return 'rgba(231, 76, 60, 1)';
            case 'mid': return 'rgba(243, 156, 18, 1)';
            case 'small': return 'rgba(0, 184, 148, 1)';
            default: return 'rgba(116, 185, 255, 1)';
        }
    });

    // Destroy existing chart
    if (revenueChart) {
        revenueChart.destroy();
    }

    // Create new chart
    revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Original Revenue',
                    data: baseRevenues,
                    backgroundColor: 'rgba(99, 110, 114, 0.4)',
                    borderColor: 'rgba(99, 110, 114, 0.8)',
                    borderWidth: 2,
                    borderRadius: 5,
                },
                {
                    label: 'After Revenue Sharing',
                    data: finalRevenues,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    borderRadius: 5,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#dfe6e9',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffeaa7',
                    bodyColor: '#dfe6e9',
                    borderColor: '#74b9ff',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: $${value}M`;
                        },
                        afterLabel: function(context) {
                            if (context.datasetIndex === 1) {
                                const team = results[context.dataIndex];
                                const change = team.change;
                                const symbol = change >= 0 ? '+' : '';
                                return `Change: ${symbol}$${change}M`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#dfe6e9',
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: '#dfe6e9',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '$' + value + 'M';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Team Revenue (Millions)',
                        color: '#ffeaa7',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

/**
 * Animate chart update
 */
function animateChartUpdate() {
    if (revenueChart) {
        revenueChart.update('active');
    }
}
