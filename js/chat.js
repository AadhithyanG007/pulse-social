// Pulse Real-Time Messenger Engine
// Handles contacts list, interactive chat timeline, responsive simulated bot/peer replies,
// audio notes, image attachments, call simulations, and sound effects

import { initialChats, currentUser } from './data.js';
import { sound } from './sound.js';

export class ChatEngine {
  constructor(app) {
    this.app = app;
    this.chats = JSON.parse(JSON.stringify(initialChats));
    this.activeChatId = this.chats[0].id;
    this.isRecordingVoice = false;
    this.typingTimeout = null;

    this.initDOMElements();
    this.bindEvents();
    this.renderContacts();
    this.renderActiveChat();
  }

  initDOMElements() {
    this.contactsListEl = document.getElementById('chatContactsList');
    this.searchContactsInput = document.getElementById('chatSearchInput');
    this.activeRoomPane = document.getElementById('chatRoomPane');
    this.roomMessagesStream = document.getElementById('roomMessagesStream');
    this.chatInputField = document.getElementById('chatInputField');
    this.btnSendMessage = document.getElementById('btnSendMessage');
    this.typingIndicator = document.getElementById('typingIndicator');
    this.typingUserText = document.getElementById('typingUserText');
    this.emojiBtn = document.getElementById('chatEmojiBtn');
    this.emojiDrawer = document.getElementById('chatEmojiDrawer');
    this.voiceRecordBtn = document.getElementById('chatVoiceBtn');
    this.attachBtn = document.getElementById('chatAttachBtn');
    this.mediaFileInput = document.getElementById('chatMediaFileInput');

    // Header elements
    this.roomAvatar = document.getElementById('roomAvatar');
    this.roomStatusDot = document.getElementById('roomStatusDot');
    this.roomName = document.getElementById('roomName');
    this.roomStatusText = document.getElementById('roomStatusText');
    this.btnVoiceCall = document.getElementById('btnVoiceCall');
    this.btnVideoCall = document.getElementById('btnVideoCall');
  }

  bindEvents() {
    // Search contacts filter
    if (this.searchContactsInput) {
      this.searchContactsInput.addEventListener('input', (e) => {
        this.filterContacts(e.target.value.toLowerCase().trim());
      });
    }

    // Send button click
    if (this.btnSendMessage) {
      this.btnSendMessage.addEventListener('click', () => this.sendMessage());
    }

    // Input Enter key press
    if (this.chatInputField) {
      this.chatInputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    // Emoji Drawer toggle & select
    if (this.emojiBtn && this.emojiDrawer) {
      this.emojiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emojiDrawer.classList.toggle('open');
      });

      this.emojiDrawer.querySelectorAll('.emoji-item').forEach(item => {
        item.addEventListener('click', (e) => {
          this.insertEmoji(e.target.textContent);
        });
      });

      document.addEventListener('click', () => {
        this.emojiDrawer.classList.remove('open');
      });
    }

    // Voice note simulation
    if (this.voiceRecordBtn) {
      this.voiceRecordBtn.addEventListener('click', () => {
        this.toggleVoiceRecord();
      });
    }

    // Image attachment simulation
    if (this.attachBtn && this.mediaFileInput) {
      this.attachBtn.addEventListener('click', () => {
        this.mediaFileInput.click();
      });

      this.mediaFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.sendMediaMessage(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Call buttons
    if (this.btnVoiceCall) {
      this.btnVoiceCall.addEventListener('click', () => this.triggerCallModal('Audio Call'));
    }
    if (this.btnVideoCall) {
      this.btnVideoCall.addEventListener('click', () => this.triggerCallModal('HD Video Call'));
    }

    // Quick icebreaker prompt pills
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.chatInputField.value = chip.textContent;
        this.chatInputField.focus();
      });
    });
  }

  getActiveChat() {
    return this.chats.find(c => c.id === this.activeChatId);
  }

  filterContacts(query) {
    const items = this.contactsListEl.querySelectorAll('.contact-item');
    items.forEach(item => {
      const name = item.getAttribute('data-name').toLowerCase();
      const handle = item.getAttribute('data-handle').toLowerCase();
      if (name.includes(query) || handle.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  renderContacts() {
    if (!this.contactsListEl) return;
    this.contactsListEl.innerHTML = '';

    this.chats.forEach(chat => {
      const lastMsg = chat.messages[chat.messages.length - 1];
      const lastText = lastMsg ? (lastMsg.type === 'voice' ? '🎙️ Voice note' : (lastMsg.mediaUrl ? '📷 Photo' : lastMsg.text)) : 'No messages yet';
      const lastTime = lastMsg ? lastMsg.timestamp : chat.lastActivity;

      const li = document.createElement('li');
      li.className = `contact-item ${chat.id === this.activeChatId ? 'active' : ''}`;
      li.setAttribute('data-id', chat.id);
      li.setAttribute('data-name', chat.participant.name);
      li.setAttribute('data-handle', chat.participant.handle);

      li.innerHTML = `
        <div class="contact-avatar-col">
          <img src="${chat.participant.avatar}" alt="${chat.participant.name}">
          <span class="status-dot ${chat.participant.status}"></span>
        </div>
        <div class="contact-info-col">
          <div class="contact-name-row">
            <span class="contact-name">${chat.participant.name}</span>
            <span class="contact-time">${lastTime}</span>
          </div>
          <div class="contact-last-msg-row">
            <span class="contact-last-msg">${lastText}</span>
            ${chat.unreadCount > 0 ? `<span class="unread-bubble">${chat.unreadCount}</span>` : ''}
          </div>
        </div>
      `;

      li.addEventListener('click', () => {
        sound.playPop();
        this.selectChat(chat.id);
      });

      this.contactsListEl.appendChild(li);
    });
  }

  selectChat(chatId) {
    this.activeChatId = chatId;
    const activeChat = this.getActiveChat();
    if (activeChat) {
      activeChat.unreadCount = 0;
    }
    this.renderContacts();
    this.renderActiveChat();
    this.updateGlobalBadge();
  }

  renderActiveChat() {
    const chat = this.getActiveChat();
    if (!chat) return;

    // Update Header
    if (this.roomAvatar) this.roomAvatar.src = chat.participant.avatar;
    if (this.roomName) this.roomName.innerHTML = `<span class="name-text">${chat.participant.name}</span> <span class="post-author-badge">${chat.participant.role.toUpperCase()}</span>`;
    if (this.roomStatusDot) {
      this.roomStatusDot.className = `status-dot ${chat.participant.status}`;
    }
    if (this.roomStatusText) {
      this.roomStatusText.textContent = chat.participant.status === 'online' 
        ? 'Active now' 
        : (chat.participant.lastSeen ? `Last seen ${chat.participant.lastSeen}` : 'Offline');
      this.roomStatusText.style.color = chat.participant.status === 'online' ? 'var(--status-online)' : 'var(--text-muted)';
    }

    // Hide typing indicator initially
    this.hideTyping();

    // Render Messages Stream
    if (!this.roomMessagesStream) return;
    this.roomMessagesStream.innerHTML = '';

    // Date Divider
    const divider = document.createElement('div');
    divider.className = 'msg-date-divider';
    divider.innerHTML = `<span class="msg-date-pill">Today</span>`;
    this.roomMessagesStream.appendChild(divider);

    chat.messages.forEach(msg => {
      this.appendMessageElement(msg, chat.participant);
    });

    this.scrollToBottom();
  }

  appendMessageElement(msg, participant) {
    const isMe = msg.senderId === currentUser.id;
    const row = document.createElement('div');
    row.className = `message-row ${isMe ? 'outgoing' : 'incoming'}`;

    let bodyContent = '';
    if (msg.type === 'voice') {
      bodyContent = `
        <div class="voice-message-card">
          <button class="voice-play-btn" title="Play Voice Memo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
          <div class="waveform-bars">
            ${[14, 22, 10, 18, 24, 16, 8, 20, 22, 12, 18, 24, 16, 10, 19, 14, 8].map(h => `<span class="wave-bar" style="height: ${h}px"></span>`).join('')}
          </div>
          <span style="font-size: 0.72rem; opacity: 0.8; margin-left: 4px;">0:14</span>
        </div>
      `;
    } else if (msg.mediaUrl) {
      bodyContent = `
        <div class="msg-media-attachment">
          <img src="${msg.mediaUrl}" alt="Media attachment">
        </div>
        ${msg.text ? `<p style="margin-top: 6px;">${this.escapeHTML(msg.text)}</p>` : ''}
      `;
    } else {
      bodyContent = this.escapeHTML(msg.text);
    }

    const checkmarkSvg = isMe ? `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-secondary);">
        <polyline points="20 6 9 17 4 12"></polyline>
        <polyline points="20 12 15 17"></polyline>
      </svg>
    ` : '';

    row.innerHTML = `
      ${!isMe ? `<img class="msg-avatar" src="${participant.avatar}" alt="${participant.name}">` : ''}
      <div class="msg-bubble-content">
        <div class="msg-bubble">
          ${bodyContent}
        </div>
        <div class="msg-time-row">
          <span>${msg.timestamp}</span>
          ${checkmarkSvg}
        </div>
      </div>
    `;

    // Voice play interaction
    const playBtn = row.querySelector('.voice-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        sound.playPop();
        playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
        setTimeout(() => {
          playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        }, 3000);
      });
    }

    this.roomMessagesStream.appendChild(row);
  }

  sendMessage() {
    if (!this.chatInputField) return;
    const text = this.chatInputField.value.trim();
    if (!text) return;

    sound.playSend();

    const activeChat = this.getActiveChat();
    const newMsg = {
      id: 'm_' + Date.now(),
      senderId: currentUser.id,
      text: text,
      timestamp: this.getCurrentTime(),
      status: 'delivered'
    };

    activeChat.messages.push(newMsg);
    this.appendMessageElement(newMsg, activeChat.participant);
    this.chatInputField.value = '';
    this.scrollToBottom();
    this.renderContacts();

    // Trigger simulated peer auto-reply
    this.simulatePeerReply(activeChat);
  }

  sendMediaMessage(dataUrl) {
    sound.playSend();
    const activeChat = this.getActiveChat();
    const newMsg = {
      id: 'm_' + Date.now(),
      senderId: currentUser.id,
      text: '',
      mediaUrl: dataUrl,
      timestamp: this.getCurrentTime(),
      status: 'delivered'
    };

    activeChat.messages.push(newMsg);
    this.appendMessageElement(newMsg, activeChat.participant);
    this.scrollToBottom();
    this.renderContacts();
    this.app.showToast('Image sent to ' + activeChat.participant.name, 'success');

    this.simulatePeerReply(activeChat);
  }

  toggleVoiceRecord() {
    if (this.isRecordingVoice) {
      // Finish recording & send
      this.isRecordingVoice = false;
      this.voiceRecordBtn.style.color = 'var(--text-muted)';
      this.voiceRecordBtn.style.animation = 'none';

      sound.playSend();
      const activeChat = this.getActiveChat();
      const newMsg = {
        id: 'm_' + Date.now(),
        senderId: currentUser.id,
        type: 'voice',
        text: 'Voice Memo (0:14)',
        timestamp: this.getCurrentTime(),
        status: 'delivered'
      };

      activeChat.messages.push(newMsg);
      this.appendMessageElement(newMsg, activeChat.participant);
      this.scrollToBottom();
      this.renderContacts();
      this.app.showToast('Voice memo sent!', 'success');
      this.simulatePeerReply(activeChat);
    } else {
      // Start recording
      this.isRecordingVoice = true;
      sound.playPop();
      this.voiceRecordBtn.style.color = '#ef4444';
      this.voiceRecordBtn.style.animation = 'pulseRings 1s infinite alternate';
      this.app.showToast('Recording voice memo... Click mic again to send.', 'info');
    }
  }

  simulatePeerReply(chat) {
    clearTimeout(this.typingTimeout);

    // After 800ms show typing
    this.typingTimeout = setTimeout(() => {
      this.showTyping(chat.participant.name);

      // After 2000ms deliver response
      setTimeout(() => {
        this.hideTyping();
        const replies = chat.autoReplies && chat.autoReplies.length > 0 
          ? chat.autoReplies 
          : ["Sounds awesome! Let's keep iterating.", "Love this approach! Let me pull the latest changes."];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg = {
          id: 'm_' + Date.now(),
          senderId: chat.participant.id,
          text: randomReply,
          timestamp: this.getCurrentTime(),
          status: 'read'
        };

        chat.messages.push(replyMsg);
        if (this.activeChatId === chat.id) {
          sound.playReceive();
          this.appendMessageElement(replyMsg, chat.participant);
          this.scrollToBottom();
        } else {
          chat.unreadCount++;
          sound.playPop();
          this.app.showToast(`New message from ${chat.participant.name}: "${randomReply.substring(0, 30)}..."`, 'info');
        }

        this.renderContacts();
        this.updateGlobalBadge();
      }, 1800);
    }, 700);
  }

  showTyping(name) {
    if (!this.typingIndicator) return;
    if (this.typingUserText) this.typingUserText.textContent = `${name} is typing`;
    this.typingIndicator.style.display = 'flex';
    this.scrollToBottom();
  }

  hideTyping() {
    if (!this.typingIndicator) return;
    this.typingIndicator.style.display = 'none';
  }

  insertEmoji(emoji) {
    if (!this.chatInputField) return;
    this.chatInputField.value += emoji;
    this.chatInputField.focus();
    sound.playPop();
  }

  triggerCallModal(type) {
    const chat = this.getActiveChat();
    const modal = document.getElementById('callModal');
    const avatar = document.getElementById('callModalAvatar');
    const name = document.getElementById('callModalName');
    const status = document.getElementById('callModalStatus');

    if (!modal) return;
    sound.playPop();
    if (avatar) avatar.src = chat.participant.avatar;
    if (name) name.textContent = chat.participant.name;
    if (status) status.textContent = `Calling • ${type}...`;

    modal.classList.add('open');

    const endBtn = document.getElementById('callEndBtn');
    if (endBtn) {
      endBtn.onclick = () => {
        sound.playPop();
        modal.classList.remove('open');
        this.app.showToast('Call ended', 'info');
      };
    }
  }

  updateGlobalBadge() {
    const totalUnread = this.chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
    const navChatBadge = document.getElementById('navChatBadge');
    if (navChatBadge) {
      if (totalUnread > 0) {
        navChatBadge.textContent = totalUnread;
        navChatBadge.style.display = 'inline-block';
      } else {
        navChatBadge.style.display = 'none';
      }
    }
  }

  scrollToBottom() {
    if (this.roomMessagesStream) {
      this.roomMessagesStream.scrollTop = this.roomMessagesStream.scrollHeight;
    }
  }

  getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}
