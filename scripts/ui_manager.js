const UIManager = {
  alertCounter: 0,

  updateDashboard: function(data, trends) {
    $('#moisture-val').text(data.moisture.toFixed(1));
    $('#pressure-val').text(data.pressure.toFixed(2));
    $('#temp-val').text(data.temperature.toFixed(1));

    this.updateTrendIcon('moisture-trend', trends.moisture, true);
    this.updateTrendIcon('pressure-trend', trends.pressure, false);
    this.updateTrendIcon('temp-trend', trends.temperature, null);
  },

  updateTrendIcon: function(elementId, trend, isHigherWorse) {
    const el = $('#' + elementId);
    el.removeClass('fa-arrow-up fa-arrow-down fa-minus text-danger text-success text-secondary d-none');

    if (trend > 0) {
      el.addClass('fa-arrow-up').addClass(isHigherWorse === true ? 'text-danger' : 'text-success');
    } else if (trend < 0) {
      el.addClass('fa-arrow-down').addClass(isHigherWorse === false ? 'text-danger' : 'text-success');
    } else {
      el.addClass('fa-minus text-secondary');
    }
  },

  logActivity: function(message, type) {
    const time = new Date().toLocaleTimeString('tr-TR');
    const logItem = `
      <div class="log-item log-${type} p-2 mb-2 rounded border-start border-3 border-${type === 'warning' ? 'warning' : type === 'danger' ? 'danger' : type === 'success' ? 'success' : 'info'}">
        <div class="d-flex w-100 justify-content-between">
          <small class="text-muted">${time}</small>
        </div>
        <p class="mb-0 small">${message}</p>
      </div>
    `;
    $('#log-list').prepend(logItem);

    if ($('#alerts-table-body').length) {

      if ($('#alerts-table-body td[colspan="4"]').length) {
        $('#alerts-table-body').empty();
      }

      const badgeClass = type === 'warning' ? 'bg-warning text-dark' : type === 'danger' ? 'bg-danger' : type === 'success' ? 'bg-success' : 'bg-info text-dark';
      const typeLabel = type.toUpperCase();

      const tr = `
        <tr>
          <td>${time}</td>
          <td><span class="badge ${badgeClass}">${typeLabel}</span></td>
          <td>${message}</td>
          <td><span class="text-muted"><i class="fa-solid fa-check"></i> Kaydedildi</span></td>
        </tr>
      `;
      $('#alerts-table-body').prepend(tr);
    }
  },

  showWarningModal: function(reasons) {
    if (!$('#warningModal').hasClass('show')) {
      this.alertCounter++;
      $('#alert-counter-badge').text(this.alertCounter);
      $('#system-status-dot').removeClass('healthy warning').addClass('danger');
      $('#system-status-text').text('KRİTİK UYARI - SIZINTI');

      const reasonsHtml = reasons.map(r => `<div class="reason-item pb-2 mb-2"><i class="fa-solid fa-caret-right text-warning me-2"></i> ${r}</div>`).join('');
      $('#warning-reasons').html(reasonsHtml);

      const modal = new bootstrap.Modal(document.getElementById('warningModal'));
      modal.show();
      this.logActivity('Yapay zeka kritik sızıntı tespiti yaptı.', 'danger');
    }
  },

  resetWarning: function() {
    $('#system-status-dot').removeClass('danger warning').addClass('healthy');
    $('#system-status-text').text('Sistem Normal');
    this.logActivity('Tehlike durumu giderildi.', 'success');
  },

  clearLogs: function() {
    $('#log-list').empty();
  },

  clearAlerts: function() {
    $('#alerts-table-body').html('<tr><td colspan="4" class="text-center text-muted py-4">Henüz kritik bir uyarı kaydedilmedi.</td></tr>');
    this.alertCounter = 0;
    $('#alert-counter-badge').text(this.alertCounter);
  }
};

$('#clear-log-btn').on('click', function() {
  UIManager.clearLogs();
});

$('#clear-all-alerts-btn').on('click', function() {
  UIManager.clearAlerts();
});

$('#acknowledge-btn').on('click', function() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('warningModal'));
  modal.hide();
  Simulation.resetSystem();
  UIManager.resetWarning();
});
