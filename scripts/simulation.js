const Simulation = {
  intervalId: null,
  tickRate: 2000,
  leakTriggered: false,
  tickCount: 0,
  
  data: {
    moisture: 45.0,
    pressure: 5.2,
    temperature: 22.0
  },
  
  trends: {
    moisture: 0,
    pressure: 0,
    temperature: 0
  },

  start: function() {
    UIManager.logActivity('Sistem başlatıldı. Sensör verileri bekleniyor...', 'info');
    this.intervalId = setInterval(() => this.tick(), this.tickRate);
  },

  stop: function() {
    if (this.intervalId) clearInterval(this.intervalId);
  },

  resetSystem: function() {
    this.leakTriggered = false;
    this.tickCount = 0;
    this.data.pressure = 5.2;
    this.data.moisture = 45.0;
  },

  tick: function() {
    this.tickCount++;
    const prevMoisture = this.data.moisture;
    const prevPressure = this.data.pressure;
    const prevTemp = this.data.temperature;

    if (!this.leakTriggered && this.tickCount > 10) {
      if (Math.random() > 0.7) {
        this.leakTriggered = true;
        UIManager.logActivity('Boru hattında anormal dalgalanma tespit edildi.', 'warning');
      }
    }

    if (this.leakTriggered) {
      this.data.pressure -= (0.1 + Math.random() * 0.2);
      this.data.moisture += (2.0 + Math.random() * 4.0);
      this.data.temperature += (Math.random() * 0.2 - 0.1);
    } else {
      this.data.pressure += (Math.random() * 0.1 - 0.05);
      this.data.moisture += (Math.random() * 1.0 - 0.5);
      this.data.temperature += (Math.random() * 0.4 - 0.2);
    }

    this.data.pressure = Math.max(0, Math.min(10, this.data.pressure));
    this.data.moisture = Math.max(0, Math.min(100, this.data.moisture));
    
    this.trends.moisture = this.data.moisture - prevMoisture;
    this.trends.pressure = this.data.pressure - prevPressure;
    this.trends.temperature = this.data.temperature - prevTemp;

    const timeStr = new Date().toLocaleTimeString('tr-TR', { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' });

    UIManager.updateDashboard(this.data, this.trends);
    ChartManager.updateData(timeStr, this.data.moisture, this.data.pressure, this.data.temperature);
    
    this.runAnalysis();
  },

  runAnalysis: function() {
    const reasons = [];
    let riskLevel = 0;

    if (this.data.pressure < 4.0 && this.trends.pressure < -0.1) {
      riskLevel += 50;
      reasons.push(`Kritik basınç düşüşü: Şu an ${this.data.pressure.toFixed(2)} bar.`);
    }

    if (this.data.moisture > 65.0 && this.trends.moisture > 1.5) {
      riskLevel += 60;
      reasons.push(`Toprak neminde ani artış: Şu an %${this.data.moisture.toFixed(1)} ve hızla yükseliyor.`);
    }

    if (riskLevel >= 100) {
      this.stop();
      UIManager.showWarningModal(reasons);
    }
  }
};
