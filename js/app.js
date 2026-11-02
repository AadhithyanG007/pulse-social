// Pulse Social Media Platform Main Controller
// Coordinates Views, Post Feed, Composer, Stories Player, Profile, Notifications & Theme

import { currentUser, initialStories, initialPosts, initialTrends, suggestedUsers, initialNotifications } from './data.js';
import { sound } from './sound.js';
import { ChatEngine } from './chat.js';

class PulseApp {
  constructor() {
    this.user = JSON.parse(JSON.stringify(currentUser));
    this.stories = JSON.parse(JSON.stringify(initialStories));
    this.posts = JSON.parse(JSON.stringify(initialPosts));
    this.trends = JSON.parse(JSON.stringify(initialTrends));
    this.suggested = JSON.parse(JSON.stringify(suggestedUsers));
    this.notifications = JSON.parse(JSON.stringify(initialNotifications));

    this.currentView = 'feed';
    this.activeFilter = 'all';
    this.composerMedia = null;
    this.activeStoryIndex = 0;
    this.activeSlideIndex = 0;
    this.storyTimer = null;
    this.storyProgress = 0;

    this.initTheme();
    this.initChatEngine();
    this.renderStories();
    this.renderPosts();
    this.renderTrends();
    this.renderSuggested();
    this.renderNotifications();
    this.renderProfile();
    this.bindEvents();
  }

  /* ==========================================================================
     INITIALIZATION & ROUTING
     ========================================================================== */

  initTheme() {
    const savedTheme = localStorage.getItem('pulse_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  toggleTheme() {
    sound.playPop();
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('pulse_theme', next);
    this.updateThemeIcon(next);
    this.showToast(`Switched to ${next} mode`, 'info');
  }

  updateThemeIcon(theme) {
    const iconContainer = document.getElementById('themeToggleBtn');
    if (!iconContainer) return;
    if (theme === 'light') {
      iconContainer.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    } else {
      iconContainer.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    }
  }

  initChatEngine() {
    this.chat = new ChatEngine(this);
  }

  switchView(viewName) {
    if (this.currentView === viewName) return;
    sound.playPop();
    this.currentView = viewName;

    // Toggle chat-mode on layout wrapper to give messenger full breathing room
    const appWrapper = document.querySelector('.app-wrapper');
    if (viewName === 'chat') {
      appWrapper?.classList.add('chat-mode');
    } else {
      appWrapper?.classList.remove('chat-mode');
    }

    // Update Sidebar Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Mobile Nav
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle Section Views
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) {
      targetSec.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'chat') {
      setTimeout(() => this.chat.scrollToBottom(), 50);
    }
  }

  /* ==========================================================================
     STORIES VIEWER LOGIC
     ========================================================================== */

  renderStories() {
    const rail = document.getElementById('storiesRail');
    if (!rail) return;
    rail.innerHTML = '';

    this.stories.forEach((story, idx) => {
      const item = document.createElement('div');
      item.className = 'story-item';
      item.innerHTML = `
        <div class="story-ring ${story.hasUnseen ? 'unseen' : ''}">
          <img src="${story.userAvatar}" alt="${story.userName}">
          ${story.isSelf ? `<span class="story-add-badge">+</span>` : ''}
        </div>
        <span class="story-user-name">${story.userName}</span>
      `;

      item.addEventListener('click', () => {
        sound.playPop();
        this.openStoryViewer(idx);
      });

      rail.appendChild(item);
    });
  }

  openStoryViewer(storyIndex) {
    this.activeStoryIndex = storyIndex;
    this.activeSlideIndex = 0;
    const modal = document.getElementById('storyViewerModal');
    if (!modal) return;

    modal.classList.add('open');
    this.renderCurrentStorySlide();
  }

  closeStoryViewer() {
    clearInterval(this.storyTimer);
    const modal = document.getElementById('storyViewerModal');
    if (modal) modal.classList.remove('open');
  }

  renderCurrentStorySlide() {
    clearInterval(this.storyTimer);
    const story = this.stories[this.activeStoryIndex];
    if (!story) {
      this.closeStoryViewer();
      return;
    }

    story.hasUnseen = false;
    this.renderStories();

    const slide = story.slides[this.activeSlideIndex];
    const imgEl = document.getElementById('storyMainImg');
    const authorAvatar = document.getElementById('storyAuthorAvatar');
    const authorName = document.getElementById('storyAuthorName');
    const timeBadge = document.getElementById('storyTimeBadge');
    const captionEl = document.getElementById('storyCaptionOverlay');
    const progressBarContainer = document.getElementById('storyProgressSegments');

    if (imgEl) imgEl.src = slide.url;
    if (authorAvatar) authorAvatar.src = story.userAvatar;
    if (authorName) authorName.textContent = story.userName;
    if (timeBadge) timeBadge.textContent = slide.time;
    if (captionEl) {
      captionEl.textContent = slide.caption || '';
      captionEl.style.display = slide.caption ? 'block' : 'none';
    }

    // Progress segments
    if (progressBarContainer) {
      progressBarContainer.innerHTML = '';
      story.slides.forEach((_, i) => {
        const seg = document.createElement('div');
        seg.className = 'story-progress-segment';
        const fill = document.createElement('div');
        fill.className = 'story-progress-fill';
        if (i < this.activeSlideIndex) {
          fill.style.width = '100%';
        } else if (i === this.activeSlideIndex) {
          fill.style.width = '0%';
        }
        seg.appendChild(fill);
        progressBarContainer.appendChild(seg);
      });
    }

    // Auto-advance timer (5000ms)
    this.storyProgress = 0;
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;

    this.storyTimer = setInterval(() => {
      this.storyProgress += step;
      const currentFill = progressBarContainer?.querySelectorAll('.story-progress-fill')[this.activeSlideIndex];
      if (currentFill) {
        currentFill.style.width = `${Math.min(this.storyProgress, 100)}%`;
      }
      if (this.storyProgress >= 100) {
        clearInterval(this.storyTimer);
        this.nextStorySlide();
      }
    }, interval);
  }

  nextStorySlide() {
    const story = this.stories[this.activeStoryIndex];
    if (this.activeSlideIndex < story.slides.length - 1) {
      this.activeSlideIndex++;
      this.renderCurrentStorySlide();
    } else {
      if (this.activeStoryIndex < this.stories.length - 1) {
        this.activeStoryIndex++;
        this.activeSlideIndex = 0;
        this.renderCurrentStorySlide();
      } else {
        this.closeStoryViewer();
      }
    }
  }

  prevStorySlide() {
    if (this.activeSlideIndex > 0) {
      this.activeSlideIndex--;
      this.renderCurrentStorySlide();
    } else {
      if (this.activeStoryIndex > 0) {
        this.activeStoryIndex--;
        this.activeSlideIndex = this.stories[this.activeStoryIndex].slides.length - 1;
        this.renderCurrentStorySlide();
      }
    }
  }

  /* ==========================================================================
     POSTS FEED & COMPOSER
     ========================================================================== */

  renderPosts() {
    const feed = document.getElementById('postsFeed');
    if (!feed) return;
    feed.innerHTML = '';

    const filtered = this.posts.filter(p => {
      if (this.activeFilter === 'all') return true;
      if (this.activeFilter === 'following') return p.author.isFollowing || p.author.id === currentUser.id;
      if (this.activeFilter === 'media') return p.media !== null;
      if (this.activeFilter === 'code') return p.codeSnippet !== null;
      return true;
    });

    if (filtered.length === 0) {
      feed.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <p style="font-weight: 600; font-size: 1.1rem; color: var(--text-primary); margin-bottom: 6px;">No pulses found</p>
          <p style="font-size: 0.88rem;">Be the first to share something in this category!</p>
        </div>
      `;
      return;
    }

    filtered.forEach(post => {
      const card = document.createElement('article');
      card.className = 'post-card';
      card.setAttribute('data-id', post.id);

      const mediaHtml = post.media ? `
        <div class="post-media-container" data-url="${post.media.url}">
          <img src="${post.media.url}" alt="Post media">
        </div>
      ` : '';

      const codeHtml = post.codeSnippet ? `
        <div class="post-code-block">
          <div class="code-header">
            <span>// ${post.codeSnippet.language}</span>
            <button class="code-copy-btn" data-code="${encodeURIComponent(post.codeSnippet.code)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy
            </button>
          </div>
          <pre><code>${this.escapeHTML(post.codeSnippet.code)}</code></pre>
        </div>
      ` : '';

      const commentsHtml = post.comments.map(c => `
        <div class="comment-item">
          <img class="comment-avatar" src="${c.avatar}" alt="${c.author}">
          <div class="comment-bubble">
            <div class="comment-meta">
              <span class="comment-author">${c.author}</span>
              <span class="comment-time">${c.timestamp}</span>
            </div>
            <p class="comment-text">${this.escapeHTML(c.content)}</p>
          </div>
        </div>
      `).join('');

      card.innerHTML = `
        <div class="post-header">
          <div class="post-author-group">
            <img class="post-author-avatar" src="${post.author.avatar}" alt="${post.author.name}">
            <div class="post-author-meta">
              <div class="post-author-line">
                <span class="post-author-name">${post.author.name}</span>
                ${post.author.badge ? `<span class="post-author-badge">${post.author.badge}</span>` : ''}
              </div>
              <div class="post-sub-line">
                <span>${post.author.handle}</span>
                <span>•</span>
                <span>${post.timestamp}</span>
                <span>•</span>
                <span class="post-tag-pill">#${post.tag}</span>
              </div>
            </div>
          </div>
          <button class="post-more-btn" title="Post options">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>
        </div>

        <div class="post-body">${this.escapeHTML(post.content)}</div>

        ${mediaHtml}
        ${codeHtml}

        <div class="post-actions">
          <button class="action-btn btn-like ${post.hasLiked ? 'liked' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span class="like-count">${post.likes}</span>
          </button>

          <button class="action-btn btn-comment-toggle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span class="comment-count">${post.comments.length}</span>
          </button>

          <button class="action-btn btn-repost ${post.hasReposted ? 'reposted' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
            <span class="repost-count">${post.reposts}</span>
          </button>

          <button class="action-btn btn-bookmark ${post.hasBookmarked ? 'bookmarked' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <span class="bookmark-count">${post.bookmarks}</span>
          </button>

          <button class="action-btn btn-share" title="Share pulse">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
        </div>

        <div class="comments-section">
          <div class="comments-list">${commentsHtml}</div>
          <div class="comment-composer">
            <input type="text" class="comment-input" placeholder="Add to discussion...">
            <button class="btn-send-comment" title="Send comment">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      `;

      // Event Listeners on Card
      this.attachPostCardEvents(card, post);

      feed.appendChild(card);
    });
  }

  attachPostCardEvents(card, post) {
    // Like button
    const likeBtn = card.querySelector('.btn-like');
    likeBtn.addEventListener('click', () => {
      sound.playLike();
      post.hasLiked = !post.hasLiked;
      post.likes += post.hasLiked ? 1 : -1;
      likeBtn.classList.toggle('liked', post.hasLiked);
      likeBtn.querySelector('.like-count').textContent = post.likes;
    });

    // Repost button
    const repostBtn = card.querySelector('.btn-repost');
    repostBtn.addEventListener('click', () => {
      sound.playPop();
      post.hasReposted = !post.hasReposted;
      post.reposts += post.hasReposted ? 1 : -1;
      repostBtn.classList.toggle('reposted', post.hasReposted);
      repostBtn.querySelector('.repost-count').textContent = post.reposts;
      this.showToast(post.hasReposted ? 'Reposted to your profile' : 'Removed repost', 'info');
    });

    // Bookmark button
    const bookmarkBtn = card.querySelector('.btn-bookmark');
    bookmarkBtn.addEventListener('click', () => {
      sound.playPop();
      post.hasBookmarked = !post.hasBookmarked;
      post.bookmarks += post.hasBookmarked ? 1 : -1;
      bookmarkBtn.classList.toggle('bookmarked', post.hasBookmarked);
      bookmarkBtn.querySelector('.bookmark-count').textContent = post.bookmarks;
      this.showToast(post.hasBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks', 'info');
    });

    // Comment toggle
    const commentToggleBtn = card.querySelector('.btn-comment-toggle');
    const commentsSec = card.querySelector('.comments-section');
    commentToggleBtn.addEventListener('click', () => {
      commentsSec.classList.toggle('open');
    });

    // Submit Comment
    const commentInput = card.querySelector('.comment-input');
    const sendCommentBtn = card.querySelector('.btn-send-comment');
    const submitComment = () => {
      const text = commentInput.value.trim();
      if (!text) return;
      sound.playSend();

      const newComment = {
        id: 'c_' + Date.now(),
        author: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        content: text,
        timestamp: 'Just now',
        likes: 0
      };

      post.comments.push(newComment);
      const commentsList = card.querySelector('.comments-list');
      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `
        <img class="comment-avatar" src="${newComment.avatar}" alt="${newComment.author}">
        <div class="comment-bubble">
          <div class="comment-meta">
            <span class="comment-author">${newComment.author}</span>
            <span class="comment-time">${newComment.timestamp}</span>
          </div>
          <p class="comment-text">${this.escapeHTML(newComment.content)}</p>
        </div>
      `;
      commentsList.appendChild(item);
      commentInput.value = '';
      card.querySelector('.comment-count').textContent = post.comments.length;
      this.showToast('Comment published', 'success');
    };

    sendCommentBtn.addEventListener('click', submitComment);
    commentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitComment();
    });

    // Share link
    const shareBtn = card.querySelector('.btn-share');
    shareBtn.addEventListener('click', () => {
      sound.playPop();
      navigator.clipboard?.writeText(window.location.href);
      this.showToast('Pulse link copied to clipboard!', 'success');
    });

    // Copy code button
    const copyCodeBtn = card.querySelector('.code-copy-btn');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => {
        sound.playPop();
        const code = decodeURIComponent(copyCodeBtn.getAttribute('data-code'));
        navigator.clipboard?.writeText(code);
        copyCodeBtn.innerHTML = `✓ Copied`;
        setTimeout(() => {
          copyCodeBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy
          `;
        }, 2000);
      });
    }
  }

  /* ==========================================================================
     CREATE NEW POST (COMPOSER)
     ========================================================================== */

  createPost() {
    const textarea = document.getElementById('composerTextarea');
    const codeInput = document.getElementById('composerCodeInput');
    const codeBox = document.getElementById('composerCodeBox');
    const text = textarea?.value.trim();
    const code = codeInput?.value.trim();

    if (!text && !this.composerMedia && !code) {
      this.showToast('Please type a message or upload media', 'info');
      return;
    }

    sound.playSend();

    const newPost = {
      id: 'post_' + Date.now(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        badge: 'CREATOR',
        isFollowing: false
      },
      timestamp: 'Just now',
      tag: 'CreativePulse',
      content: text,
      media: this.composerMedia ? { type: 'image', url: this.composerMedia } : null,
      codeSnippet: (code && codeBox.style.display !== 'none') ? { language: 'javascript', code: code } : null,
      likes: 1,
      hasLiked: true,
      reposts: 0,
      hasReposted: false,
      bookmarks: 0,
      hasBookmarked: false,
      comments: []
    };

    this.posts.unshift(newPost);
    this.renderPosts();

    // Reset composer
    if (textarea) textarea.value = '';
    if (codeInput) codeInput.value = '';
    if (codeBox) codeBox.style.display = 'none';
    this.removeComposerMedia();
    this.showToast('Pulse broadcasted successfully! 🚀', 'success');
  }

  removeComposerMedia() {
    this.composerMedia = null;
    const preview = document.getElementById('composerMediaPreview');
    if (preview) {
      preview.style.display = 'none';
      const img = preview.querySelector('img');
      if (img) img.src = '';
    }
    const fileInput = document.getElementById('composerFileInput');
    if (fileInput) fileInput.value = '';
  }

  /* ==========================================================================
     SIDEBAR WIDGETS & PROFILE
     ========================================================================== */

  renderTrends() {
    const list = document.getElementById('trendsList');
    if (!list) return;
    list.innerHTML = '';

    this.trends.forEach(trend => {
      const item = document.createElement('div');
      item.className = 'trend-item';
      item.innerHTML = `
        <span class="trend-category">${trend.category} • Trending</span>
        <span class="trend-tag">${trend.tag}</span>
        <span class="trend-count">${trend.postsCount} Pulses</span>
      `;

      item.addEventListener('click', () => {
        sound.playPop();
        this.switchView('explore');
        this.showToast(`Exploring ${trend.tag}`, 'info');
      });

      list.appendChild(item);
    });
  }

  renderSuggested() {
    const list = document.getElementById('suggestedList');
    if (!list) return;
    list.innerHTML = '';

    this.suggested.forEach(user => {
      const item = document.createElement('div');
      item.className = 'suggested-item';
      item.innerHTML = `
        <div class="suggested-user-group">
          <img class="suggested-avatar" src="${user.avatar}" alt="${user.name}">
          <div class="suggested-meta">
            <span class="suggested-name">${user.name}</span>
            <span class="suggested-role">${user.role}</span>
          </div>
        </div>
        <button class="btn-follow ${user.isFollowing ? 'following' : ''}">
          ${user.isFollowing ? 'Following' : 'Follow'}
        </button>
      `;

      const followBtn = item.querySelector('.btn-follow');
      followBtn.addEventListener('click', () => {
        sound.playPop();
        user.isFollowing = !user.isFollowing;
        followBtn.classList.toggle('following', user.isFollowing);
        followBtn.textContent = user.isFollowing ? 'Following' : 'Follow';
        this.showToast(user.isFollowing ? `You are now following ${user.name}` : `Unfollowed ${user.name}`, 'info');
      });

      list.appendChild(item);
    });
  }

  renderNotifications() {
    const list = document.getElementById('notificationsList');
    if (!list) return;
    list.innerHTML = '';

    this.notifications.forEach(notif => {
      const card = document.createElement('div');
      card.className = `notif-card ${!notif.read ? 'unread' : ''}`;
      card.innerHTML = `
        <img class="notif-avatar" src="${notif.user.avatar}" alt="${notif.user.name}">
        <div class="notif-content">
          <p class="notif-text"><strong>${notif.user.name}</strong> ${notif.text}</p>
          <span class="notif-time">${notif.time}</span>
        </div>
      `;
      list.appendChild(card);
    });
  }

  renderProfile() {
    const nameEl = document.getElementById('profileDisplayName');
    const handleEl = document.getElementById('profileHandle');
    const bioEl = document.getElementById('profileBio');
    const avatarEl = document.getElementById('profileAvatarLarge');
    const bannerEl = document.getElementById('profileBannerImg');

    if (nameEl) nameEl.textContent = this.user.name;
    if (handleEl) handleEl.textContent = this.user.handle;
    if (bioEl) bioEl.textContent = this.user.bio;
    if (avatarEl) avatarEl.src = this.user.avatar;
    if (bannerEl) bannerEl.src = this.user.banner;
  }

  /* ==========================================================================
     GLOBAL TOAST ALERTS & EVENT BINDINGS
     ========================================================================== */

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconSvg = type === 'success' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--status-online);"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--accent-secondary);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    toast.innerHTML = `${iconSvg}<span>${this.escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  bindEvents() {
    // Navigation items click
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        if (view) this.switchView(view);
      });
    });

    // Mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        if (view) this.switchView(view);
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Composer Post submit
    const postSubmitBtn = document.getElementById('btnPostSubmit');
    if (postSubmitBtn) {
      postSubmitBtn.addEventListener('click', () => this.createPost());
    }

    // Composer Image upload
    const composerUploadBtn = document.getElementById('composerUploadBtn');
    const composerFileInput = document.getElementById('composerFileInput');
    if (composerUploadBtn && composerFileInput) {
      composerUploadBtn.addEventListener('click', () => composerFileInput.click());
      composerFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.composerMedia = event.target.result;
            const preview = document.getElementById('composerMediaPreview');
            if (preview) {
              preview.querySelector('img').src = this.composerMedia;
              preview.style.display = 'block';
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Remove composer media preview
    const removeMediaBtn = document.getElementById('removeMediaBtn');
    if (removeMediaBtn) {
      removeMediaBtn.addEventListener('click', () => this.removeComposerMedia());
    }

    // Code snippet toggle
    const composerCodeBtn = document.getElementById('composerCodeBtn');
    const composerCodeBox = document.getElementById('composerCodeBox');
    if (composerCodeBtn && composerCodeBox) {
      composerCodeBtn.addEventListener('click', () => {
        sound.playPop();
        const isOpen = composerCodeBox.style.display === 'block';
        composerCodeBox.style.display = isOpen ? 'none' : 'block';
      });
    }

    // Feed filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sound.playPop();
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeFilter = chip.getAttribute('data-filter') || 'all';
        this.renderPosts();
      });
    });

    // Story viewer close & navigation
    const closeStoryBtn = document.getElementById('storyCloseBtn');
    if (closeStoryBtn) closeStoryBtn.addEventListener('click', () => this.closeStoryViewer());

    const tapPrev = document.getElementById('storyNavPrev');
    const tapNext = document.getElementById('storyNavNext');
    if (tapPrev) tapPrev.addEventListener('click', () => this.prevStorySlide());
    if (tapNext) tapNext.addEventListener('click', () => this.nextStorySlide());

    // Story reply input
    const storyReplyInput = document.getElementById('storyReplyInput');
    if (storyReplyInput) {
      storyReplyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && storyReplyInput.value.trim()) {
          const text = storyReplyInput.value.trim();
          const story = this.stories[this.activeStoryIndex];
          sound.playSend();
          this.showToast(`Reply sent to ${story.userName}!`, 'success');
          storyReplyInput.value = '';
          this.closeStoryViewer();
        }
      });
    }

    // Story quick emoji reaction
    document.querySelectorAll('.story-reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playLike();
        this.showToast(`Sent ${btn.textContent} to ${this.stories[this.activeStoryIndex].userName}`, 'success');
      });
    });

    // Edit profile button & modal
    const editProfileBtn = document.getElementById('btnEditProfile');
    const editModal = document.getElementById('editProfileModal');
    const editSaveBtn = document.getElementById('btnSaveProfile');
    const editCancelBtn = document.getElementById('btnCancelProfile');

    if (editProfileBtn && editModal) {
      editProfileBtn.addEventListener('click', () => {
        sound.playPop();
        document.getElementById('editBioInput').value = this.user.bio;
        document.getElementById('editNameInput').value = this.user.name;
        document.getElementById('editTitleInput').value = this.user.title;
        editModal.classList.add('open');
      });
    }

    if (editCancelBtn && editModal) {
      editCancelBtn.addEventListener('click', () => editModal.classList.remove('open'));
    }

    if (editSaveBtn && editModal) {
      editSaveBtn.addEventListener('click', () => {
        sound.playPop();
        this.user.name = document.getElementById('editNameInput').value.trim() || this.user.name;
        this.user.title = document.getElementById('editTitleInput').value.trim() || this.user.title;
        this.user.bio = document.getElementById('editBioInput').value.trim() || this.user.bio;
        this.renderProfile();
        editModal.classList.remove('open');
        this.showToast('Profile updated!', 'success');
      });
    }

    // Mark all notifications read
    const markReadBtn = document.getElementById('btnMarkAllRead');
    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => {
        sound.playPop();
        this.notifications.forEach(n => n.read = true);
        this.renderNotifications();
        const badge = document.getElementById('navNotifBadge');
        if (badge) badge.style.display = 'none';
        this.showToast('All notifications marked as read', 'info');
      });
    }
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

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.pulseApp = new PulseApp();
});
