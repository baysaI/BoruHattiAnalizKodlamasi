const GEMINI_API_KEY = "BURAYA_API_ANAHTARINIZI_GIRIN";

const ChatbotManager = {
  chatHistory: [
    {
      role: "model",
      parts: [{ text: "Merhaba! Ben SıfırSızıntıHattı Yapay Zeka Asistanıyım. Sistem durumuyla ilgili bana her şeyi sorabilirsiniz." }]
    }
  ],
  isOpen: false,

  init: function () {
    this.injectHTML();
    this.bindEvents();
    this.renderHistory();
  },

  injectHTML: function () {
    const htmlObj = `
      <div id="ai-chatbot-widget">
        <div id="ai-chatbot-window">
          <div id="ai-chatbot-header">
            <div id="ai-chatbot-header-title">
              <i class="fa-solid fa-robot"></i> Saha Asistanı AI
            </div>
            <div id="ai-chatbot-close"><i class="fa-solid fa-xmark"></i></div>
          </div>
          <div id="ai-chatbot-messages"></div>
          <div id="ai-chatbot-input-area">
            <input type="text" id="ai-chatbot-input" placeholder="Bir soru sorun..." autocomplete="off" />
            <button id="ai-chatbot-send"><i class="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
        <div id="ai-chatbot-launcher">
          <i class="fa-solid fa-comment-dots"></i>
        </div>
      </div>
    `;
    $('body').append(htmlObj);
  },

  bindEvents: function () {
    $('#ai-chatbot-launcher').on('click', () => this.toggleWindow(true));
    $('#ai-chatbot-close').on('click', () => this.toggleWindow(false));

    $('#ai-chatbot-send').on('click', () => this.handleSend());
    $('#ai-chatbot-input').on('keypress', (e) => {
      if (e.which == 13) this.handleSend();
    });
  },

  toggleWindow: function (state) {
    this.isOpen = state;
    if (this.isOpen) {
      $('#ai-chatbot-window').css('display', 'flex');
      $('#ai-chatbot-launcher').css('display', 'none');
      $('#ai-chatbot-input').focus();
      this.scrollToBottom();
    } else {
      $('#ai-chatbot-window').css('display', 'none');
      $('#ai-chatbot-launcher').css('display', 'flex');
    }
  },

  renderHistory: function () {
    const container = $('#ai-chatbot-messages');
    container.empty();

    this.chatHistory.forEach(msg => {
      const isUser = msg.role === "user";
      this.appendMessageElement(isUser ? "user" : "bot", msg.parts[0].text);
    });
    this.scrollToBottom();
  },

  appendMessageElement: function (type, text) {
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    const msgDiv = $(`<div class="chat-msg ${type}">${formattedText}</div>`);
    $('#ai-chatbot-messages').append(msgDiv);
    this.scrollToBottom();
  },

  appendTypingIndicator: function () {
    const typingHtml = `
      <div class="chat-msg bot typing" id="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    $('#ai-chatbot-messages').append(typingHtml);
    this.scrollToBottom();
  },

  removeTypingIndicator: function () {
    $('#typing-indicator').remove();
  },

  scrollToBottom: function () {
    const messagesDiv = $('#ai-chatbot-messages');
    messagesDiv.scrollTop(messagesDiv[0].scrollHeight);
  },

  handleSend: async function () {
    const input = $('#ai-chatbot-input');
    const text = input.val().trim();
    if (!text) return;

    input.val('');
    this.appendMessageElement('user', text);

    this.chatHistory.push({ role: "user", parts: [{ text: text }] });

    this.appendTypingIndicator();

    try {
      if (GEMINI_API_KEY === "BURAYA_API_ANAHTARINIZI_GIRIN") {
        throw new Error("Lütfen scripts/chatbot.js dosyasına geçerli bir GEMINI_API_KEY girin.");
      }

      const botReply = await this.callGeminiAPI(text);
      this.removeTypingIndicator();
      this.appendMessageElement('bot', botReply);
      this.chatHistory.push({ role: "model", parts: [{ text: botReply }] });

    } catch (error) {
      this.removeTypingIndicator();
      console.error(error);
      this.appendMessageElement('bot', `Sistem Hatası: ${error.message}`);
      this.chatHistory.pop();
    }
  },

  callGeminiAPI: async function (userPrompt) {
    let systemDataStr = "Veri Yok";
    if (typeof Simulation !== 'undefined' && Simulation.data) {
      systemDataStr = `Şu anki Boru Hattı Durumu:
- Toprak Nemi: %${Simulation.data.moisture.toFixed(1)}
- Hat Basıncı: ${Simulation.data.pressure.toFixed(2)} bar
- Sıcaklık: ${Simulation.data.temperature.toFixed(1)}°C`;
    }

    const systemPrompt = `Sen SıfırSızıntıHattı (ZeroLeak Pipeline) şirketinin baş mühendisi ve sistem destek yapay zekasısın. 
Adın: Saha Asistanı AI. 
Kullanıcıya boru hattı güvenliği ve sistem izleme panelinde yardımcı oluyorsun.
Kısa, net ve teknik dille (fakat anlaşılır) yanıtlar ver. MD formatı (bold) kullanabilirsin.
Soruları bu anlık verilere dayanarak cevapla:
${systemDataStr}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: this.chatHistory
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;
  }
};

$(document).ready(function () {
  ChatbotManager.init();
});
