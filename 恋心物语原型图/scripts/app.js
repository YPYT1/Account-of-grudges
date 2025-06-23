// 记仇小程序 - 主要JavaScript逻辑

const MOCK_TODAY = '2024-07-22'; // Use a fixed date for consistent mock data filtering
let grudgePage = 1;
const grudgesPerPage = 7;
let allUnresolvedGrudges = [];

const moods = {
    happy: { emoji: '😊', name: '开心', svg: '<svg class="mood-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', color: 'rgba(255, 223, 186, 0.7)'},
    sad: { emoji: '😢', name: '难过', svg: '<svg class="mood-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', color: 'rgba(173, 216, 230, 0.7)' },
    angry: { emoji: '😠', name: '生气', svg: '<svg class="mood-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M15 9l-1 1 1 1"></path><path d="M9 9l1 1-1 1"></path><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path></svg>', color: 'rgba(255, 192, 203, 0.7)' },
    surprised: { emoji: '😮', name: '惊讶', svg: '<svg class="mood-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>', color: 'rgba(255, 250, 205, 0.7)' },
    playful: { emoji: '😜', name: '调皮', svg: '<svg class="mood-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2"></path><path d="M15 9l-1-1-1 1"></path><path d="M9 9l1-1 1 1"></path></svg>', color: 'rgba(221, 160, 221, 0.7)' },
    neutral: { emoji: '😐', name: '一般', svg: '<svg class="mood-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 15s1.5-1 4-1 4 1 4 1"></path></svg>', color: 'rgba(211, 211, 211, 0.7)' },
};

// --- Data Management with localStorage ---
function loadGrudgesFromStorage() {
    const storedGrudges = localStorage.getItem('grudges');
    if (storedGrudges) {
        return JSON.parse(storedGrudges);
    }
    // Return empty array if nothing is stored
    return [];
}

function saveGrudgesToStorage(grudgesToSave) {
    localStorage.setItem('grudges', JSON.stringify(grudgesToSave));
}

function getInitialGrudges() {
    let data = loadGrudgesFromStorage();
    if (data.length === 0) {
        // If no data, populate with initial mock data and save
        data = [
            { id: 1, author: '我', text: '又忘了带钥匙，在门口等了半小时。', moodTag: 'angry', createdAt: "2024-07-21T20:00:00", status: 'unresolved' },
            { id: 2, author: '对方', text: '说好的一起看电影，结果睡着了。', moodTag: 'sad', createdAt: "2024-07-20T22:30:00", status: 'unresolved' },
            { id: 3, author: '我', text: '没吃到想吃的冰淇淋，不开心。', moodTag: 'sad', createdAt: "2024-07-19T18:00:00", status: 'unresolved' },
            { id: 4, author: '对方', text: '打游戏不理我。', moodTag: 'angry', createdAt: "2024-07-18T21:00:00", status: 'unresolved' },
            { id: 5, author: '我', text: '忘记了我们的纪念日。', moodTag: 'angry', createdAt: "2024-07-17T09:00:00", status: 'unresolved' },
            { id: 6, author: '对方', text: '又把臭袜子扔在沙发上。', moodTag: 'neutral', createdAt: "2024-07-16T12:00:00", status: 'unresolved' },
            { id: 7, author: '我', text: '偷偷帮我买了心心念念好久的东西！', moodTag: 'happy', createdAt: "2024-07-15T19:00:00", status: 'unresolved' },
            { id: 9, author: '对方', text: '主动承担了所有家务，感动！', createdAt: '2024-06-20T18:00:00', status: 'solved' },
            { id: 10, author: '我', text: '在我生病的时候一直照顾我。', createdAt: '2024-06-19T15:00:00', status: 'solved' },
            { id: 11, author: '对方', text: '记得我随口说的一句话，并为我实现了。', createdAt: '2024-06-18T13:00:00', status: 'solved' },
            { id: 8, author: '我', text: '家务分工不均的问题已沟通解决。', createdAt: '2024-06-21T10:00:00', status: 'solved' },
        ];
        saveGrudgesToStorage(data);
    }
    return data;
}

let grudges = getInitialGrudges();

// --- Card Creation ---
function createGrudgeCard(grudge) {
    const card = document.createElement('div');
    card.className = `grudge-item card ${grudge.author === '我' ? 'mine' : 'theirs'}`;
    card.dataset.id = grudge.id;

    const mood = moods[grudge.moodTag];
    const date = new Date(grudge.createdAt);
    
    // Fallback for date formatting if date-fns is not loaded
    const timeAgo = typeof formatDistanceToNow === 'function' && typeof zhCN !== 'undefined'
        ? formatDistanceToNow(date, { addSuffix: true, locale: zhCN })
        : date.toLocaleDateString();

    // Use the mood object's properties. Provide a fallback if mood is not found.
    const moodSvg = mood ? mood.svg : '';
    const moodName = mood ? mood.name : (grudge.moodTag || '未知'); // Use grudge.moodTag as fallback text

    card.innerHTML = `
        <div class="grudge-header">
            <span class="author">${grudge.author}</span>
            <span class="time">${timeAgo}</span>
        </div>
        <p class="grudge-text">${grudge.text}</p>
        <div class="grudge-footer">
            <span class="mood-tag ${grudge.moodTag || 'neutral'}">
                ${moodSvg}
                ${moodName}
            </span>
            ${grudge.status === 'solved' ? '<span class="status-tag solved">已解决</span>' : ''}
        </div>
    `;
    return card;
}

// --- Global State for Grudge List ---
let isLoading = false;

function renderGrudges(page = 1) {
    const listContainer = document.getElementById('grudge-list');
    const loader = document.getElementById('grudge-loader');
    if (!listContainer || !loader) return;

    isLoading = true;
    loader.classList.remove('hidden');

    // Simulate network delay for loading effect
    setTimeout(() => {
        const startIndex = (page - 1) * grudgesPerPage;
        const endIndex = startIndex + grudgesPerPage;
        const grudgesToRender = allUnresolvedGrudges.slice(startIndex, endIndex);

        if (page === 1) {
            listContainer.innerHTML = ''; // Clear only on the first page load
        }

        grudgesToRender.forEach(grudge => {
            const card = createGrudgeCard(grudge);
            listContainer.appendChild(card);
        });

        isLoading = false;
        loader.classList.add('hidden');

        // If we've loaded the last of the grudges, stop listening for scroll events
        if (grudgesToRender.length < grudgesPerPage) {
            window.removeEventListener('scroll', handleScroll);
        }
    }, 500);
}

function handleScroll() {
    if (isLoading) return;

    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    if (nearBottom) {
        grudgePage++;
        renderGrudges(grudgePage);
    }
}

function renderWeekCalendar() {
    const calendarWeek = document.querySelector('.calendar-week');
    if (!calendarWeek) return;
    calendarWeek.innerHTML = '';

    const days = ['一', '二', '三', '四', '五', '六', '日'];
    const today = MOCK_TODAY; // 使用固定的今天
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    
    // Adjust to make Monday the start of the week (0)
    const startOfWeek = new Date(today);
    const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - dayOffset);

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);

        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        if (date.toDateString() === today.toDateString()) {
            dayEl.classList.add('today');
        }

        // For demonstration, always add mock SVG tags to every day.
        const tagsHTML = `
            <div class="mood-tag mood-tag--female">${getMoodIcon('happy')}</div>
            <div class="mood-tag mood-tag--male">${getMoodIcon('sad')}</div>
        `;
        
        dayEl.innerHTML = `
            <div class="day-name">${days[i]}</div>
            <div class="date">${date.getDate()}</div>
            <div class="tags">${tagsHTML}</div>
        `;
        
        calendarWeek.appendChild(dayEl);
    }
}

// --- Chart Logic ---
let activePeriod = 'week';
let pieChartUser = '我';
const moodScores = { 'happy': 10, 'loved': 10, 'surprised': 9, 'playful': 8, 'resolved': 7, 'calm': 6, 'tired': 4, 'sad': 2, 'angry': 0 };
const femaleColor = '#F787A4'; // 柔和粉色
const maleColor = '#5DA9E9';   // 柔和蓝色

function getChartData(period, author = null) {
    const days = period === 'week' ? 7 : 30;
    const endDate = MOCK_TODAY; // 使用固定的今天
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const relevantGrudges = grudges.filter(g => {
        const grudgeDate = new Date(g.createdAt);
        return (!author || g.author === author) && grudgeDate >= startDate && grudgeDate <= endDate;
    });

    return { relevantGrudges, days };
}

function renderMoodChart(period = 'week') {
    const moodChartCtx = document.getElementById('mood-chart')?.getContext('2d');
    if (!moodChartCtx) return;

    if (window.myMoodChart instanceof Chart) window.myMoodChart.destroy();
    
    const { days } = getChartData(period);
    const labels = [];
    
    const myGrudges = getChartData(period, '我').relevantGrudges;
    const partnerGrudges = getChartData(period, '对方').relevantGrudges;

    const myData = [];
    const partnerData = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
        
        const myMoodsToday = myGrudges.filter(g => new Date(g.createdAt).toDateString() === date.toDateString());
        const partnerMoodsToday = partnerGrudges.filter(g => new Date(g.createdAt).toDateString() === date.toDateString());

        const calculateAverage = (moods) => {
            if (moods.length === 0) return null;
            const totalScore = moods.reduce((sum, g) => sum + (moodScores[g.moodTag] || 5), 0);
            return (totalScore / moods.length).toFixed(1);
        };

        myData.push(calculateAverage(myMoodsToday));
        partnerData.push(calculateAverage(partnerMoodsToday));
    }

    window.myMoodChart = new Chart(moodChartCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: '女生情绪', data: myData, borderColor: femaleColor, backgroundColor: `${femaleColor}20`, fill: false, tension: 0.4, spanGaps: true },
                { label: '男生情绪', data: partnerData, borderColor: maleColor, backgroundColor: `${maleColor}20`, fill: false, tension: 0.4, spanGaps: true }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { y: { beginAtZero: true, max: 10 } },
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 30,
                        boxHeight: 2,
                        usePointStyle: false,
                    }
                }
            }
        }
    });
}

function renderMoodPieChart(period = 'week', author = '我') {
    const pieChartCtx = document.getElementById('mood-pie-chart')?.getContext('2d');
    if (!pieChartCtx) return;

    if (window.myMoodPieChart instanceof Chart) window.myMoodPieChart.destroy();

    const { relevantGrudges } = getChartData(period, author);
    const moodCounts = relevantGrudges.reduce((acc, grudge) => {
        acc[grudge.moodTag] = (acc[grudge.moodTag] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(moodCounts).map(tag => getMoodTagText(tag));
    const data = Object.values(moodCounts);
    
    const backgroundColors = [femaleColor, maleColor, '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf'].slice(0, labels.length);

    window.myMoodPieChart = new Chart(pieChartCtx, {
        type: 'pie',
        data: { labels, datasets: [{ data, backgroundColor: backgroundColors }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' }, title: { display: false } } }
    });
}

function renderIssues() {
    const issueList = document.querySelector('.issue-list');
    if (!issueList) return;
    issueList.innerHTML = '';
    issues.filter(i => i.status !== '已解决').forEach(issue => {
        const issueElement = document.createElement('div');
        issueElement.className = 'issue-item';
        issueElement.innerHTML = `<span>${issue.title}</span>`;
        issueList.appendChild(issueElement);
    });
}

function renderBlessings() {
    const blessingWall = document.querySelector('.blessing-wall');
    if (!blessingWall) return;
    blessingWall.innerHTML = '';
    blessings.forEach(blessing => {
        const blessingElement = document.createElement('div');
        blessingElement.className = 'blessing-card';
        blessingElement.innerHTML = `
            <div class="blessing-text">“${blessing.text}”</div>
            <div class="blessing-author">—— ${blessing.author}</div>
        `;
        blessingWall.appendChild(blessingElement);
    });
}

function renderProfile() {
    updateDaysTogether();
    toggleSubscriptionCard(false); 
}

function renderSweetList() {
    const listContainer = document.querySelector('.sweet-list');
    if (!listContainer) return;

    const solvedIssues = grudges
        .filter(item => item.status === 'solved')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Summary
    const summaryCard = document.querySelector('.summary-card');
    if (summaryCard) {
        const solvedCount = solvedIssues.length;
        summaryCard.querySelector('h3').textContent = `已解决 ${solvedCount} 件`;
        const recentDate = solvedIssues.length > 0 ? new Date(solvedIssues[0].createdAt).toLocaleDateString() : '无';
        summaryCard.querySelector('p').textContent = `最近解决于 ${recentDate}`;
    }

    // List
    const topThree = solvedIssues.slice(0, 3);
    listContainer.innerHTML = topThree.map(item => createGrudgeCard(item)).join('');
}

// --- 初始化和导航 ---

function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    document.querySelectorAll('.tab-item').forEach(tab => {
        if (tab.dataset.page === currentPage || (currentPage === '' && tab.dataset.page === 'index')) {
            tab.classList.add('active');
        }
        tab.addEventListener('click', () => {
            const pageName = tab.dataset.page;
            if (pageName) window.location.href = `${pageName}.html`;
        });
    });
}

function getCurrentPage() {
    const path = window.location.pathname.split('/').pop();
    if (path.includes('mood.html')) return 'mood';
    if (path.includes('sweet.html')) return 'sweet';
    if (path.includes('profile.html')) return 'profile';
    return 'index';
}

function initAddButton() {
    const addBtn = document.getElementById('add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => alert('跳转到添加记录页面（待开发）'));
    }
}

function initSegmentedControl() {
    const buttons = document.querySelectorAll('.segmented-control button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activePeriod = button.dataset.period;
            renderMoodChart(activePeriod);
            renderMoodPieChart(activePeriod, pieChartUser);
        });
    });
}

function initPieChartControls() {
    const buttons = document.querySelectorAll('.user-selector button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            pieChartUser = button.dataset.user;
            renderMoodPieChart(activePeriod, pieChartUser);
        });
    });
}

function updateDaysTogether() {
    const daysElement = document.getElementById('days-together');
    if (daysElement) {
        daysElement.textContent = `在一起 ${calculateDaysTogether('2023-01-15')} 天`;
    }
}

function toggleSubscriptionCard(isVip = false) {
    const membershipCard = document.querySelector('.membership-card');
    if (membershipCard) {
        membershipCard.style.display = isVip ? 'none' : 'flex';
    }
}

function initPage() {
    const currentPath = window.location.pathname.split('/').pop();
    
    switch (currentPath) {
        case 'index.html':
        case '':
            allUnresolvedGrudges = grudges
                .filter(g => g.status === 'unresolved')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            renderGrudges(grudgePage);
            window.addEventListener('scroll', handleScroll);
            initAddButton();
            break;
        case 'mood.html':
            renderWeekCalendar();
            renderMoodChart('week');
            renderMoodPieChart('week', '我');
            initSegmentedControl();
            initPieChartControls();
            break;
        case 'sweet.html':
            renderSweetList();
            break;
        case 'profile.html':
            renderProfile();
            break;
    }
    
    initNavigation();
}

// --- Page Initializers ---

function initIndexPage() {
    allUnresolvedGrudges = grudges
        .filter(g => g.status === 'unresolved')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    renderGrudges(grudgePage);
    window.addEventListener('scroll', handleScroll);
    
    document.querySelector('.add-button').addEventListener('click', () => {
        window.location.href = 'add-grudge.html';
    });
}

function initAddGrudgePage() {
    let selectedMood = 'happy';
    const moodSelector = document.getElementById('mood-selector');
    const form = document.getElementById('grudge-form');
    const closeButton = document.querySelector('.close-button');

    // Populate mood selector
    moodSelector.innerHTML = '';
     for (const moodKey in moods) {
        const mood = moods[moodKey];
        const option = document.createElement('div');
        option.className = 'mood-option';
        option.dataset.mood = moodKey;
        option.innerHTML = mood.svg;
        if (moodKey === selectedMood) {
            option.classList.add('selected');
        }
        moodSelector.appendChild(option);
    }
    
    // Mood selection listener
    moodSelector.addEventListener('click', (e) => {
        const option = e.target.closest('.mood-option');
        if (option) {
            selectedMood = option.dataset.mood;
            document.querySelectorAll('.mood-option').forEach(el => el.classList.remove('selected'));
            option.classList.add('selected');
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('grudge-text').value.trim();
        if (!text) {
            alert('请填写描述！');
            return;
        }
        const newGrudge = {
            id: Date.now(),
            author: '我',
            text: text,
            moodTag: selectedMood,
            createdAt: new Date().toISOString(),
            status: 'unresolved'
        };
        grudges.push(newGrudge);
        saveGrudgesToStorage(grudges);
        window.location.href = 'index.html';
    });

    // Close button
    closeButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    switch (page) {
        case 'index.html':
            initIndexPage();
            break;
        case 'add-grudge.html':
            initAddGrudgePage();
            break;
        case 'mood.html':
            renderWeekCalendar();
            renderMoodChart('week');
            renderMoodPieChart('week', '我');
            initSegmentedControl();
            initPieChartControls();
            break;
        case 'sweet.html':
            renderSweetList();
            break;
        case 'profile.html':
            renderProfile();
            break;
    }
    
    initNavigation();
}); 