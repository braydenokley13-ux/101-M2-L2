/**
 * Visualization V2 - Chart.js implementation for revenue comparison
 *
 * V2 fix: Uses update-in-place instead of destroy/recreate on every slider change.
 * This eliminates flicker and provides smooth animated transitions.
 */

let revenueChart = null;

/**
 * Get market colors for a results array
 */
function getMarketColors(results, alpha) {
    return results.map(team => {
        switch(team.market) {
            case 'big': return `rgba(231, 76, 60, ${alpha})`;
            case 'mid': return `rgba(243, 156, 18, ${alpha})`;
            case 'small': return `rgba(0, 184, 148, ${alpha})`;
            default: return `rgba(116, 185, 255, ${alpha})`;
        }
    });
}

/**
 * Initialize or update the revenue chart (V2: update-in-place)
 */
function updateChart(results) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const labels = results.map(team => team.name);
    const baseRevenues = results.map(team => team.baseRevenue);
    const finalRevenues = results.map(team => team.finalRevenue);
    const bgColors = getMarketColors(results, 0.8);
    const borderColors = getMarketColors(results, 1);

    if (revenueChart) {
        // Update in place — no destroy/recreate, no flicker
        revenueChart.data.labels = labels;
        revenueChart.data.datasets[0].data = baseRevenues;
        revenueChart.data.datasets[1].data = finalRevenues;
        revenueChart.data.datasets[1].backgroundColor = bgColors;
        revenueChart.data.datasets[1].borderColor = borderColors;
        revenueChart.update('active');
        return;
    }

    // First-time creation
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
                    backgroundColor: bgColors,
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
                            size: 13,
                            weight: 'bold'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffeaa7',
                    bodyColor: '#dfe6e9',
                    borderColor: '#74b9ff',
                    borderWidth: 1,
                    padding: 14,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            const team = results[context[0].dataIndex];
                            return `${team.name} ${team.mood}`;
                        },
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
                                return [
                                    `Change: ${symbol}$${change}M`,
                                    `Satisfaction: ${team.satisfaction}%`,
                                    `Market: ${team.market.toUpperCase()}`
                                ];
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
                            size: 11,
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
                            size: 13,
                            weight: 'bold'
                        }
                    }
                }
            },
            animation: {
                duration: 400,
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
 * Destroy chart when switching levels (call before initializeLevel)
 */
function destroyChart() {
    if (revenueChart) {
        revenueChart.destroy();
        revenueChart = null;
    }
}
