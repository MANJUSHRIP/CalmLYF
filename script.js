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
    },
    currentUserType: localStorage.getItem('userType') || null,
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true'
};

// Tool Card Flip Animation
function flipCard(element) {
    const wrapper = element.closest('.tool-card-wrapper');
    wrapper.classList.toggle('flipped');
}

// Navigation - Show website directly on load
document.addEventListener('DOMContentLoaded', () => {
    // Show navbar and all sections directly
    document.querySelector('.navbar').classList.add('visible');
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('visible');
    });
    // Navigate to home
    navigateToSection('home');
});

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
    document.getElementById(sectionId).classList.add('active');

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

    // Reset form
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

function startGuidedMeditation() {
    openToolModal('meditation');
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
            <p>Close your eyes and imagine this peaceful scene...</p>
            <div style="text-align: center; margin: 2rem 0;">
                <button class="btn btn-primary" id="sleepPlayBtn" onclick="playSleepStory()" style="font-size: 1.1rem; padding: 0.75rem 2rem;">
                    <i class="fas fa-play"></i> Play Story (5 min)
                </button>
            </div>
            <div id="sleepStoryText" style="background: linear-gradient(135deg, #1e293b, #0f172a); color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; line-height: 1.8;">
                <p>You find yourself in a beautiful garden at twilight. Soft moonlight filters through ancient trees. A gentle breeze carries the scent of jasmine and roses. You walk along a winding path lined with glowing lanterns...</p>
                <p style="margin-top: 1rem;">The sound of a distant fountain creates a soothing rhythm. Your muscles relax with each step. The cool grass beneath your feet feels grounding and peaceful...</p>
                <p style="margin-top: 1rem;">You reach a cozy pavilion with soft cushions. As you settle in, your eyelids grow heavy. The world around you fades gently into darkness...</p>
            </div>
            <div style="text-align: center;">
                <button class="btn btn-secondary" onclick="closeToolModal()">Good Night</button>
            </div>
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
        `,
        meditation: `
            <h2>Guided Meditation</h2>
            <p>Find inner peace and calm with this guided meditation session.</p>
            <div style="background: linear-gradient(135deg, #f3e8ff, #fce7f3); padding: 2rem; border-radius: 15px; margin: 2rem 0; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🧘</div>
                <p style="font-size: 1.1rem; color: #6366f1; font-weight: 600; margin-bottom: 1rem;">10-Minute Meditation</p>
                <p style="color: #6b7280; margin-bottom: 1.5rem;">Close your eyes and follow along as we guide you through a peaceful journey of relaxation and mindfulness.</p>
                <button class="btn btn-primary" id="meditationPlayBtn" onclick="playGuidedMeditation()" style="font-size: 1rem; padding: 0.75rem 2rem;">
                    <i class="fas fa-play"></i> Start Meditation
                </button>
            </div>
            <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 10px; margin: 2rem 0;">
                <h4 style="color: #1f2937; margin-bottom: 1rem;">Meditation Steps:</h4>
                <ol style="color: #6b7280; line-height: 1.8; text-align: left;">
                    <li><strong>Find a comfortable position</strong> - Sit or lie down in a relaxed posture</li>
                    <li><strong>Close your eyes gently</strong> - Let your eyelids rest naturally</li>
                    <li><strong>Focus on your breath</strong> - Notice the natural rhythm of breathing</li>
                    <li><strong>Let thoughts pass</strong> - Observe thoughts without judgment</li>
                    <li><strong>Return to breath</strong> - Gently bring focus back when mind wanders</li>
                    <li><strong>Slowly return</strong> - Open eyes gently when meditation ends</li>
                </ol>
            </div>
            <div style="background: #ede9fe; padding: 1.5rem; border-radius: 10px; margin: 2rem 0;">
                <h4 style="color: #8b5cf6; margin-bottom: 1rem;">Benefits:</h4>
                <ul style="color: #6b7280; line-height: 1.8; text-align: left;">
                    <li>✓ Reduces stress and anxiety</li>
                    <li>✓ Improves focus and concentration</li>
                    <li>✓ Enhances emotional well-being</li>
                    <li>✓ Promotes better sleep</li>
                    <li>✓ Increases self-awareness</li>
                </ul>
            </div>
            <button class="btn btn-secondary" onclick="closeToolModal()" style="width: 100%; margin-top: 1rem;">Close</button>
        `
    };

    content.innerHTML = tools[toolType] || tools.breathing;
    modal.classList.add('active');
}

function closeToolModal() {
    document.getElementById('toolModal').classList.remove('active');
}

function startMindfulTimer() {
    let seconds = 60;
    const btn = document.getElementById('mindfulBtn');
    btn.disabled = true;
    btn.textContent = 'Timer Running...';

    const interval = setInterval(() => {
        seconds--;
        document.getElementById('mindfulTimer').textContent = seconds;

        if (seconds === 0) {
            clearInterval(interval);
            btn.disabled = false;
            btn.textContent = 'Complete!';
            alert('Great job! You completed your mindful break.');
        }
    }, 1000);
}

function playSleepStory() {
    const btn = document.getElementById('sleepPlayBtn');
    const storyText = document.getElementById('sleepStoryText');
    
    if (btn.textContent.includes('Play')) {
        // Start playing
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause Story';
        btn.style.background = '#ef4444';
        
        // Use Web Speech API for text-to-speech
        const storyContent = "You find yourself in a beautiful garden at twilight. Soft moonlight filters through ancient trees. A gentle breeze carries the scent of jasmine and roses. You walk along a winding path lined with glowing lanterns. The sound of a distant fountain creates a soothing rhythm. Your muscles relax with each step. The cool grass beneath your feet feels grounding and peaceful. You reach a cozy pavilion with soft cushions. As you settle in, your eyelids grow heavy. The world around you fades gently into darkness.";
        
        // Create speech synthesis
        const utterance = new SpeechSynthesisUtterance(storyContent);
        utterance.rate = 0.8; // Slower speech for relaxation
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
            btn.innerHTML = '<i class="fas fa-play"></i> Play Story (5 min)';
            btn.style.background = '';
            alert('Sleep story completed. Sweet dreams! 🌙');
        };
        
        window.speechSynthesis.speak(utterance);
        
        // Add visual feedback
        storyText.style.opacity = '0.7';
        storyText.style.borderLeft = '4px solid #10b981';
    } else {
        // Pause playing
        window.speechSynthesis.cancel();
        btn.innerHTML = '<i class="fas fa-play"></i> Play Story (5 min)';
        btn.style.background = '';
        storyText.style.opacity = '1';
        storyText.style.borderLeft = 'none';
    }
}

function playGuidedMeditation() {
    const btn = document.getElementById('meditationPlayBtn');
    
    if (btn.textContent.includes('Start')) {
        // Start meditation
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause Meditation';
        btn.style.background = '#ef4444';
        
        // Guided meditation script
        const meditationScript = `
            Let's begin this peaceful meditation journey.
            Find a comfortable position, sitting or lying down.
            Close your eyes gently.
            
            Take a deep breath in through your nose for a count of four.
            Hold it for a moment.
            Now exhale slowly through your mouth for a count of six.
            
            Let's do that again. Breathe in for four counts.
            Hold for a moment.
            Exhale for six counts.
            
            As you continue breathing naturally, notice the sensation of each breath.
            The cool air entering your nostrils as you inhale.
            The warm air leaving as you exhale.
            
            Your body is becoming heavier and more relaxed with each breath.
            Your shoulders are dropping.
            Your jaw is loosening.
            
            If any thoughts arise, simply observe them without judgment.
            Like clouds passing through the sky.
            Gently return your focus to your breath.
            
            You are safe. You are calm. You are at peace.
            
            Continue breathing deeply and naturally.
            Feel the stillness within you.
            Feel the peace surrounding you.
            
            With each exhale, release any tension or worry.
            With each inhale, bring in calm and serenity.
            
            You are doing beautifully.
            Stay in this peaceful space for as long as you need.
            
            When you are ready, begin to deepen your breath.
            Slowly bring awareness back to your body.
            Feel your connection to the ground beneath you.
            
            Gently wiggle your fingers and toes.
            When you are ready, slowly open your eyes.
            
            You have completed this meditation.
            Carry this peace with you throughout your day.
            Namaste.
        `;
        
        // Create speech synthesis
        const utterance = new SpeechSynthesisUtterance(meditationScript);
        utterance.rate = 0.75; // Slower speech for meditation
        utterance.pitch = 0.9; // Slightly lower pitch for calming effect
        utterance.volume = 1;
        
        utterance.onend = () => {
            btn.innerHTML = '<i class="fas fa-play"></i> Start Meditation';
            btn.style.background = '';
            alert('Meditation complete. Namaste! 🧘');
        };
        
        window.speechSynthesis.speak(utterance);
    } else {
        // Pause meditation
        window.speechSynthesis.cancel();
        btn.innerHTML = '<i class="fas fa-play"></i> Start Meditation';
        btn.style.background = '';
    }
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
            ${entry.tags.length > 0 ? `<div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${entry.tags.map(tag => `<span style="background: #6366f1; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">${tag}</span>`).join('')}
            </div>` : ''}
        `;
        list.appendChild(entryDiv);
    });
}

// Community
function switchCommunityTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function displayCommunityPosts() {
    const feed = document.getElementById('feed');
    // Posts are already displayed in HTML, but we can add dynamic posts here
}

function likePost(btn) {
    const count = parseInt(btn.textContent.split(' ')[1]);
    btn.textContent = `<i class="fas fa-heart"></i> ${count + 1}`;
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

// Monitor mood input for crisis keywords
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
});

// Hamburger menu (for mobile)
document.querySelector('.hamburger')?.addEventListener('click', () => {
    const menu = document.querySelector('.nav-menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

// Auth Modal Functions
function openAuthModal(tab = 'signup') {
    const modal = document.getElementById('authModal');
    modal.style.display = 'flex';
    switchAuthTab(tab);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
}

function switchAuthTab(tab) {
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected form
    document.getElementById(tab + '-form').classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // Store user data in localStorage
    const userData = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    alert('Account created successfully! Welcome to CalmLYF');
    closeAuthModal();
    navigateToSection('mood');
}

function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // Simple login validation (in real app, this would be server-side)
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData && userData.email === email && userData.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        alert('Login successful! Welcome back to CalmLYF');
        closeAuthModal();
        navigateToSection('mood');
    } else {
        alert('Invalid email or password. Please try again or create a new account.');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const authModal = document.getElementById('authModal');
    if (event.target === authModal) {
        closeAuthModal();
    }
});

// Meditation Functions
let currentAudio = null;

function playMeditationVideo(type) {
    const modal = document.getElementById('meditationModal');
    const content = document.getElementById('meditationContent');
    
    const videos = {
        calm: {
            title: '5-Minute Calm Meditation',
            description: 'A quick meditation perfect for busy days. Close your eyes and follow along as we guide you through a peaceful journey of relaxation.',
            duration: '5 minutes'
        },
        focus: {
            title: '10-Minute Focus Meditation',
            description: 'Enhance your concentration and mental clarity. This meditation helps you achieve deep focus and mental clarity for better productivity.',
            duration: '10 minutes'
        },
        rest: {
            title: '15-Minute Deep Rest',
            description: 'Complete relaxation and restoration. Let go of all tension and drift into a state of complete peace and tranquility.',
            duration: '15 minutes'
        },
        anxiety: {
            title: 'Anxiety Relief Meditation',
            description: 'Calm your mind and body with this specially designed meditation for anxiety relief. Release worry and find inner peace.',
            duration: '8 minutes'
        }
    };
    
    const video = videos[type] || videos.calm;
    
    content.innerHTML = `
        <h2>${video.title}</h2>
        <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1)); padding: 3rem; border-radius: 15px; margin: 2rem 0; text-align: center;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">🧘</div>
            <p style="font-size: 1.1rem; color: var(--dark); margin-bottom: 1rem;">${video.description}</p>
            <p style="color: var(--gray); font-size: 0.95rem;">Duration: ${video.duration}</p>
        </div>
        <div style="text-align: center; margin: 2rem 0;">
            <button class="btn btn-primary" onclick="startMeditationVideo('${type}')" style="font-size: 1.1rem; padding: 0.75rem 2rem;">
                <i class="fas fa-play"></i> Start Meditation
            </button>
        </div>
        <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 10px; margin-top: 2rem;">
            <h4 style="color: var(--dark); margin-bottom: 1rem;">Tips for Best Results:</h4>
            <ul style="text-align: left; color: var(--gray); line-height: 1.8;">
                <li>Find a quiet, comfortable place</li>
                <li>Sit or lie down in a relaxed position</li>
                <li>Use headphones for better audio experience</li>
                <li>Practice regularly for best results</li>
            </ul>
        </div>
        <button class="btn btn-secondary" onclick="closeMeditationModal()" style="width: 100%; margin-top: 1.5rem;">Close</button>
    `;
    
    modal.classList.add('active');
}

function startMeditationVideo(type) {
    const modal = document.getElementById('meditationModal');
    const content = document.getElementById('meditationContent');
    
    const meditations = {
        calm: {
            title: '5-Minute Calm Meditation',
            steps: [
                { time: '0:00', instruction: 'Find a comfortable position. Close your eyes gently.' },
                { time: '0:30', instruction: 'Take a deep breath in through your nose for 4 counts.' },
                { time: '1:00', instruction: 'Hold the breath for 4 counts.' },
                { time: '1:30', instruction: 'Exhale slowly through your mouth for 6 counts.' },
                { time: '2:00', instruction: 'Notice the natural rhythm of your breathing.' },
                { time: '2:30', instruction: 'With each breath, feel your body becoming lighter.' },
                { time: '3:00', instruction: 'Imagine a peaceful blue light surrounding you.' },
                { time: '3:30', instruction: 'Let all tension melt away from your shoulders.' },
                { time: '4:00', instruction: 'You are safe, calm, and at peace.' },
                { time: '4:30', instruction: 'Slowly bring awareness back to the room.' },
                { time: '5:00', instruction: 'Gently open your eyes. Namaste.' }
            ]
        },
        focus: {
            title: '10-Minute Focus Meditation',
            steps: [
                { time: '0:00', instruction: 'Sit with your spine straight. Hands resting on your lap.' },
                { time: '0:45', instruction: 'Close your eyes. Begin observing your natural breath.' },
                { time: '1:30', instruction: 'Focus on the sensation of breath entering your nostrils.' },
                { time: '2:30', instruction: 'When your mind wanders, gently bring it back to the breath.' },
                { time: '3:30', instruction: 'Visualize a bright light at the center of your forehead.' },
                { time: '4:30', instruction: 'This light represents your focus and clarity.' },
                { time: '5:30', instruction: 'Feel your mind becoming sharper and more alert.' },
                { time: '6:30', instruction: 'Your concentration is deepening with each breath.' },
                { time: '7:30', instruction: 'You are fully present and focused.' },
                { time: '8:30', instruction: 'Begin to deepen your breath gradually.' },
                { time: '9:00', instruction: 'Slowly open your eyes, feeling refreshed and focused.' },
                { time: '10:00', instruction: 'You are ready to tackle any task with clarity.' }
            ]
        },
        rest: {
            title: '15-Minute Deep Rest',
            steps: [
                { time: '0:00', instruction: 'Lie down on your back in a comfortable position.' },
                { time: '1:00', instruction: 'Let your arms rest by your sides, palms facing up.' },
                { time: '2:00', instruction: 'Begin with slow, deep breaths. Inhale for 4, exhale for 4.' },
                { time: '3:00', instruction: 'Scan your body from head to toe, releasing tension.' },
                { time: '4:00', instruction: 'Feel your head and neck becoming heavy and relaxed.' },
                { time: '5:00', instruction: 'Your shoulders are dropping. All tension is melting away.' },
                { time: '6:00', instruction: 'Your chest and abdomen are rising and falling gently.' },
                { time: '7:00', instruction: 'Your legs are becoming heavier, sinking into the ground.' },
                { time: '8:00', instruction: 'You are in a state of complete relaxation.' },
                { time: '9:00', instruction: 'Imagine yourself in a beautiful, peaceful place.' },
                { time: '10:00', instruction: 'You are safe, protected, and deeply at peace.' },
                { time: '11:00', instruction: 'Your body is healing and rejuvenating.' },
                { time: '12:00', instruction: 'Stay in this peaceful state for as long as you need.' },
                { time: '13:00', instruction: 'When ready, begin to deepen your breath.' },
                { time: '14:00', instruction: 'Slowly open your eyes, feeling completely restored.' },
                { time: '15:00', instruction: 'Welcome back, refreshed and renewed.' }
            ]
        },
        anxiety: {
            title: 'Anxiety Relief Meditation',
            steps: [
                { time: '0:00', instruction: 'Sit comfortably. Place one hand on your heart.' },
                { time: '0:30', instruction: 'Feel your heartbeat. You are alive and safe.' },
                { time: '1:00', instruction: 'Breathe in slowly: 1, 2, 3, 4, 5.' },
                { time: '1:45', instruction: 'Hold: 1, 2, 3.' },
                { time: '2:15', instruction: 'Exhale slowly: 1, 2, 3, 4, 5, 6, 7.' },
                { time: '3:00', instruction: 'Repeat this breathing pattern. It calms your nervous system.' },
                { time: '4:00', instruction: 'Notice any anxious thoughts. Let them pass like clouds.' },
                { time: '5:00', instruction: 'You are not your anxiety. You are the observer.' },
                { time: '6:00', instruction: 'Feel your feet grounded to the earth.' },
                { time: '7:00', instruction: 'Visualize roots growing from your feet into the ground.' },
                { time: '8:00', instruction: 'You are stable, grounded, and secure.' },
                { time: '8:30', instruction: 'Slowly open your eyes. You are calm and in control.' }
            ]
        }
    };
    
    const meditation = meditations[type] || meditations.calm;
    
    // Get meditation background image based on type
    const backgroundImages = {
        calm: 'linear-gradient(135deg, rgba(230, 170, 207, 0.8), rgba(233, 114, 195, 0.8)), url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 600%27%3E%3Cdefs%3E%3ClinearGradient id=%27grad%27 x1=%270%25%27 y1=%270%25%27 x2=%27100%25%27 y2=%27100%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:%236366f1;stop-opacity:0.3%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:%2306b6d4;stop-opacity:0.3%27 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%27url(%23grad)%27 width=%271200%27 height=%27600%27/%3E%3Ccircle cx=%27200%27 cy=%27150%27 r=%27100%27 fill=%27%2306b6d4%27 opacity=%270.1%27/%3E%3Ccircle cx=%271000%27 cy=%27450%27 r=%27150%27 fill=%276366f1%27 opacity=%270.1%27/%3E%3C/svg%3E")',
        focus: 'linear-gradient(135deg, rgba(173, 205, 236, 0.8), rgba(91, 134, 235, 0.8)), url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 600%27%3E%3Cdefs%3E%3ClinearGradient id=%27grad2%27 x1=%270%25%27 y1=%270%25%27 x2=%27100%25%27 y2=%27100%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:%23fbbf24;stop-opacity:0.2%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:%23f59e0b;stop-opacity:0.2%27 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%27url(%23grad2)%27 width=%271200%27 height=%27600%27/%3E%3Cpath d=%27M0,300 Q300,200 600,300 T1200,300%27 stroke=%27%23fbbf24%27 stroke-width=%272%27 fill=%27none%27 opacity=%270.2%27/%3E%3C/svg%3E")',
        rest: 'linear-gradient(135deg, rgba(171, 237, 178, 0.8), rgba(29, 180, 18, 0.8)), url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 600%27%3E%3Cdefs%3E%3ClinearGradient id=%27grad3%27 x1=%270%25%27 y1=%270%25%27 x2=%27100%25%27 y2=%27100%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:%238b5cf6;stop-opacity:0.2%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:%236366f1;stop-opacity:0.2%27 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%27url(%23grad3)%27 width=%271200%27 height=%27600%27/%3E%3Ccircle cx=%27600%27 cy=%27300%27 r=%27200%27 fill=%27%238b5cf6%27 opacity=%270.05%27/%3E%3C/svg%3E")',
        anxiety: 'linear-gradient(135deg, rgba(219, 184, 228, 0.8), rgba(213, 162, 226, 0.8)), url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 600%27%3E%3Cdefs%3E%3ClinearGradient id=%27grad4%27 x1=%270%25%27 y1=%270%25%27 x2=%27100%25%27 y2=%27100%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:%2310b981;stop-opacity:0.2%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:%2306b6d4;stop-opacity:0.2%27 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%27url(%23grad4)%27 width=%271200%27 height=%27600%27/%3E%3Cpath d=%27M0,400 Q300,350 600,400 T1200,400%27 stroke=%27%2310b981%27 stroke-width=%273%27 fill=%27none%27 opacity=%270.15%27/%3E%3C/svg%3E")'
    };
    
    const meditationEmojis = {
        calm: '🌊',
        focus: '✨',
        rest: '🌙',
        anxiety: '🌿'
    };
    
    let html = `
        <h2>${meditation.title}</h2>
        <div style="background: ${backgroundImages[type] || backgroundImages.calm}; background-size: cover; background-position: center; color: white; padding: 3rem 2rem; border-radius: 15px; margin: 2rem 0; position: relative; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%); border-radius: 15px;"></div>
            <div style="position: relative; z-index: 1; text-align: center; width: 100%;">
                <div id="meditationEmoji" style="font-size: 6rem; margin-bottom: 1.5rem; animation: float 3s ease-in-out infinite;">
                    ${meditationEmojis[type] || '🧘‍♀️'}
                </div>
                <div id="meditationTimer" style="font-size: 3rem; font-weight: bold; color: #06b6d4; margin-bottom: 1.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">0:00</div>
                <button class="btn btn-primary" id="meditationPlayBtn" onclick="toggleMeditationPlayback()" style="font-size: 1rem; padding: 0.75rem 2rem; margin-bottom: 2rem;">
                    <i class="fas fa-play"></i> Start Meditation
                </button>
            </div>
            <div id="meditationSteps" style="max-height: 250px; overflow-y: auto; width: 100%; position: relative; z-index: 1;">
    `;
    
    meditation.steps.forEach((step, index) => {
        html += `
            <div id="step-${index}" style="padding: 1rem; margin-bottom: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 8px; border-left: 3px solid #06b6d4; backdrop-filter: blur(10px);">
                <div style="font-weight: 600; color: #06b6d4;">${step.time}</div>
                <div style="color: #e0e7ff; margin-top: 0.5rem;">${step.instruction}</div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        <style>
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            @keyframes breathe {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }
        </style>
        <button class="btn btn-secondary" onclick="closeMeditationModal()" style="width: 100%; margin-top: 1.5rem;">Close</button>
    `;
    
    content.innerHTML = html;
    modal.classList.add('active');
    
    // Store meditation data for playback
    window.currentMeditation = {
        type: type,
        steps: meditation.steps,
        currentStep: 0,
        isPlaying: false,
        startTime: null
    };
}

function closeMeditationModal() {
    document.getElementById('meditationModal').classList.remove('active');
    // Stop meditation if playing
    if (window.currentMeditation && window.currentMeditation.isPlaying) {
        stopMeditationPlayback();
    }
}

function toggleMeditationPlayback() {
    if (!window.currentMeditation) return;
    
    const btn = document.getElementById('meditationPlayBtn');
    
    if (window.currentMeditation.isPlaying) {
        // Pause
        stopMeditationPlayback();
        btn.innerHTML = '<i class="fas fa-play"></i> Resume Meditation';
        btn.style.background = '';
    } else {
        // Play
        startMeditationPlayback();
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause Meditation';
        btn.style.background = '#ef4444';
    }
}

function startMeditationPlayback() {
    if (!window.currentMeditation) return;
    
    window.currentMeditation.isPlaying = true;
    window.currentMeditation.startTime = Date.now() - (window.currentMeditation.elapsedTime || 0);
    
    // Parse total duration from last step
    const lastStep = window.currentMeditation.steps[window.currentMeditation.steps.length - 1];
    const totalSeconds = parseTimeToSeconds(lastStep.time);
    
    window.meditationInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - window.currentMeditation.startTime) / 1000);
        window.currentMeditation.elapsedTime = elapsed;
        
        // Update timer display
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('meditationTimer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update current step highlight
        let currentStepIndex = 0;
        for (let i = 0; i < window.currentMeditation.steps.length; i++) {
            const stepSeconds = parseTimeToSeconds(window.currentMeditation.steps[i].time);
            if (elapsed >= stepSeconds) {
                currentStepIndex = i;
            }
        }
        
        // Highlight current step
        document.querySelectorAll('[id^="step-"]').forEach((el, index) => {
            if (index === currentStepIndex) {
                el.style.background = 'rgba(6, 182, 212, 0.3)';
                el.style.borderLeft = '3px solid #10b981';
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                el.style.background = 'rgba(255,255,255,0.1)';
                el.style.borderLeft = '3px solid #06b6d4';
            }
        });
        
        // Check if meditation is complete
        if (elapsed >= totalSeconds) {
            stopMeditationPlayback();
            document.getElementById('meditationPlayBtn').innerHTML = '<i class="fas fa-check"></i> Meditation Complete!';
            document.getElementById('meditationPlayBtn').style.background = '#10b981';
            alert('🧘 Meditation Complete!\n\nWell done! You have completed your meditation session.\n\nTake a moment to notice how you feel.');
        }
    }, 1000);
}

function stopMeditationPlayback() {
    if (window.meditationInterval) {
        clearInterval(window.meditationInterval);
        window.meditationInterval = null;
    }
    if (window.currentMeditation) {
        window.currentMeditation.isPlaying = false;
    }
}

function parseTimeToSeconds(timeStr) {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function playTone(toneType) {
    // Stop any currently playing audio
    stopTone();
    
    // Create audio context for generating tones
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const tones = {
        binaural: {
            freq1: 100,
            freq2: 110,
            name: 'Binaural Beats',
            description: 'Theta waves (4-8 Hz) for deep meditation',
            type: 'sine'
        },
        ocean: {
            freq1: 80,
            freq2: 85,
            name: 'Ocean Waves',
            description: 'Soothing ocean sounds simulation',
            type: 'sine'
        },
        rain: {
            freq1: 120,
            freq2: 125,
            name: 'Forest Rain',
            description: 'Peaceful rain in nature',
            type: 'sine'
        },
        bowls: {
            freq1: 432,
            freq2: 440,
            name: 'Singing Bowls',
            description: 'Healing vibrations at 432 Hz',
            type: 'sine'
        },
        breeze: {
            freq1: 150,
            freq2: 160,
            name: 'Gentle Breeze',
            description: 'Soft wind through trees',
            type: 'sine'
        },
        fire: {
            freq1: 200,
            freq2: 210,
            name: 'Fireplace Crackling',
            description: 'Warm and cozy ambiance',
            type: 'sine'
        },
        zen: {
            freq1: 174,
            freq2: 180,
            name: 'Zen Garden',
            description: 'Peaceful meditation ambiance',
            type: 'sine'
        },
        heartbeat: {
            freq1: 60,
            freq2: 65,
            name: 'Heartbeat',
            description: 'Calming rhythmic pulse',
            type: 'sine'
        }
    };
    
    const tone = tones[toneType] || tones.binaural;
    
    try {
        // Create oscillators for binaural beats
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        // Set frequencies
        osc1.frequency.value = tone.freq1;
        osc2.frequency.value = tone.freq2;
        
        // Set wave type
        osc1.type = tone.type;
        osc2.type = tone.type;
        
        // Add filter for smoother sound
        filter.type = 'lowpass';
        filter.frequency.value = 5000;
        filter.Q.value = 1;
        
        // Set volume with fade in
        gain.gain.value = 0;
        gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 2);
        
        // Connect nodes
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(filter);
        filter.connect(audioContext.destination);
        
        // Start oscillators
        osc1.start();
        osc2.start();
        
        // Store reference for stopping
        currentAudio = {
            osc1: osc1,
            osc2: osc2,
            gain: gain,
            filter: filter,
            context: audioContext,
            startTime: Date.now()
        };
        
        // Show feedback with tone info
        alert(`🎵 Now Playing: ${tone.name}\n\n${tone.description}\n\nThis will play for 10 minutes.\nClick Stop to end anytime.`);
        
        // Auto-stop after 10 minutes
        setTimeout(() => {
            stopTone();
            alert('✨ Tone session complete!\n\nTake a moment to notice how you feel.');
        }, 600000);
        
    } catch (e) {
        alert('Audio playback not supported in your browser. Please use a modern browser like Chrome, Firefox, or Safari.');
    }
}

function stopTone() {
    if (currentAudio) {
        try {
            currentAudio.osc1.stop();
            currentAudio.osc2.stop();
            currentAudio = null;
        } catch (e) {
            // Already stopped
        }
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// AI Chat Support Functions
let currentLanguage = localStorage.getItem('chatLanguage') || 'en';
let isRecording = false;
let recognition = null;

// Initialize Speech Recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        // Set language based on current selection
        const languageMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'mr': 'mr-IN'
        };
        recognition.lang = languageMap[currentLanguage] || 'en-US';
        
        recognition.onstart = () => {
            isRecording = true;
            document.getElementById('listeningStatus').style.display = 'block';
            document.querySelector('.mic-btn').classList.add('recording');
        };
        
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            document.getElementById('chatInput').value = transcript;
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error !== 'no-speech') {
                alert('Error: ' + event.error);
            }
        };
        
        recognition.onend = () => {
            isRecording = false;
            document.getElementById('listeningStatus').style.display = 'none';
            document.querySelector('.mic-btn').classList.remove('recording');
        };
    }
}

function toggleVoiceInput() {
    if (!recognition) {
        initSpeechRecognition();
    }
    
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Simulate AI response with delay
    setTimeout(() => {
        const aiResponse = getAIResponse(message);
        addMessageToChat(aiResponse, 'ai');
        
        // Optionally speak the response
        speakResponse(aiResponse);
    }, 500);
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${escapeHtml(message)}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // AI responses in different languages
    const responses = {
        en: {
            greetings: [
                "Hello! I'm here to listen and support you. What's on your mind?",
                "Hi there! How can I help you today?",
                "I'm glad you reached out. What would you like to talk about?"
            ],
            stress: [
                "I understand you're feeling stressed. Try taking a few deep breaths. Would you like to try a breathing exercise?",
                "Stress can be overwhelming. Remember, you're not alone. What's causing your stress?",
                "It's okay to feel stressed. Let's work through this together. Can you tell me more?"
            ],
            anxiety: [
                "Anxiety can be challenging, but there are ways to manage it. Have you tried grounding techniques?",
                "I hear you. Anxiety is real, but remember - it will pass. Would you like some calming strategies?",
                "You're brave for sharing this. Let's focus on what you can control right now."
            ],
            sad: [
                "I'm sorry you're feeling sad. It's okay to feel this way. Would you like to talk about it?",
                "Sadness is a natural emotion. I'm here to listen. What's making you feel this way?",
                "Your feelings matter. Take your time, and remember - this feeling will pass."
            ],
            happy: [
                "That's wonderful to hear! I'm happy for you. What made you feel this way?",
                "Your happiness is contagious! Tell me more about what's making you smile.",
                "That's amazing! Keep spreading that positive energy!"
            ],
            help: [
                "I'm here to help! You can talk to me about anything - your feelings, worries, or just need someone to listen.",
                "Of course! I'm always here for you. What do you need help with?",
                "I'm ready to support you. What's on your mind?"
            ],
            default: [
                "Thank you for sharing that with me. How does that make you feel?",
                "I understand. Tell me more about what you're experiencing.",
                "That's important. How can I support you better?",
                "I appreciate you opening up. What would help you feel better right now?"
            ]
        },
        hi: {
            greetings: [
                "नमस्ते! मैं आपको सुनने और समर्थन देने के लिए यहाँ हूँ। आपके मन में क्या है?",
                "हाय! मैं आपकी कैसे मदद कर सकता हूँ?",
                "मुझे खुशी है कि आप यहाँ आए। आप किस बारे में बात करना चाहते हैं?"
            ],
            stress: [
                "मैं समझता हूँ कि आप तनाव में हैं। कुछ गहरी साँसें लेने की कोशिश करें। क्या आप साँस लेने का व्यायाम करना चाहेंगे?",
                "तनाव भारी हो सकता है। याद रखें, आप अकेले नहीं हैं। आपको क्या तनाव दे रहा है?",
                "यह ठीक है तनाव महसूस करना। आइए इसे एक साथ हल करते हैं।"
            ],
            anxiety: [
                "चिंता चुनौतीपूर्ण हो सकती है, लेकिन इसे प्रबंधित करने के तरीके हैं। क्या आपने ग्राउंडिंग तकनीकें आजमाई हैं?",
                "मैं आपकी बात सुन रहा हूँ। चिंता वास्तविक है, लेकिन याद रखें - यह गुजर जाएगी।",
                "आप साहसी हैं यह साझा करने के लिए। आइए अभी जो नियंत्रण में है उस पर ध्यान दें।"
            ],
            sad: [
                "मुझे खेद है कि आप उदास महसूस कर रहे हैं। यह ठीक है इस तरह महसूस करना। क्या आप इसके बारे में बात करना चाहेंगे?",
                "उदासी एक प्राकृतिक भावना है। मैं सुनने के लिए यहाँ हूँ। आपको यह कैसा महसूस हो रहा है?",
                "आपकी भावनाएँ महत्वपूर्ण हैं। समय लें, और याद रखें - यह भावना गुजर जाएगी।"
            ],
            happy: [
                "यह सुनकर बहुत खुशी हुई! मैं आपके लिए खुश हूँ। आपको यह कैसा महसूस हो रहा है?",
                "आपकी खुशी संक्रामक है! मुझे और बताएं कि आपको क्या मुस्कुरा रहा है।",
                "यह अद्भुत है! उस सकारात्मक ऊर्जा को फैलाते रहें!"
            ],
            help: [
                "मैं आपकी मदद करने के लिए यहाँ हूँ! आप मुझसे कुछ भी बात कर सकते हैं।",
                "बिल्कुल! मैं हमेशा आपके लिए यहाँ हूँ। आपको किस चीज़ में मदद चाहिए?",
                "मैं आपको समर्थन देने के लिए तैयार हूँ। आपके मन में क्या है?"
            ],
            default: [
                "आपकी बात साझा करने के लिए धन्यवाद। यह आपको कैसा महसूस कराता है?",
                "मैं समझता हूँ। मुझे और बताएं कि आप क्या अनुभव कर रहे हैं।",
                "यह महत्वपूर्ण है। मैं आपको बेहतर तरीके से कैसे समर्थन कर सकता हूँ?",
                "मैं सराहना करता हूँ कि आप खुल रहे हैं। अभी आपको बेहतर महसूस करने के लिए क्या चाहिए?"
            ]
        },
        mr: {
            greetings: [
                "नमस्कार! मी तुम्हाला ऐकण्यास आणि समर्थन देण्यास येथे आहे. तुमच्या मनात काय आहे?",
                "हाय! मी तुम्हाला कसे मदत करू शकतो?",
                "मला आनंद आहे की तुम्ही येथे आला. तुम्ही कशाबद्दल बोलू इच्छिता?"
            ],
            stress: [
                "मी समजतो की तुम्ही तणावात आहात. काही खोल श्वास घेण्याचा प्रयत्न करा. तुम्ही श्वास व्यायाम करू इच्छिता?",
                "तणाव भारी असू शकतो. लक्षात ठेवा, तुम्ही एकटे नाही आहात. तुम्हाला काय तणाव देत आहे?",
                "हे ठीक आहे तणाव महसूस करणे. आपण हे एकत्रितपणे सोडवूया."
            ],
            anxiety: [
                "चिंता आव्हानात्मक असू शकते, परंतु त्याचे व्यवस्थापन करण्याचे मार्ग आहेत. तुम्ही ग्राउंडिंग तंत्र वापरले आहेत?",
                "मी तुम्हाला ऐकत आहे. चिंता वास्तविक आहे, परंतु लक्षात ठेवा - हे जाईल.",
                "तुम्ही हे सामायिक करण्यासाठी साहसी आहात. आता आपण नियंत्रणात असलेल्या गोष्टींवर लक्ष केंद्रित करूया."
            ],
            sad: [
                "मला खेद आहे की तुम्ही उदास आहात. असे महसूस करणे ठीक आहे. तुम्ही याबद्दल बोलू इच्छिता?",
                "उदासी एक नैसर्गिक भावना आहे. मी ऐकण्यास येथे आहे. तुम्हाला हे कसे महसूस होत आहे?",
                "तुमच्या भावना महत्वाच्या आहेत. वेळ घ्या, आणि लक्षात ठेवा - हे भावना जाईल."
            ],
            happy: [
                "हे ऐकून खूप आनंद झाला! मी तुमच्यासाठी खुश आहे. तुम्हाला हे कसे महसूस होत आहे?",
                "तुमची खुशी संक्रामक आहे! मला अधिक सांगा की तुम्हाला काय हसवत आहे.",
                "हे अद्भुत आहे! ती सकारात्मक ऊर्जा पसरवत रहा!"
            ],
            help: [
                "मी तुम्हाला मदत करण्यासाठी येथे आहे! तुम्ही मला कशाही बद्दल बोलू शकता.",
                "अर्थातच! मी नेहमी तुमच्यासाठी येथे आहे. तुम्हाला कशात मदत हवी आहे?",
                "मी तुम्हाला समर्थन देण्यास तयार आहे. तुमच्या मनात काय आहे?"
            ],
            default: [
                "तुमची बाब सामायिक केल्याबद्दल धन्यवाद. हे तुम्हाला कसे महसूस करवते?",
                "मी समजतो. मला अधिक सांगा की तुम्ही काय अनुभवत आहात.",
                "हे महत्वाचे आहे. मी तुम्हाला अधिक चांगल्या प्रकारे कसे समर्थन करू शकतो?",
                "मी कौतुक करतो की तुम्ही खुल्या मनाने आहात. आता तुम्हाला चांगले महसूस करण्यासाठी काय हवे आहे?"
            ]
        }
    };
    
    const langResponses = responses[currentLanguage] || responses.en;
    let responseArray = langResponses.default;
    
    // Detect user intent and select appropriate response
    if (lowerMessage.match(/hello|hi|hey|greetings|नमस्ते|हाय|नमस्कार/i)) {
        responseArray = langResponses.greetings;
    } else if (lowerMessage.match(/stress|stressed|तनाव|तणाव/i)) {
        responseArray = langResponses.stress;
    } else if (lowerMessage.match(/anxiety|anxious|worried|worry|चिंता|चिंतित/i)) {
        responseArray = langResponses.anxiety;
    } else if (lowerMessage.match(/sad|sadness|unhappy|down|उदास|दुःख/i)) {
        responseArray = langResponses.sad;
    } else if (lowerMessage.match(/happy|glad|joy|great|खुश|आनंद/i)) {
        responseArray = langResponses.happy;
    } else if (lowerMessage.match(/help|assist|support|मदद|सहायता/i)) {
        responseArray = langResponses.help;
    }
    
    // Return random response from selected array
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

function speakResponse(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language for speech synthesis
    const languageMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'mr': 'mr-IN'
    };
    utterance.lang = languageMap[currentLanguage] || 'en-US';
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
}

function openLanguageSettings() {
    document.getElementById('languageModal').classList.add('active');
    updateLanguageCheckmarks();
}

function closeLanguageSettings() {
    document.getElementById('languageModal').classList.remove('active');
}

function updateLanguageCheckmarks() {
    // Hide all checkmarks
    document.querySelectorAll('.language-btn i').forEach(icon => {
        icon.style.opacity = '0';
    });
    
    // Show checkmark for current language
    const checkId = `check-${currentLanguage}`;
    const checkIcon = document.getElementById(checkId);
    if (checkIcon) {
        checkIcon.style.opacity = '1';
    }
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('chatLanguage', lang);
    
    // Update welcome message
    const welcomeMessages = {
        'en': "Hello! I'm here to listen and support you. How are you feeling today? You can type or use voice.",
        'hi': "नमस्ते! मैं आपको सुनने और समर्थन देने के लिए यहाँ हूँ। आप आज कैसा महसूस कर रहे हैं? आप टाइप कर सकते हैं या वॉयस का उपयोग कर सकते हैं।",
        'mr': "नमस्कार! मी तुम्हाला ऐकण्यास आणि समर्थन देण्यास येथे आहे. तुम्ही आज कसे महसूस करत आहात? तुम्ही टाइप करू शकता किंवा व्हॉइस वापरू शकता."
    };
    
    document.getElementById('welcomeMessage').textContent = welcomeMessages[lang] || welcomeMessages['en'];
    
    // Reinitialize speech recognition with new language
    if (recognition) {
        recognition.abort();
        recognition = null;
    }
    
    updateLanguageCheckmarks();
    
    // Show confirmation
    const langNames = { 'en': 'English', 'hi': 'हिंदी', 'mr': 'मराठी' };
    alert(`Language changed to ${langNames[lang]}`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize speech recognition
    initSpeechRecognition();
    
    // Load saved language
    const savedLanguage = localStorage.getItem('chatLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    // Close language modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('languageModal');
        if (event.target === modal) {
            closeLanguageSettings();
        }
    });
});
