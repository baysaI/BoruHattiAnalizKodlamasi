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

  $('#sidebar-toggle').on('click', function() {
    $('body').toggleClass('sidebar-open');
  });

  $('.sidebar-overlay').on('click', function() {
    $('body').removeClass('sidebar-open');
  });

  $('#sidebar a').on('click', function() {
    if ($(window).width() < 992) {
      $('body').removeClass('sidebar-open');
    }
  });

  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function(event) {
      const audioChecked = $('#audio-alerts').is(':checked');
      const emailChecked = $('#email-notifications').is(':checked');
      const smsChecked = $('#sms-notifications').is(':checked');
      const notificationsValid = audioChecked || emailChecked || smsChecked;
      const feedback = $('#notification-validation');

      if (!notificationsValid) {
        feedback.removeClass('d-none');
      } else {
        feedback.addClass('d-none');
      }

      if (!settingsForm.checkValidity() || !notificationsValid) {
        event.preventDefault();
        event.stopPropagation();
        settingsForm.classList.add('was-validated');
        return;
      }

      event.preventDefault();
      const button = $('#save-settings-btn');
      const originalText = button.html();
      button.html('<i class="fa-solid fa-spinner fa-spin me-2"></i>Kaydediliyor...');
      setTimeout(() => {
        button.html('<i class="fa-solid fa-check me-2"></i>Kaydedildi');
        if (typeof UIManager !== 'undefined') {
          UIManager.logActivity('Sistem ayarları güncellendi.', 'info');
        }
        setTimeout(() => { button.html(originalText); }, 2000);
      }, 1000);
    });

    $('#audio-alerts, #email-notifications, #sms-notifications').on('change', function() {
      if ($('#audio-alerts').is(':checked') || $('#email-notifications').is(':checked') || $('#sms-notifications').is(':checked')) {
        $('#notification-validation').addClass('d-none');
        settingsForm.classList.remove('was-validated');
      }
    });
  }
});
