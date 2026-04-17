$(document).ready(function() {
  if (typeof ChartManager !== 'undefined' && $('#mainChart').length) {
    ChartManager.init();
  }
  Simulation.start();

  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  $('.nav-item').removeClass('active');
  if (page === 'sensors.html') $('#nav-sensors').addClass('active');
  else if (page === 'alerts.html') $('#nav-alerts').addClass('active');
  else if (page === 'settings.html') $('#nav-settings').addClass('active');
  else $('#nav-dashboard').addClass('active');

  $('#min-pressure-threshold').on('input', function() {
    $('#pressure-threshold-display').text($(this).val());
  });

  $('#max-moisture-threshold').on('input', function() {
    $('#moisture-threshold-display').text($(this).val());
  });

  $('#save-settings-btn').on('click', function() {
    const originalText = $(this).html();
    $(this).html('<i class="fa-solid fa-spinner fa-spin me-2"></i>Kaydediliyor...');
    setTimeout(() => {
      $(this).html('<i class="fa-solid fa-check me-2"></i>Kaydedildi');
      if (typeof UIManager !== 'undefined') {
        UIManager.logActivity('Sistem ayarları güncellendi.', 'info');
      }
      setTimeout(() => { $(this).html(originalText); }, 2000);
    }, 1000);
  });
});
