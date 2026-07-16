(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Sticky nav state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 12) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  var mobileBackdrop = document.getElementById("mobile-backdrop");
  function openMobileMenu() {
    mobileMenu.classList.remove("hidden");
    mobileBackdrop.classList.remove("hidden");
    void mobileMenu.offsetHeight; /* force reflow so the transition runs */
    mobileMenu.classList.add("is-open");
    mobileBackdrop.classList.add("is-open");
    menuBtn.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove("is-open");
    mobileBackdrop.classList.remove("is-open");
    menuBtn.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(function () {
      if (!mobileMenu.classList.contains("is-open")) {
        mobileMenu.classList.add("hidden");
        mobileBackdrop.classList.add("hidden");
      }
    }, 340);
  }
  if (menuBtn && mobileMenu && mobileBackdrop) {
    menuBtn.addEventListener("click", function () {
      if (mobileMenu.classList.contains("is-open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
    mobileBackdrop.addEventListener("click", closeMobileMenu);
    mobileMenu.querySelectorAll(".mob-link").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) closeMobileMenu();
    });
  }

  /* ---------- Watch the film modal ---------- */
  var filmBtn = document.getElementById("watch-film-btn");
  var filmModal = document.getElementById("film-modal");
  var filmClose = document.getElementById("film-close");
  if (filmBtn && filmModal) {
    filmBtn.addEventListener("click", function () {
      filmModal.classList.remove("hidden");
      filmModal.classList.add("flex");
      document.body.style.overflow = "hidden";
    });
    function closeModal() {
      filmModal.classList.add("hidden");
      filmModal.classList.remove("flex");
      document.body.style.overflow = "";
    }
    filmClose.addEventListener("click", closeModal);
    filmModal.addEventListener("click", function (e) {
      if (e.target === filmModal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Counter animation ---------- */
  var counters = document.querySelectorAll(".counter");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    var counterIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { counterIo.observe(el); });
  }

  /* ---------- Generic scroll parallax for [data-parallax] images ---------- */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !prefersReducedMotion) {
    var parallaxTicking = false;
    function updateParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offsetFromCenter = center - vh / 2;
        var strength = parseFloat(el.getAttribute("data-parallax-strength")) || 0.06;
        var translate = offsetFromCenter * strength;
        el.style.transform = "scale(1.12) translateY(" + translate + "px)";
      });
      parallaxTicking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!parallaxTicking) {
          parallaxTicking = true;
          requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );
    updateParallax();
  }

  /* ---------- Hero cinematic scroll-fade ---------- */
  var heroFadeEl = document.querySelector("#home .hero-fade");
  if (heroFadeEl && !prefersReducedMotion) {
    var heroFadeTicking = false;
    function updateHeroFade() {
      var vh = window.innerHeight;
      var progress = Math.min(Math.max(window.scrollY / (vh * 0.85), 0), 1);
      heroFadeEl.style.opacity = String(1 - progress * 0.9);
      heroFadeEl.style.transform = "translateY(" + (progress * 70) + "px) scale(" + (1 - progress * 0.05) + ")";
      heroFadeTicking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!heroFadeTicking) {
          heroFadeTicking = true;
          requestAnimationFrame(updateHeroFade);
        }
      },
      { passive: true }
    );
    updateHeroFade();
  }

  /* ---------- Industries horizontal gallery ---------- */
  var galleryTrack = document.getElementById("gallery-track");
  var galleryProgress = document.getElementById("gallery-progress-fill");
  if (galleryTrack) {
    var galleryPrev = document.getElementById("gallery-prev");
    var galleryNext = document.getElementById("gallery-next");
    function galleryStep() {
      var card = galleryTrack.querySelector(".gallery-card");
      return card ? card.getBoundingClientRect().width + 20 : 300;
    }
    if (galleryPrev) galleryPrev.addEventListener("click", function () {
      galleryTrack.scrollBy({ left: -galleryStep(), behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
    if (galleryNext) galleryNext.addEventListener("click", function () {
      galleryTrack.scrollBy({ left: galleryStep(), behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
    if (galleryProgress) {
      var galleryTicking = false;
      function updateGalleryProgress() {
        var max = galleryTrack.scrollWidth - galleryTrack.clientWidth;
        var pct = max > 0 ? (galleryTrack.scrollLeft / max) * 100 : 0;
        galleryProgress.style.width = Math.max(6, Math.min(100, pct === 0 ? 8 : pct)) + "%";
        galleryTicking = false;
      }
      galleryTrack.addEventListener(
        "scroll",
        function () {
          if (!galleryTicking) {
            galleryTicking = true;
            requestAnimationFrame(updateGalleryProgress);
          }
        },
        { passive: true }
      );
      updateGalleryProgress();
    }
    /* click-and-drag scrolling for mouse users */
    if (hasFinePointer) {
      var isDragging = false, dragStartX = 0, dragScrollLeft = 0, dragMoved = false;
      galleryTrack.addEventListener("mousedown", function (e) {
        isDragging = true;
        dragMoved = false;
        dragStartX = e.pageX;
        dragScrollLeft = galleryTrack.scrollLeft;
      });
      window.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        var dx = e.pageX - dragStartX;
        if (Math.abs(dx) > 4) dragMoved = true;
        galleryTrack.scrollLeft = dragScrollLeft - dx;
      });
      window.addEventListener("mouseup", function () {
        isDragging = false;
      });
      galleryTrack.querySelectorAll(".gallery-card").forEach(function (card) {
        card.addEventListener("click", function (e) {
          if (dragMoved) e.preventDefault();
        });
      });
    }

    /* continuous auto-scroll drift: cards drift steadily, pause on any interaction, resume after idle */
    if (!prefersReducedMotion) {
      var galleryInView = false;
      var autoScrollActive = true;
      var autoResumeTimer = null;
      var driftSpeed = 0.55; // px per animation frame

      function pauseDrift() {
        autoScrollActive = false;
        clearTimeout(autoResumeTimer);
        autoResumeTimer = setTimeout(function () {
          autoScrollActive = true;
        }, 3200);
      }

      function driftTick() {
        if (autoScrollActive && galleryInView && !isDragging) {
          var max = galleryTrack.scrollWidth - galleryTrack.clientWidth;
          if (max > 0) {
            if (galleryTrack.scrollLeft >= max - 1) {
              galleryTrack.scrollLeft = 0;
            } else {
              galleryTrack.scrollLeft += driftSpeed;
            }
          }
        }
        requestAnimationFrame(driftTick);
      }
      requestAnimationFrame(driftTick);

      ["mouseenter", "touchstart", "wheel", "mousedown"].forEach(function (evt) {
        galleryTrack.addEventListener(evt, pauseDrift, { passive: true });
      });
      if (galleryPrev) galleryPrev.addEventListener("click", pauseDrift);
      if (galleryNext) galleryNext.addEventListener("click", pauseDrift);

      var galleryVisIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            galleryInView = entry.isIntersecting;
          });
        },
        { threshold: 0.35 }
      );
      galleryVisIo.observe(galleryTrack);
    }
  }

  /* ---------- Platform pinned scroll-story ---------- */
  var storySteps = document.querySelectorAll(".platform-story-step");
  var storyPanels = document.querySelectorAll(".platform-story-panel");
  if (storySteps.length && storyPanels.length) {
    var storyIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var step = entry.target.getAttribute("data-step");
            storySteps.forEach(function (s) { s.classList.toggle("is-active", s === entry.target); });
            storyPanels.forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-panel") === step); });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    storySteps.forEach(function (s) { storyIo.observe(s); });
  }

  /* ---------- Stacking cards depth effect (Apple-style scale/dim as next card covers) ---------- */
  var stackCards = document.querySelectorAll(".stack-card");
  if (stackCards.length) {
    var stackTicking = false;
    function updateStackDepth() {
      for (var i = 0; i < stackCards.length - 1; i++) {
        var inner = stackCards[i].querySelector(".stack-card-inner");
        if (!inner) continue;
        var curRect = stackCards[i].getBoundingClientRect();
        var nextRect = stackCards[i + 1].getBoundingClientRect();
        var diff = nextRect.top - curRect.top;
        var range = 180;
        var t = Math.max(0, Math.min(1, 1 - diff / range));
        inner.style.transform = "scale(" + (1 - t * 0.07) + ")";
        inner.style.filter = "brightness(" + (1 - t * 0.22) + ")";
      }
      stackTicking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!stackTicking) {
          stackTicking = true;
          requestAnimationFrame(updateStackDepth);
        }
      },
      { passive: true }
    );
    updateStackDepth();
  }

  /* ---------- Stat bar fill animation ---------- */
  var statBars = document.querySelectorAll(".stat-bar-fill");
  if (statBars.length) {
    var statIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-filled");
            statIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statBars.forEach(function (el) { statIo.observe(el); });
  }

  /* ---------- Card tilt (desktop, fine pointer only) ---------- */
  if (hasFinePointer && !prefersReducedMotion) {
    document.querySelectorAll(".card").forEach(function (card) {
      var raf = null;
      card.style.transformStyle = "preserve-3d";
      card.addEventListener("mousemove", function (e) {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width - 0.5;
          var py = (e.clientY - rect.top) / rect.height - 0.5;
          var rotY = px * 7;
          var rotX = -py * 7;
          card.style.transform = "perspective(900px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) translateY(-4px)";
        });
      });
      card.addEventListener("mouseleave", function () {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (hasFinePointer && !prefersReducedMotion) {
    document.querySelectorAll(".btn-primary, .btn-secondary").forEach(function (btn) {
      var raf = null;
      btn.addEventListener("mousemove", function (e) {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          var rect = btn.getBoundingClientRect();
          var mx = (e.clientX - rect.left - rect.width / 2) * 0.25;
          var my = (e.clientY - rect.top - rect.height / 2) * 0.4;
          btn.style.transform = "translate(" + mx + "px," + my + "px)";
        });
      });
      btn.addEventListener("mouseleave", function () {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Hero cursor-reactive blob (spring-smoothed follow) ---------- */
  var heroSection = document.getElementById("home");
  if (heroSection && hasFinePointer && !prefersReducedMotion) {
    var blob = document.createElement("div");
    blob.id = "hero-blob";
    heroSection.appendChild(blob);

    var targetX = 0, targetY = 0, curX = 0, curY = 0, hasTarget = false, blobLoopRunning = false;

    function blobLoop() {
      curX += (targetX - curX) * 0.16;
      curY += (targetY - curY) * 0.16;
      blob.style.transform = "translate3d(" + curX + "px," + curY + "px,0)";
      var settled = Math.abs(targetX - curX) < 0.3 && Math.abs(targetY - curY) < 0.3;
      if (settled) {
        blobLoopRunning = false;
        return;
      }
      requestAnimationFrame(blobLoop);
    }
    function ensureLoop() {
      if (!blobLoopRunning) {
        blobLoopRunning = true;
        requestAnimationFrame(blobLoop);
      }
    }

    heroSection.addEventListener("mouseenter", function (e) {
      var rect = heroSection.getBoundingClientRect();
      curX = targetX = e.clientX - rect.left;
      curY = targetY = e.clientY - rect.top;
      blob.style.transform = "translate3d(" + curX + "px," + curY + "px,0)";
      blob.classList.add("is-active");
      hasTarget = true;
    });
    heroSection.addEventListener("mousemove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!hasTarget) {
        curX = targetX;
        curY = targetY;
        hasTarget = true;
      }
      ensureLoop();
    });
    heroSection.addEventListener("mouseleave", function () {
      blob.classList.remove("is-active");
    });
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.createElement("button");
  backToTop.id = "back-to-top";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backToTop);
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
  window.addEventListener(
    "scroll",
    function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 700);
    },
    { passive: true }
  );

  /* ---------- Active nav link on scroll ---------- */
  var sectionIds = ["home", "about", "solutions", "industries", "use-cases", "platform", "resources", "contact"];
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var navIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              var match = link.getAttribute("href") === "#" + id;
              link.classList.toggle("is-active", match);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { navIo.observe(s); });
  }

  /* ---------- Contact form (front-end only) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = document.getElementById("cf-submit");
      var successMsg = document.getElementById("cf-success");
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.6";
      setTimeout(function () {
        successMsg.classList.remove("hidden");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.style.opacity = "";
      }, 500);
    });
  }
})();
