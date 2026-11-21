/**
 * موقع المدرسة - سكربت معرض الصور والـ Lightbox (Gallery & Lightbox)
 * فلترة التصنيفات، التكبير، التنقل بين الصور باللمس ولوحة المفاتيح
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

/* --------------------------------------------------------------------------
   1. فلترة الصور حسب التصنيف (Gallery Filter)
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // تحديث الزر النشط
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   2. عارض الصور المنبثق التفاعلي (Lightbox)
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');
  const zoomBtn = document.getElementById('lightboxZoomBtn');

  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
  let currentIndex = 0;
  let isZoomed = false;

  function getVisibleCards() {
    return galleryCards.filter(c => c.style.display !== 'none');
  }

  function openLightbox(index) {
    const visibleCards = getVisibleCards();
    if (!visibleCards[index]) return;

    currentIndex = index;
    const card = visibleCards[currentIndex];
    const imgEl = card.querySelector('img');
    const titleEl = card.querySelector('.gallery-card-title');
    const descEl = card.querySelector('.gallery-card-category');

    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    lightboxTitle.textContent = titleEl ? titleEl.textContent : '';
    lightboxDesc.textContent = descEl ? descEl.textContent : '';

    lightboxImg.classList.remove('zoomed');
    isZoomed = false;
    if (zoomBtn) zoomBtn.innerHTML = '<span>تكبير</span>';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.classList.remove('zoomed');
    isZoomed = false;
  }

  function showNextImage() {
    const visibleCards = getVisibleCards();
    currentIndex = (currentIndex + 1) % visibleCards.length;
    openLightbox(currentIndex);
  }

  function showPrevImage() {
    const visibleCards = getVisibleCards();
    currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    openLightbox(currentIndex);
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
    if (isZoomed) {
      lightboxImg.classList.add('zoomed');
      if (zoomBtn) zoomBtn.innerHTML = '<span>تصغير</span>';
    } else {
      lightboxImg.classList.remove('zoomed');
      if (zoomBtn) zoomBtn.innerHTML = '<span>تكبير</span>';
    }
  }

  // ربط بطاقات المعرض بالـ Lightbox
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      const index = visibleCards.indexOf(card);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
  if (zoomBtn) zoomBtn.addEventListener('click', toggleZoom);

  // إغلاق عند النقر بالخلفية
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // التحكم عبر لوحة المفاتيح
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    }
  });

  // دعم السحب باللمس على شاشات الهواتف (Touch Swipe)
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      showNextImage();
    } else if (touchEndX > touchStartX + threshold) {
      showPrevImage();
    }
  }

  // دعم الفتح التلقائي للاختبار البصري
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('test_lightbox') === '1') {
    setTimeout(() => {
      openLightbox(0);
    }, 150);
  }
}

