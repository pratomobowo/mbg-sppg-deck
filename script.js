/* ═══════════════════════════════════════════
   Proposal MBG SPPG — Slide Navigation
   Keyboard, touch, nav buttons, progress bar
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const counter = document.getElementById('slideCounter');
    const progressBar = document.getElementById('progressBar');

    let current = 0;
    const total = slides.length;

    function updateSlide(index) {
        if (index < 0 || index >= total) return;

        slides[current].classList.remove('active');
        slides[index].classList.add('active');
        current = index;

        // Update counter
        counter.textContent = (current + 1) + ' / ' + total;

        // Update progress bar
        const pct = ((current + 1) / total) * 100;
        progressBar.style.width = pct + '%';

        // Scroll to top on slide change
        slides[current].scrollTop = 0;

        // Disable prev/next buttons at edges
        prevBtn.style.opacity = current === 0 ? '0.3' : '1';
        nextBtn.style.opacity = current === total - 1 ? '0.3' : '1';
    }

    function goNext() {
        if (current < total - 1) updateSlide(current + 1);
    }

    function goPrev() {
        if (current > 0) updateSlide(current - 1);
    }

    // Button clicks
    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                goNext();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                goPrev();
                break;
            case 'Home':
                e.preventDefault();
                updateSlide(0);
                break;
            case 'End':
                e.preventDefault();
                updateSlide(total - 1);
                break;
        }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        if (!touchStartX) return;

        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const threshold = 50;

        // Only trigger if horizontal swipe dominates
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
            if (dx < 0) goNext();
            else goPrev();
        }

        touchStartX = 0;
        touchStartY = 0;
    });

    // Mouse wheel — optional, debounced for usability
    let wheelTimeout;
    document.addEventListener('wheel', function (e) {
        // Only handle if not scrolling inside a slide (overflow-y content)
        const target = e.target.closest('.slide');
        if (!target) return;

        const atTop = target.scrollTop === 0;
        const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 2;

        // If content is scrollable and we're not at the edge, let native scroll handle it
        if (target.scrollHeight > target.clientHeight) {
            if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
                return;
            }
        }

        // Debounce wheel for slide navigation
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(function () {
            wheelTimeout = null;
        }, 800);

        if (e.deltaY > 0) goNext();
        else if (e.deltaY < 0) goPrev();
    }, { passive: true });

    // Initialize
    updateSlide(0);
})();
