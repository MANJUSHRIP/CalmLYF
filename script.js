// Global State
const state = {
    currentMood: null,
    moodHistory: JSON.parse(localStorage.getItem('moodHistory')) || [],
    journalEntries: JSON.parse(localStorage.getItem('journalEntries')) || [],
    communityPosts: JSON.parse(localStorage.getItem('communityPosts')) || [],
    userStats: JSON.parse(localStorage.getItem('userStats')) || {
        moodEntries: 24,
        journalEntries: 12,
        streak: 8,
        calmCoins: 450
    }
};

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        navigateToSection(section);
    });
});

function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo(0, 0);

    // Initialize section-specific content
    if (sectionId === 'mood') {
        initMoodChart();
    } else if (sectionId === 'journal') {
        displayJournalEntries();
    } else if (sectionId === 'community') {
        displayCommunityPosts();
    }
}

// Mood Selection
document.querySelectorAll('.mood-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        state.currentMood = option.getAttribute('data-mood');
        document.getElementById('moodDetails').style.display = 'block';
        document.getElementById('moodInsights').style.display = 'none';
    });
});

function saveMood() {
    if (!state.currentMood) {
        alert('Please select a mood first');
        return;
    }

    const moodText = document.getElementById('moodText').value;
    const emotions = Array.from(document.querySelectorAll('.emotion-tags input:checked'))
        .map(input => input.value);

    const moodEntry = {
        mood: state.currentMood,
        text: moodText,
        emotions: emotions,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
    };

    state.moodHistory.push(moodEntry);
    localStorage.setItem('moodHistory', JSON.stringify(state.moodHistory));

    // Update stats
    state.userStats.moodEntries++;
    localStorage.setItem('userStats', JSON.stringify(state.userStats));

    // Show insights
    showMoodInsights(state.currentMood, emotions);

    // Reset form after small delay
    setTimeout(() => {
        document.getElementById('moodText').value = '';
        document.querySelectorAll('.emotion-tags input').forEach(input => input.checked = false);
        document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
        state.currentMood = null;
    }, 2000);
}

function showMoodInsights(mood, emotions) {
    const insightText = document.getElementById('insightText');
    const suggestedAction = document.getElementById('suggestedAction');

    const insights = {
        happy: {
            text: "Great! You're feeling happy. This is a wonderful state to be in. Keep nurturing the things that bring you joy!",
            action: "Share your happiness with someone you care about. Positive emotions are contagious!"
        },
        calm: {
            text: "You're in a calm state of mind. This is perfect for reflection and planning. Use this clarity wisely.",
            action: "Try journaling about your thoughts or practice a short meditation to deepen this calm."
        },
        neutral: {
            text: "You're feeling neutral. This is a balanced state. It's a good time to engage in activities that matter to you.",
            action: "Consider doing something you enjoy or connecting with someone meaningful."
        },
        anxious: {
            text: "You're experiencing anxiety. Remember, this is temporary and manageable. Let's work through this together.",
            action: "Try the 4-7-8 breathing exercise or use the grounding technique to calm your mind."
        },
        sad: {
            text: "You're feeling sad. It's okay to feel this way. Sadness is a natural emotion that helps us process experiences.",
            action: "Consider journaling, talking to someone you trust, or engaging in a comforting activity."
        },
        stressed: {
            text: "You're under stress. Take a moment to breathe and remember that you have the strength to handle this.",
            action: "Try a 1-minute calming break or use the panic SOS tool for immediate relief."
        }
    };

    const insight = insights[mood] || insights.neutral;
    insightText.textContent = insight.text;
    suggestedAction.textContent = insight.action;

    document.getElementById('moodDetails').style.display = 'none';
    document.getElementById('moodInsights').style.display = 'block';
}

// Mood Chart
function initMoodChart() {
    const canvas = document.getElementById('moodChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.offsetWidth - 40;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // Clear previous drawing
    ctx.clearRect(0, 0, width, height);

    // Get last 7 days of mood data
    const last7Days = getLast7DaysMood();

    // Simple bar chart
    const barWidth = width / 7;
    const moodValues = { happy: 5, calm: 4, neutral: 3, anxious: 2, sad: 1, stressed: 1 };

    last7Days.forEach((day, index) => {
        const moodValue = moodValues[day.mood] || 3;
        const barHeight = (moodValue / 5) * (height - 50);
        const x = index * barWidth + 10;
        const y = height - barHeight - 30;

        // Draw bar
        ctx.fillStyle = getMoodColor(day.mood);
        ctx.fillRect(x, y, barWidth - 10, barHeight);

        // Draw day label
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index], x + (barWidth - 10) / 2, height - 10);
    });
}

function getLast7DaysMood() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        const dayMood = state.moodHistory
            .filter(entry => entry.date === dateStr)
            .pop() || { mood: 'neutral' };
        days.push(dayMood);
    }
    return days;
}

function getMoodColor(mood) {
    const colors = {
        happy: '#10b981',
        calm: '#06b6d4',
        neutral: '#f59e0b',
        anxious: '#f97316',
        sad: '#8b5cf6',
        stressed: '#ef4444'
    };
    return colors[mood] || '#6366f1';
}

// Tools
function startBreathing() {
    openToolModal('breathing');
}
function startPanicSOS() {
    openToolModal('panic');
}
function startGrounding() {
    openToolModal('grounding');
}
function startSleepStory() {
    openToolModal('sleep');
}
function startMindfulBreak() {
    openToolModal('mindful');
}
function startAnxietyTimer() {
    openToolModal('anxiety');
}

// Voice Recording
let mediaRec;
let chunks = [];

async function startVoiceRecord() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRec = new MediaRecorder(stream);
        chunks = [];

        mediaRec.ondataavailable = e => {
            chunks.push(e.data);
        };

        mediaRec.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            const player = document.getElementById('voicePlayer');
            if (player) {
                player.src = url;
            }
        };

        mediaRec.start();

        // Optional: Speech Recognition (if supported)
        try {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SR) {
                const r = new SR();
                r.lang = 'en-IN';
                r.continuous = true;
                r.onresult = (e) => {
                    const t = [...e.results].map(x => x[0].transcript).join(' ');
                    const textarea = document.getElementById('voiceTranscript');
                    if (textarea) {
                        textarea.value = t;
                    }
                };
                r.start();
            }
        } catch (err) {
            console.error('Speech recognition error', err);
        }

    } catch (err) {
        console.error('Recording error', err);
        alert('Please allow microphone permission.');
    }
}

function stopVoiceRecord() {
    try {
        if (mediaRec && mediaRec.state !== 'inactive') {
            mediaRec.stop();
        }
    } catch (err) {
        console.error('Stop error', err);
    }
}

function openToolModal(toolType) {
    const modal = document.getElementById('toolModal');
    const content = document.getElementById('toolContent');

    const tools = {
        breathing: `
            <h2>4-7-8 Breathing Exercise</h2>
            <p>This proven technique helps reduce anxiety and promote relaxation.</p>
            <div class="breathing-circle" id="breathingCircle">Breathe In</div>
            <div style="text-align: center; margin-top: 2rem;">
                <p id="breathingInstruction" style="font-size: 1.1rem; color: #6366f1; font-weight: 600;">
                    Breathe in for 4 counts
                </p>
                <button class="btn btn-primary" onclick="closeToolModal()">Done</button>
            </div>
        `,
        panic: `
            <h2>Panic Attack SOS</h2>
            <p>Follow these steps to calm your nervous system:</p>
            <div style="margin: 2rem 0;">
                <div style="background: #f0fdf4; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="color: #10b981; margin-bottom: 0.5rem;">Step 1: Recognize</h4>
                    <p>You're having a panic attack. This is temporary and you're safe.</p>
                </div>
                <div style="background: #f0fdf4; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="color: #10b981; margin-bottom: 0.5rem;">Step 2: Breathe</h4>
                    <p>Breathe slowly: In for 4, hold for 4, out for 6. Repeat 5 times.</p>
                </div>
                <div style="background: #f0fdf4; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="color: #10b981; margin-bottom: 0.5rem;">Step 3: Ground</h4>
                    <p>Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.</p>
                </div>
                <div style="background: #f0fdf4; padding: 1rem; border-radius: 8px;">
                    <h4 style="color: #10b981; margin-bottom: 0.5rem;">Step 4: Move</h4>
                    <p>Splash cold water on your face or go for a short walk.</p>
                </div>
            </div>
            <button class="btn btn-primary" onclick="closeToolModal()">I'm Feeling Better</button>
        `,
        grounding: `
            <h2>5-4-3-2-1 Grounding Technique</h2>
            <p>This emergency grounding exercise brings you back to the present moment.</p>
            <div style="margin: 2rem 0;">
                <div style="background: #ede9fe; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="color: #8b5cf6; margin-bottom: 0.5rem;">👀 5 Things You See</h4>
                    <p>Look around and name 5 things you can see right now.</p>
                </div>
                <div style="background: #ede9fe; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="color: #8b5cf6; margin-bottom: 0.5rem;">✋ 4 Things You Can Touch</h4>
                    <p>Feel 4 different textures around you.</p>
                </div>
                <div style="background: #ede9fe; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="color: #8b5cf6; margin-bottom: 0.5rem;">👂 3 Things You Hear</h4>
                    <p>Listen carefully and identify 3 sounds.</p>
                </div>
                <div style="background: #ede9fe; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="color: #8b5cf6; margin-bottom: 0.5rem;">👃 2 Things You Smell</h4>
                    <p>Notice 2 scents around you.</p>
                </div>
                <div style="background: #ede9fe; padding: 1.5rem; border-radius: 8px;">
                    <h4 style="color: #8b5cf6; margin-bottom: 0.5rem;">👅 1 Thing You Taste</h4>
                    <p>Notice the taste in your mouth.</p>
                </div>
            </div>
            <button class="btn btn-primary" onclick="closeToolModal()">I'm Grounded</button>
        `,
        sleep: `
            <h2>Sleep Story - The Peaceful Garden</h2>
            <p>Close your eyes and listen to this peaceful scene...</p>

            <audio id="sleepAudio" controls autoplay style="width: 100%; margin: 1rem 0 2rem 0;">
                <source src="peaceful-garden.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>

            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; line-height: 1.8;">
                <p>You find yourself in a beautiful garden at twilight. Soft moonlight filters through ancient trees. A gentle breeze carries the scent of jasmine and roses. You walk along a winding path lined with glowing lanterns...</p>
                <p style="margin-top: 1rem;">The sound of a distant fountain creates a soothing rhythm. Your muscles relax with each step. The cool grass beneath your feet feels grounding and peaceful...</p>
                <p style="margin-top: 1rem;">You reach a cozy pavilion with soft cushions. As you settle in, your eyelids grow heavy. The world around you fades gently into darkness...</p>
            </div>

            <button class="btn btn-primary" onclick="closeToolModal()">Good Night</button>
        `,
        mindful: `
            <h2>1-Minute Mindful Break</h2>
            <p>Take a moment to pause and be present.</p>
            <div style="text-align: center; margin: 2rem 0;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🧘</div>
                <div id="mindfulTimer" style="font-size: 2rem; font-weight: bold; color: #6366f1; margin-bottom: 1rem;">60</div>
                <p style="color: #6b7280; margin-bottom: 1rem;">Close your eyes. Breathe naturally. Notice your thoughts without judgment.</p>
                <button class="btn btn-primary" id="mindfulBtn" onclick="startMindfulTimer()">Start Timer</button>
            </div>
        `,
        anxiety: `
            <h2>Anxiety Episode Tracker</h2>
            <p>Track your anxiety to understand patterns and triggers.</p>
            <div style="margin: 2rem 0;">
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Anxiety Level (1-10)</label>
                    <input type="range" min="1" max="10" value="5" style="width: 100%; cursor: pointer;">
                    <p style="text-align: center; color: #6366f1; font-weight: 600;">5</p>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">What triggered this?</label>
                    <textarea placeholder="Describe the trigger..." style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 6px; font-family: inherit;"></textarea>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Physical symptoms?</label>
                    <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
                        <label><input type="checkbox"> Racing heart</label>
                        <label><input type="checkbox"> Shortness of breath</label>
                        <label><input type="checkbox"> Trembling</label>
                        <label><input type="checkbox"> Dizziness</label>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary" onclick="closeToolModal()">Save & Close</button>
        `
    };

    content.innerHTML = tools[toolType] || tools.breathing;
    modal.classList.add('active');
}

function closeToolModal() {
    document.getElementById('toolModal').classList.remove('active');
}

// Mindful Timer
function startMindfulTimer() {
    let seconds = 60;
    const btn = document.getElementById('mindfulBtn');
    if (!btn) return;

    btn.disabled = true;
    btn.textContent = 'Timer Running...';

    const interval = setInterval(() => {
        seconds--;
        const timerEl = document.getElementById('mindfulTimer');
        if (timerEl) timerEl.textContent = seconds;

        if (seconds === 0) {
            clearInterval(interval);
            btn.disabled = false;
            btn.textContent = 'Complete!';
            alert('Great job! You completed your mindful break.');
        }
    }, 1000);
}

// Journal
function saveJournalEntry() {
    const title = document.getElementById('journalTitle').value || 'Untitled';
    const text = document.getElementById('journalText').value;

    if (!text.trim()) {
        alert('Please write something in your journal');
        return;
    }

    const tags = Array.from(document.querySelectorAll('.journal-tags input:checked'))
        .map(input => input.value);

    const entry = {
        id: Date.now(),
        title: title,
        text: text,
        tags: tags,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };

    state.journalEntries.unshift(entry);
    localStorage.setItem('journalEntries', JSON.stringify(state.journalEntries));

    // Update stats
    state.userStats.journalEntries++;
    localStorage.setItem('userStats', JSON.stringify(state.userStats));

    // Clear form
    document.getElementById('journalTitle').value = '';
    document.getElementById('journalText').value = '';
    document.querySelectorAll('.journal-tags input').forEach(input => input.checked = false);
    alert('Journal entry saved!');
    displayJournalEntries();
}

function displayJournalEntries() {
    const list = document.getElementById('journalList');
    if (!list) return;

    list.innerHTML = '';
    if (state.journalEntries.length === 0) {
        list.innerHTML = '<p style="color: #6b7280; text-align: center;">No entries yet. Start journaling!</p>';
        return;
    }

    state.journalEntries.slice(0, 10).forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'journal-entry';
        entryDiv.innerHTML = `
            <div class="journal-entry-date">${entry.date} at ${entry.time}</div>
            <div class="journal-entry-title">${entry.title}</div>
            <div class="journal-entry-text">${entry.text.substring(0, 150)}...</div>
            ${entry.tags.length > 0 ? `
                <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${entry.tags.map(tag => `
                        <span style="background: #6366f1; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">${tag}</span>
                    `).join('')}
                </div>
            ` : ''}
        `;
        list.appendChild(entryDiv);
    });
}

// Community
function switchCommunityTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(tabName);
    if (targetTab) targetTab.classList.add('active');

    const eventTarget = window.event?.target;
    if (eventTarget && eventTarget.classList.contains('tab-btn')) {
        eventTarget.classList.add('active');
    }
}

function displayCommunityPosts() {
    // Placeholder if you later load posts dynamically
    const feed = document.getElementById('feed');
    if (!feed) return;
}

function likePost(btn) {
    const text = btn.textContent.trim();
    const parts = text.split(' ');
    const last = parts[parts.length - 1];
    const count = parseInt(last) || 0;
    btn.innerHTML = `<i class="fas fa-heart"></i> ${count + 1}`;
    btn.style.color = '#ef4444';
}

function replyPost(btn) {
    alert('Reply feature coming soon!');
}

function joinGroup(btn) {
    btn.textContent = 'Joined ✓';
    btn.disabled = true;
    btn.style.opacity = '0.6';
}

function shareStory() {
    const text = document.getElementById('shareText').value;
    if (!text.trim()) {
        alert('Please write something to share');
        return;
    }

    const tags = Array.from(document.querySelectorAll('.share-tags input:checked'))
        .map(input => input.value);

    const post = {
        id: Date.now(),
        content: text,
        tags: tags,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0
    };

    state.communityPosts.push(post);
    localStorage.setItem('communityPosts', JSON.stringify(state.communityPosts));

    document.getElementById('shareText').value = '';
    document.querySelectorAll('.share-tags input').forEach(input => input.checked = false);
    alert('Your story has been shared anonymously!');
}

// Profile
function savePreferences() {
    const style = document.getElementById('aiStyle').value;
    const language = document.getElementById('language').value;
    localStorage.setItem('userPreferences', JSON.stringify({
        aiStyle: style,
        language: language
    }));
    alert('Preferences saved!');
}

// Crisis Detection
function checkForCrisisKeywords(text) {
    const keywords = ['hopeless', 'disappear', 'end it', 'suicide', 'kill myself', 'hurt myself', 'no point'];
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
}

// Monitor mood/journal/share input for crisis keywords
document.addEventListener('input', (e) => {
    if (e.target.id === 'moodText' || e.target.id === 'journalText' || e.target.id === 'shareText') {
        if (checkForCrisisKeywords(e.target.value)) {
            showCrisisModal();
        }
    }
});

function showCrisisModal() {
    document.getElementById('crisisModal').classList.add('active');
}

function closeCrisisModal() {
    document.getElementById('crisisModal').classList.remove('active');
}

function connectWithTherapist() {
    alert('Connecting you with an on-call therapist. Please wait...');
    // In a real app, this would connect to a backend service
}

// Login modal
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('active');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('active');
}

// Role switch (Client / Doctor)
function switchRole(role) {
    // Tabs
    document.querySelectorAll('.role-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeTab = document.querySelector(`.role-tab[data-role="${role}"]`);
    if (activeTab) activeTab.classList.add('active');

    // Forms
    document.querySelectorAll('.role-form').forEach(form => {
        form.classList.remove('active');
    });
    if (role === 'client') {
        document.getElementById('clientForm').classList.add('active');
    } else {
        document.getElementById('doctorForm').classList.add('active');
    }
}

// Client form submit
function handleClientSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const age = document.getElementById('clientAge').value;
    const email = document.getElementById('clientEmail').value.trim();
    const mobile = document.getElementById('clientMobile').value.trim();
    const gender = document.getElementById('clientGender').value;

    if (mobile.length < 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
    }

    const clientData = {
        role: 'client',
        name,
        age,
        email,
        mobile,
        gender,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('calmlyfUser', JSON.stringify(clientData));

    alert('Client login successful!');
    closeLoginModal();
    navigateToSection('mood');
}

// Doctor form submit
function handleDoctorSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('doctorName').value.trim();
    const age = document.getElementById('doctorAge').value;
    const email = document.getElementById('doctorEmail').value.trim();
    const mobile = document.getElementById('doctorMobile').value.trim();
    const gender = document.getElementById('doctorGender').value;
    const specialization = document.getElementById('doctorSpecialization').value.trim();
    const regNo = document.getElementById('doctorRegNo').value.trim();

    if (mobile.length < 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
    }

    const doctorData = {
        role: 'doctor',
        name,
        age,
        email,
        mobile,
        gender,
        specialization,
        regNo,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('calmlyfUser', JSON.stringify(doctorData));

    alert('Doctor login successful!');
    closeLoginModal();
    navigateToSection('profile');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load user preferences
    const prefs = JSON.parse(localStorage.getItem('userPreferences')) || {};
    if (prefs.aiStyle) {
        document.getElementById('aiStyle').value = prefs.aiStyle;
    }
    if (prefs.language) {
        document.getElementById('language').value = prefs.language;
    }

    // Display initial data
    displayJournalEntries();

    // Show home section by default
    navigateToSection('home');

    // Voice record buttons
    const recBtn = document.getElementById('voiceRecord');
    const stopBtn = document.getElementById('voiceStop');

    if (recBtn) {
        recBtn.addEventListener('click', startVoiceRecord);
    }
    if (stopBtn) {
        stopBtn.addEventListener('click', stopVoiceRecord);
    }
});

// Hamburger menu (for mobile)
document.querySelector('.hamburger')?.addEventListener('click', () => {
    const menu = document.querySelector('.nav-menu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});