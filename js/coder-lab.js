/**
 * موقع المدرسة - سكربت مختبر المبرمج الصغير (Little Coder Lab)
 * يشمل: المسار التعليمي، محاكي الأوامر بالذكاء الاصطناعي محلياً، الألعاب المصغرة، ونظام الشارات والنقاط
 */

document.addEventListener('DOMContentLoaded', () => {
  initCoderLabState();
  initRoadmap();
  initPromptPlayground();
  initMiniGames();
  initStudentShowcase();
  initCertificateSystem();
  initCodeExportButtons();
});

/* --------------------------------------------------------------------------
   0. المؤثرات الصوتية التفاعلية عبر Web Audio API النقي (Pure Browser Audio)
   -------------------------------------------------------------------------- */
let audioCtx = null;

function playSound(type) {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);       // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'badge') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (err) {
    // تجاهل في حالة عدم دعم البيئة للمتصفح
  }
}

/* --------------------------------------------------------------------------
   1. نظام الحفظ وإدارة حالة الطالب (Gamification State & LocalStorage)
   -------------------------------------------------------------------------- */
const DEFAULT_STATE = {
  xp: 150,
  level: 1,
  completedRoadmap: [1],
  unlockedBadges: ['badge_beginner'],
  completedGames: [],
  weeklyChallengeDone: false,
  savedSites: []
};

let userState = { ...DEFAULT_STATE };

function initCoderLabState() {
  const saved = localStorage.getItem('school_coder_state');
  if (saved) {
    try {
      userState = Object.assign({}, DEFAULT_STATE, JSON.parse(saved));
    } catch (e) {
      userState = { ...DEFAULT_STATE };
    }
  }
  updateDashboardUI();
}

function saveState() {
  localStorage.setItem('school_coder_state', JSON.stringify(userState));
  updateDashboardUI();
}

function addXP(points, reason = '') {
  userState.xp += points;
  saveState();
  playSound('success');
  if (window.showToast) {
    window.showToast(`أحسنت! حصلت على +${points} نقطة خبرة XP ${reason ? '(' + reason + ')' : ''}`, 'success');
  }
  checkBadgeUnlocks();
}

function checkBadgeUnlocks() {
  let newlyUnlocked = false;

  // فحص شارة مهندس الأوامر (توليد موقع)
  if (userState.savedSites.length > 0 && !userState.unlockedBadges.includes('badge_prompt')) {
    userState.unlockedBadges.push('badge_prompt');
    newlyUnlocked = true;
  }

  // فحص شارة صياد الأخطاء (حل الألعاب)
  if (userState.completedGames.length >= 2 && !userState.unlockedBadges.includes('badge_debugger')) {
    userState.unlockedBadges.push('badge_debugger');
    newlyUnlocked = true;
  }

  // فحص شارة المبدع الذهبي (تجاوز 400 نقطة)
  if (userState.xp >= 400 && !userState.unlockedBadges.includes('badge_creator')) {
    userState.unlockedBadges.push('badge_creator');
    newlyUnlocked = true;
  }

  if (newlyUnlocked) {
    playSound('badge');
    saveState();
  }
}

function updateDashboardUI() {
  const xpVal = document.getElementById('userXpVal');
  const xpBar = document.getElementById('xpBarFill');
  const levelTitle = document.getElementById('userLevelTitle');

  if (xpVal) xpVal.textContent = userState.xp;

  // احتساب المستوى بالنسبة لـ 500 نقطة كهدف مرحلي
  const maxGoal = 500;
  const percentage = Math.min(Math.round((userState.xp / maxGoal) * 100), 100);
  if (xpBar) xpBar.style.width = `${percentage}%`;

  if (levelTitle) {
    if (userState.xp < 200) levelTitle.textContent = 'المستوى 1: مبتدئ شغوف ';
    else if (userState.xp < 350) levelTitle.textContent = 'المستوى 2: مبرمج واعد ';
    else if (userState.xp < 500) levelTitle.textContent = 'المستوى 3: مهندس أوامر ذكي ';
    else levelTitle.textContent = 'المستوى 4: محترف ذكاء اصطناعي ';
  }

  // تحديث الشارات
  document.querySelectorAll('.badge-item-card').forEach(card => {
    const badgeId = card.getAttribute('data-badge');
    if (userState.unlockedBadges.includes(badgeId)) {
      card.classList.remove('locked');
      card.classList.add('unlocked');
      const statusText = card.querySelector('.badge-status');
      if (statusText) statusText.textContent = 'مفتوحة ';
    } else {
      card.classList.add('locked');
      card.classList.remove('unlocked');
      const statusText = card.querySelector('.badge-status');
      if (statusText) statusText.textContent = 'مغلقة ';
    }
  });

  // تحديث المسار التعليمي
  document.querySelectorAll('.roadmap-step-card').forEach(step => {
    const stepNum = parseInt(step.getAttribute('data-step'), 10);
    if (userState.completedRoadmap.includes(stepNum)) {
      step.classList.add('completed');
      const indicator = step.querySelector('.step-status-indicator');
      if (indicator) indicator.innerHTML = '<span>مكتمل</span> ';
    }
  });
}

/* --------------------------------------------------------------------------
   2. المسار التعليمي (Roadmap Interaction)
   -------------------------------------------------------------------------- */
function initRoadmap() {
  const steps = document.querySelectorAll('.roadmap-step-card');

  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = parseInt(step.getAttribute('data-step'), 10);

      // تنشيط الخطوة
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      if (!userState.completedRoadmap.includes(stepNum)) {
        userState.completedRoadmap.push(stepNum);
        addXP(40, `إنجاز خطوة المسار ${stepNum}`);
      } else {
        if (window.showToast) {
          window.showToast(`أنت تستعرض محتوى المستوى ${stepNum} في مسار بناء المواقع `);
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. محاكي الأوامر الذكية (Prompt Playground Engine)
   -------------------------------------------------------------------------- */
function initPromptPlayground() {
  const promptInput = document.getElementById('promptTextarea');
  const generateBtn = document.getElementById('generateSiteBtn');
  const templateChips = document.querySelectorAll('.template-chip-btn');
  const simulatedOutput = document.getElementById('simulatedSiteOutput');
  const codeInspector = document.getElementById('codeInspectorView');
  const deviceSwitchBtns = document.querySelectorAll('.device-switch-btn');
  const previewTabBtns = document.querySelectorAll('.preview-tab-btn');
  const simulatedViewport = document.getElementById('simulatedViewportFrame');
  const styleSelect = document.getElementById('siteStyleSelect');

  // إدراج القوالب الجاهزة
  templateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const templateText = chip.getAttribute('data-prompt');
      if (promptInput) {
        promptInput.value = templateText;
        promptInput.focus();
        if (window.showToast) {
          window.showToast('تم تحميل القالب بنجاح! اضغط "ولّد الموقع" للمعاينة ');
        }
      }
    });
  });

  // تبديل وضع الجهاز (حاسوب / هاتف)
  deviceSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceSwitchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-device');
      if (mode === 'mobile') {
        simulatedViewport.classList.add('mobile-mode');
      } else {
        simulatedViewport.classList.remove('mobile-mode');
      }
    });
  });

  // تبديل التبويب (معاينة حية / كود HTML)
  previewTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      previewTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.getAttribute('data-tab');
      if (tab === 'code') {
        simulatedOutput.style.display = 'none';
        codeInspector.classList.add('active');
      } else {
        simulatedOutput.style.display = 'block';
        codeInspector.classList.remove('active');
      }
    });
  });

  // توليد الموقع عند النقر
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const prompt = promptInput ? promptInput.value.trim() : '';
      if (!prompt) {
        if (window.showToast) {
          window.showToast('يرجى كتابة وصف لموقعك أو اختيار قالب جاهز أولاً ', 'error');
        }
        return;
      }

      // محاكاة التوليد مع أنيميشن انتظار سريع
      const originalText = generateBtn.innerHTML;
      generateBtn.innerHTML = '<span> الذكاء الاصطناعي يبني موقعك الآن...</span>';
      generateBtn.disabled = true;

      setTimeout(() => {
        const style = styleSelect ? styleSelect.value : 'modern';
        const generated = generateSimulatedSite(prompt, style);

        if (simulatedOutput) {
          simulatedOutput.innerHTML = generated.html;
        }

        if (codeInspector) {
          codeInspector.textContent = generated.rawCode;
        }

        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;

        // مكافأة النقاط والشارات
        userState.savedSites.push({ prompt, date: new Date().toISOString() });
        addXP(60, 'توليد موقع جديد بالذكاء الاصطناعي');
      }, 700);
    });
  }

  // توليد موقع افتراضي أولي عند التحميل
  if (simulatedOutput) {
    const initialSite = generateSimulatedSite('موقعي الشخصي للرسم والفنون الجميلة', 'modern');
    simulatedOutput.innerHTML = initialSite.html;
    if (codeInspector) codeInspector.textContent = initialSite.rawCode;
  }

  // دعم الاختبار البصري السريع
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('test_lab') === '1') {
    if (promptInput) {
      promptInput.value = 'موقع رسمي لنادي الروبوت والابتكار المدرسي يعرض اختراعاتنا وأهداف الفريق وأزرار انضمام';
    }
    const robotSite = generateSimulatedSite('موقع رسمي لنادي الروبوت والابتكار المدرسي', 'tech');
    if (simulatedOutput) simulatedOutput.innerHTML = robotSite.html;
    if (codeInspector) codeInspector.textContent = robotSite.rawCode;
    userState.xp = 380;
    userState.completedRoadmap = [1, 2, 3];
    userState.unlockedBadges = ['badge_beginner', 'badge_prompt', 'badge_debugger'];
    updateDashboardUI();
  }
}

/**
 * محرك توليد المواقع التجريبية محلياً (Pure JavaScript Engine)
 * يحلل الكلمات المفتاحية في البرومبت ويصنع نموذج صفحة جميلة وتفاعلية
 */
function generateSimulatedSite(prompt, style) {
  const p = prompt.toLowerCase();

  let themeBg = '#ffffff';
  let themePrimary = '#4F46E5';
  let themeAccent = '#D97706';
  let categoryName = 'موقعي الإبداعي';
  let icon = '';
  let heroTitle = 'أهلاً بكم في موقعي الجديد';
  let heroDesc = 'صفحة تفاعلية صممتها باستخدام أوامر الذكاء الاصطناعي في مختبر المدرسة.';
  let items = [];

  if (p.includes('رسم') || p.includes('فن') || p.includes('هواي')) {
    categoryName = 'معرض الفنون والأعمال اليدوية';
    icon = '';
    heroTitle = 'لوحاتي وإبداعاتي الفنية';
    heroDesc = 'أشارككم هنا شغفي بالألوان والرسومات والأعمال اليدوية المبتكرة.';
    themePrimary = '#E11D48';
    themeAccent = '#F59E0B';
    items = [
      { title: 'لوحة شروق الشمس', desc: 'ألوان مائية على قماش قطني', icon: '' },
      { title: 'طبيعة جبلية صامتة', desc: 'باستيل ورصاص ناعم', icon: '' },
      { title: 'مجسم خشبي بيئي', desc: 'إعادة تدوير مواد مدرسية', icon: '' }
    ];
  } else if (p.includes('روبوت') || p.includes('برمج') || p.includes('تقني') || p.includes('ذكاء')) {
    categoryName = 'نادي الروبوت والابتكار المدرسي';
    icon = '';
    heroTitle = 'عالم الروبوت والمستقبل';
    heroDesc = 'مشروعات برمجية واختراعات طلابية تواكب عصر الذكاء الاصطناعي والأتمتة.';
    themePrimary = '#2563EB';
    themeAccent = '#10B981';
    items = [
      { title: 'روبوت تتبع المسار', desc: 'متحكم أردوينو وحساسات ضوء', icon: '' },
      { title: 'ذراع الفرز الذكية', desc: 'محركات سيرفو وفرز أوتوماتيكي', icon: '' },
      { title: 'مساعد الصف الآلي', desc: 'تنبيهات صوتية ومستشعر مسافة', icon: '️' }
    ];
  } else if (p.includes('حيوان') || p.includes('طبيع') || p.includes('أليف')) {
    categoryName = 'موسوعة عالم الحيوان الشائقة';
    icon = '';
    heroTitle = 'أصدقاؤنا الأوفياء في الطبيعة';
    heroDesc = 'معلومات مبسطة وحقائق ممتعة عن الحيوانات وكيفية رعايتها والرفق بها.';
    themePrimary = '#059669';
    themeAccent = '#D97706';
    items = [
      { title: 'القطط الأليفة', desc: 'سلوكياتها وطرق التعبير عن فرحها', icon: '' },
      { title: 'الصقور العربية', desc: 'سرعة الطيران والحدة البصرية', icon: '' },
      { title: 'الدلافين الذكية', desc: 'لغة التواصل والذكاء الاجتماعي العالي', icon: '' }
    ];
  } else if (p.includes('مدون') || p.includes('مقال') || p.includes('رحل')) {
    categoryName = 'مدونتي المدرسية ويومياتي';
    icon = '';
    heroTitle = 'قصص ومغامرات من يومياتي';
    heroDesc = 'مساحتي الخاصة لتدوين ما تعلمته في المدرسة والمغامرات الشيقة مع أصدقائي.';
    themePrimary = '#7C3AED';
    themeAccent = '#EC4899';
    items = [
      { title: 'زيارتنا للمتحف القومي', desc: 'ما تعلمناه عن تاريخ أجدادنا', icon: '️' },
      { title: 'أول تجربة في معمل الكيمياء', desc: 'الألوان الغريبة للتفاعلات الآمنة', icon: '' },
      { title: 'كتابي المفضل هذا الشهر', desc: 'رحلة خيالية عبر الفضاء', icon: '' }
    ];
  } else {
    items = [
      { title: 'الفكرة الأولى', desc: 'تنسيق متناسق وتجربة استخدام مرنة', icon: '' },
      { title: 'المحتوى التفاعلي', desc: 'عناصر جذابة تناسب جميع الزوار', icon: '' },
      { title: 'سهولة المشاركة', desc: 'كود نظيف جاهز للنشر السريع', icon: '' }
    ];
  }

  // كود الـ HTML المولد
  const html = `
    <div style="font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; color: #1E293B;">
      <header style="background: ${themePrimary}; color: #ffffff; padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.75rem;">${icon}</span>
          <div>
            <h3 style="margin: 0; font-size: 1.15rem; color: #ffffff;">${categoryName}</h3>
            <span style="font-size: 0.75rem; color: rgba(255,255,255,0.8);">صُمم بمختبر المبرمج الصغير</span>
          </div>
        </div>
        <button style="background: ${themeAccent}; color: #ffffff; border: none; padding: 0.4rem 0.9rem; border-radius: 20px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">تواصل معي</button>
      </header>

      <div style="background: linear-gradient(135deg, rgba(79,70,229,0.06), rgba(236,72,153,0.06)); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center; border: 1px solid rgba(0,0,0,0.05);">
        <h2 style="color: ${themePrimary}; margin-bottom: 0.5rem; font-size: 1.35rem;">${heroTitle}</h2>
        <p style="color: #64748B; font-size: 0.9rem; line-height: 1.6; max-width: 480px; margin: 0 auto 1rem auto;">${heroDesc}</p>
        <div style="display: flex; justify-content: center; gap: 0.5rem;">
          <span style="background: #ffffff; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.75rem; font-weight: bold; border: 1px solid #E2E8F0;"> ذكاء اصطناعي</span>
          <span style="background: #ffffff; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.75rem; font-weight: bold; border: 1px solid #E2E8F0;"> متجاوب</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        ${items.map(item => `
          <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1rem; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.03);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${item.icon}</div>
            <h4 style="margin: 0 0 0.25rem 0; font-size: 0.95rem; color: #1E293B;">${item.title}</h4>
            <p style="margin: 0; font-size: 0.75rem; color: #64748B;">${item.desc}</p>
          </div>
        `).join('')}
      </div>

      <footer style="text-align: center; padding: 1rem 0; border-top: 1px solid #E2E8F0; font-size: 0.8rem; color: #94A3B8;">
        جميع الحقوق محفوظة &copy; للطالب المبدع - ${categoryName}
      </footer>
    </div>
  `;

  const rawCode = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${categoryName}</title>
  <style>
    body { font-family: 'Cairo', sans-serif; background: #FAF8F5; color: #1E293B; }
    .header { background: ${themePrimary}; color: white; padding: 1rem; border-radius: 12px; }
    .hero { text-align: center; padding: 2rem; }
    .card { background: white; border-radius: 10px; padding: 1rem; }
  </style>
</head>
<body>
  <!-- ترويسة الموقع -->
  <header class="header">
    <h1>${categoryName}</h1>
  </header>

  <!-- القسم الرئيسي -->
  <main class="hero">
    <h2>${heroTitle}</h2>
    <p>${heroDesc}</p>
  </main>
</body>
</html>`;

  return { html, rawCode };
}

/* --------------------------------------------------------------------------
   4. الألعاب التعليمية المصغرة (Mini-Games Suite)
   -------------------------------------------------------------------------- */
function initMiniGames() {
  initHtmlPuzzleGame();
  initBugHunterGame();
  initPromptQuizGame();
}

// لعبة 1: رتّب وسوم HTML
function initHtmlPuzzleGame() {
  const pool = document.getElementById('tagsPool');
  const slots = document.getElementById('slotsContainer');
  const checkBtn = document.getElementById('checkPuzzleBtn');
  const resetBtn = document.getElementById('resetPuzzleBtn');
  const feedback = document.getElementById('puzzleFeedback');

  if (!pool || !slots) return;

  const correctOrder = ['<!DOCTYPE html>', '<html>', '<head>', '<body>', '<h1>', '<footer>'];
  let currentArrangement = [];

  // النقر على وسم في الصندوق لنقله للترتيب
  pool.querySelectorAll('.puzzle-tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag');
      if (currentArrangement.includes(tag)) return;

      currentArrangement.push(tag);
      chip.style.opacity = '0.4';
      chip.style.pointerEvents = 'none';

      renderSlots();
    });
  });

  function renderSlots() {
    slots.innerHTML = '';
    currentArrangement.forEach((tag, idx) => {
      const item = document.createElement('div');
      item.className = 'puzzle-slot-item';
      item.innerHTML = `
        <span><strong>${idx + 1}.</strong> ${tag}</span>
        <span class="slot-remove-btn" title="إزالة">&times;</span>
      `;

      item.querySelector('.slot-remove-btn').addEventListener('click', () => {
        currentArrangement.splice(idx, 1);
        // إعادة تمكين الوسم في الصندوق
        pool.querySelectorAll('.puzzle-tag-chip').forEach(c => {
          if (c.getAttribute('data-tag') === tag) {
            c.style.opacity = '1';
            c.style.pointerEvents = 'auto';
          }
        });
        renderSlots();
      });

      slots.appendChild(item);
    });
  }

  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      if (currentArrangement.length < correctOrder.length) {
        showFeedback(feedback, 'يرجى ترتيب جميع الوسوم الستة أولاً ️', 'error');
        return;
      }

      const isCorrect = currentArrangement.every((val, i) => val === correctOrder[i]);
      if (isCorrect) {
        showFeedback(feedback, 'رائع جداً! الترتيب المعماري صحيح 100% ', 'success');
        if (!userState.completedGames.includes('puzzle')) {
          userState.completedGames.push('puzzle');
          addXP(50, 'إتمام لعبة ترتيب وسوم HTML');
        }
      } else {
        showFeedback(feedback, 'هناك خطأ في ترتيب الوسوم، تذكر أن DOCTYPE هو الأول دائماً ويتبعه html! ', 'error');
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentArrangement = [];
      pool.querySelectorAll('.puzzle-tag-chip').forEach(c => {
        c.style.opacity = '1';
        c.style.pointerEvents = 'auto';
      });
      renderSlots();
      if (feedback) feedback.style.display = 'none';
    });
  }
}

// لعبة 2: إيه الخطأ؟ (Spot the Bug)
function initBugHunterGame() {
  const options = document.querySelectorAll('.bug-option-label');
  const feedback = document.getElementById('bugFeedback');

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const isCorrect = opt.getAttribute('data-correct') === 'true';

      if (isCorrect) {
        showFeedback(feedback, 'إجابة صحيحة وملاحظة قوية! الوسم <img> لا يحتاج لوسم إغلاق </img> في HTML5 ', 'success');
        if (!userState.completedGames.includes('bug')) {
          userState.completedGames.push('bug');
          addXP(50, 'صياد الأخطاء البرمجية');
        }
      } else {
        showFeedback(feedback, 'إجابة غير دقيقة، دقق في خاصية src ووسم إغلاق الصورة ', 'error');
      }
    });
  });
}

// لعبة 3: اكتب برومبت أحسن (Prompt Quiz)
function initPromptQuizGame() {
  const cards = document.querySelectorAll('.prompt-compare-card');
  const feedback = document.getElementById('promptQuizFeedback');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isBest = card.getAttribute('data-best') === 'true';

      if (isBest) {
        showFeedback(feedback, 'ممتاز! هذا البرومبت يحدد بوضوح موضوع الموقع، والألوان، والأقسام، مما يعطي نتيجة دقيقة جداً ', 'success');
        if (!userState.completedGames.includes('prompt_quiz')) {
          userState.completedGames.push('prompt_quiz');
          addXP(50, 'خبير صياغة البرومبت');
        }
      } else {
        showFeedback(feedback, 'هذا البرومبت غامض وقصير جداً، الذكاء الاصطناعي لا يعرف ماذا تقصد بـ "موقع حلو" دون تفاصيل! ', 'error');
      }
    });
  });
}

function showFeedback(el, msg, type) {
  if (!el) return;
  if (type === 'error') playSound('error');
  el.textContent = msg;
  el.className = `game-feedback-msg ${type}`;
  el.style.display = 'block';
}

/* --------------------------------------------------------------------------
   5. معرض مواقع الطلاب الملهم (Student Showcase Modal)
   -------------------------------------------------------------------------- */
function initStudentShowcase() {
  const showcaseCards = document.querySelectorAll('.student-site-card');

  showcaseCards.forEach(card => {
    const demoBtn = card.querySelector('.btn-view-demo');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        playSound('click');
        const title = card.querySelector('h4').textContent;
        const student = card.querySelector('.student-creator').textContent;
        if (window.showToast) {
          window.showToast(`استعراض مشروع: ${title} لـ ${student} `);
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   6. تصدير وتحميل كود الموقع (Code Export & Download)
   -------------------------------------------------------------------------- */
function initCodeExportButtons() {
  const copyBtn = document.getElementById('copyCodeBtn');
  const downloadBtn = document.getElementById('downloadCodeBtn');
  const codeInspector = document.getElementById('codeInspectorView');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      playSound('click');
      const code = codeInspector ? codeInspector.textContent : '';
      if (!code) {
        if (window.showToast) window.showToast('لا يوجد كود لنسخه حالياً! ولّد موقعاً أولاً ️', 'error');
        return;
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          playSound('success');
          if (window.showToast) window.showToast('تم نسخ كود الـ HTML إلى الحافظة بنجاح ', 'success');
        }).catch(() => {
          fallbackCopy(code);
        });
      } else {
        fallbackCopy(code);
      }
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    playSound('success');
    if (window.showToast) window.showToast('تم نسخ كود الـ HTML بنجاح ', 'success');
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      playSound('click');
      const code = codeInspector ? codeInspector.textContent : '';
      if (!code) {
        if (window.showToast) window.showToast('ولّد موقعك أولاً قبل التحميل ', 'error');
        return;
      }

      const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-school-ai-website.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      playSound('badge');
      if (window.showToast) window.showToast('تم تحميل ملف الموقع (my-school-ai-website.html) بنجاح ', 'success');
    });
  }
}

/* --------------------------------------------------------------------------
   7. شهادة المبرمج الصغير والطباعة (Certificate Generator)
   -------------------------------------------------------------------------- */
function initCertificateSystem() {
  const printCertBtn = document.getElementById('printCertBtn');
  const certModal = document.getElementById('certModal');
  const certCloseBtn = document.getElementById('certCloseBtn');
  const doPrintCertBtn = document.getElementById('doPrintCertBtn');

  if (printCertBtn && certModal) {
    printCertBtn.addEventListener('click', () => {
      playSound('badge');
      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeCert() {
    if (certModal) {
      playSound('click');
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (certCloseBtn) certCloseBtn.addEventListener('click', closeCert);

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCert();
    });
  }

  if (doPrintCertBtn) {
    doPrintCertBtn.addEventListener('click', () => {
      playSound('click');
      window.print();
    });
  }
}

