const ChartManager = {
  mainChart: null,
  maxPoints: 30,

  init: function() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    Chart.defaults.color = '#888';
    Chart.defaults.font.family = 'Inter';

    this.mainChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Toprak Nemi (%)',
            data: [],
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Basınç (bar)',
            data: [],
            borderColor: '#0dcaf0',
            backgroundColor: 'rgba(13, 202, 240, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            yAxisID: 'y1'
          },
          {
            label: 'Sıcaklık (°C)',
            data: [],
            borderColor: '#ffc107',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            yAxisID: 'y2'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          x: {
            grid: { color: '#333' }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            min: 0,
            max: 100,
            grid: { color: '#333' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            min: 0,
            max: 10,
            grid: { drawOnChartArea: false }
          },
          y2: {
            type: 'linear',
            display: false,
            min: -10,
            max: 50
          }
        }
      }
    });
  },

  updateData: function(timeStr, moisture, pressure, temperature) {
    if (!this.mainChart) return;
    
    const chartData = this.mainChart.data;
    
    chartData.labels.push(timeStr);
    chartData.datasets[0].data.push(moisture);
    chartData.datasets[1].data.push(pressure);
    chartData.datasets[2].data.push(temperature);
    
    if (chartData.labels.length > this.maxPoints) {
      chartData.labels.shift();
      chartData.datasets[0].data.shift();
      chartData.datasets[1].data.shift();
      chartData.datasets[2].data.shift();
    }
    
    this.mainChart.update('none');
  }
};
