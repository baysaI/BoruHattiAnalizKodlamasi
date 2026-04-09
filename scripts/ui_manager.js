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
      <div class="log-item log-${type} p-2 mb-2 rounded">
        <div class="d-flex w-100 justify-content-between">
          <small class="text-muted">${time}</small>
        </div>
        <p class="mb-0 small">${message}</p>
      </div>
    `;
    $('#log-list').prepend(logItem);
  },
  
  showWarningModal: function(reasons) {
    if (!$('#warningModal').hasClass('show')) {
      this.alertCounter++;
      $('#alert-counter').text(this.alertCounter);
      $('#system-status-dot').removeClass('healthy warning').addClass('danger');
      $('#system-status-text').text('KRİTİK UYARI - SIZINTI');
      
      const reasonsHtml = reasons.map(r => `<div class="reason-item pb-2 mb-2"><i class="fa-solid fa-caret-right text-warning me-2"></i> ${r}</div>`).join('');
      $('#warning-reasons').html(reasonsHtml);
      
      const modal = new bootstrap.Modal(document.getElementById('warningModal'));
      modal.show();
      this.logActivity('Yapay zeka sızıntı tespiti yaptı.', 'danger');
    }
  },
  
  resetWarning: function() {
    $('#system-status-dot').removeClass('danger warning').addClass('healthy');
    $('#system-status-text').text('Sistem Normal');
    this.logActivity('Tehlike durumu kullanıcı tarafından yoksayıldı veya giderildi.', 'success');
  },
  
  clearLogs: function() {
    $('#log-list').empty();
  }
};

$('#clear-log-btn').on('click', function() {
  UIManager.clearLogs();
});

$('#acknowledge-btn').on('click', function() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('warningModal'));
  modal.hide();
  Simulation.resetSystem();
  UIManager.resetWarning();
});
