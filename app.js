// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const moodOptions = document.querySelectorAll('.mood-option');
const moodJournalTextarea = document.querySelector('.mood-journal textarea');
const saveJournalBtn = document.querySelector('.mood-journal .btn');
const createPostTextarea = document.querySelector('.create-post textarea');
const postBtn = document.querySelector('.create-post .btn');

// Mood tracking data
let moodData = JSON.parse(localStorage.getItem('moodData')) || [];
let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
let communityPosts = JSON.parse(localStorage.getItem('communityPosts')) || [];

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Mood selection
moodOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        moodOptions.forEach(opt => opt.classList.remove('active'));
        // Add active class to selected option
        option.classList.add('active');
        
        // Get mood data
        const mood = option.getAttribute('data-mood');
        const date = new Date().toISOString().split('T')[0];
        
        // Check if mood already logged today
        const todayIndex = moodData.findIndex(entry => entry.date === date);
        
        if (todayIndex !== -1) {
            // Update existing entry
            moodData[todayIndex].mood = mood;
        } else {
            // Add new entry
            moodData.push({ date, mood });
        }
        
        // Save to localStorage
        localStorage.setItem('moodData', JSON.stringify(moodData));
        
        // Show feedback
        showNotification(`Mood logged: ${mood.charAt(0).toUpperCase() + mood.slice(1)}`);
    });
});

// Save journal entry
saveJournalBtn.addEventListener('click', () => {
    const entry = moodJournalTextarea.value.trim();
    if (entry) {
        const date = new Date().toISOString();
        journalEntries.unshift({
            date,
            content: entry,
            mood: getCurrentMood()
        });
        
        // Keep only the last 100 entries
        if (journalEntries.length > 100) {
            journalEntries = journalEntries.slice(0, 100);
        }
        
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
        moodJournalTextarea.value = '';
        showNotification('Journal entry saved');
    }
});

// Create community post
postBtn.addEventListener('click', () => {
    const content = createPostTextarea.value.trim();
    if (content) {
        const post = {
            id: Date.now(),
            content,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: []
        };
        
        communityPosts.unshift(post);
        localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
        
        // Add to UI
        addPostToUI(post);
        createPostTextarea.value = '';
        showNotification('Posted to community');
    }
});

// Helper function to add post to UI
function addPostToUI(post) {
    const postsContainer = document.querySelector('.community-posts');
    const postElement = document.createElement('div');
    postElement.className = 'post';
    
    const timeAgo = getTimeAgo(new Date(post.timestamp));
    
    postElement.innerHTML = `
        <div class="post-header">
            <span class="user">Anonymous User</span>
            <span class="time">${timeAgo}</span>
        </div>
        <p>${escapeHtml(post.content)}</p>
        <div class="post-actions">
            <button data-id="${post.id}" class="like-btn">
                <i class="far fa-heart"></i> ${post.likes || 0}
            </button>
            <button data-id="${post.id}" class="comment-btn">
                <i class="far fa-comment"></i> ${post.comments?.length || 0}
            </button>
            <button data-id="${post.id}" class="support-btn">
                <i class="fas fa-hands-helping"></i> Support
            </button>
        </div>
    `;
    
    // Insert at the beginning
    if (postsContainer.firstChild) {
        postsContainer.insertBefore(postElement, postsContainer.firstChild);
    } else {
        postsContainer.appendChild(postElement);
    }
    
    // Add event listeners for the new post
    setupPostInteractions(postElement, post.id);
}

// Helper function to set up post interactions
function setupPostInteractions(postElement, postId) {
    const likeBtn = postElement.querySelector('.like-btn');
    const commentBtn = postElement.querySelector('.comment-btn');
    const supportBtn = postElement.querySelector('.support-btn');
    
    likeBtn?.addEventListener('click', () => {
        const post = communityPosts.find(p => p.id == postId);
        if (post) {
            post.likes = (post.likes || 0) + 1;
            localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
            likeBtn.innerHTML = `<i class="far fa-heart"></i> ${post.likes}`;
        }
    });
    
    commentBtn?.addEventListener('click', () => {
        const comment = prompt('Add a supportive comment:');
        if (comment) {
            const post = communityPosts.find(p => p.id == postId);
            if (post) {
                if (!post.comments) post.comments = [];
                post.comments.push({
                    id: Date.now(),
                    content: comment,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
                showNotification('Comment added');
            }
        }
    });
    
    supportBtn?.addEventListener('click', () => {
        showNotification('Support message sent to the poster');
    });
}

// Helper function to get current mood
function getCurrentMood() {
    const activeMood = document.querySelector('.mood-option.active');
    return activeMood ? activeMood.getAttribute('data-mood') : null;
}

// Helper function to show notification
function showNotification(message, duration = 3000) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4a6fa5';
    notification.style.color = 'white';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '50px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeIn 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// Helper function to get time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }
    
    return 'just now';
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Load community posts on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load existing community posts
    communityPosts.forEach(post => {
        addPostToUI(post);
    });
    
    // Set today's mood if already logged
    const today = new Date().toISOString().split('T')[0];
    const todayMood = moodData.find(entry => entry.date === today);
    if (todayMood) {
        const moodElement = document.querySelector(`.mood-option[data-mood="${todayMood.mood}"]`);
        if (moodElement) {
            moodElement.classList.add('active');
        }
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;
    document.head.appendChild(style);
});

// Voice emotion detection (if browser supports)
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'btn btn-outline';
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Journal';
    voiceBtn.style.marginTop = '1rem';
    
    voiceBtn.addEventListener('click', () => {
        if (voiceBtn.classList.contains('listening')) {
            recognition.stop();
            voiceBtn.classList.remove('listening');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Journal';
        } else {
            recognition.start();
            voiceBtn.classList.add('listening');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Listening';
        }
    });
    
    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        moodJournalTextarea.value = transcript;
    };
    
    recognition.onend = () => {
        if (voiceBtn.classList.contains('listening')) {
            voiceBtn.classList.remove('listening');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Journal';
        }
    };
    
    // Add voice button after the textarea
    moodJournalTextarea.parentNode.insertBefore(voiceBtn, moodJournalTextarea.nextSibling);
}

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.mood-option, .meditation-card, .post');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 50) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animation
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.mood-option, .meditation-card, .post');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Initial check
    animateOnScroll();
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);
