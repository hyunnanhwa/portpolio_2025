// 로딩
window.addEventListener('load', () => {
  const blurOverlay = document.getElementById('blurOverlay');
  const centerX = '25%';
  const centerY = '50%';

  const duration = 5000;
  const startDelay = 300;
  const maxRadius = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);

  let startTime = null;

  function animateMask(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const radius = easedProgress * maxRadius;

    const maskValue = `radial-gradient(circle ${radius}px at ${centerX} ${centerY}, transparent 0%, transparent 70%, rgba(0,0,0,0.5) 85%, black 100%)`;

    blurOverlay.style.webkitMaskImage = maskValue;
    blurOverlay.style.maskImage = maskValue;

    if (progress < 1) {
      requestAnimationFrame(animateMask);
    } else {
      blurOverlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  // 최상단일 때만 실행
  if (window.scrollY === 0) {
    setTimeout(() => {
      requestAnimationFrame(animateMask);
    }, startDelay);
  } else {
    blurOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});


//커서
const cursorDot = document.querySelector('.cursor-dot');
const interview = document.getElementById('highlightSection');

document.addEventListener('mousemove', (e) => {
  cursorDot.style.top = `${e.clientY}px`;
  cursorDot.style.left = `${e.clientX}px`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.target.id === 'highlightSection' && entry.isIntersecting) {
      cursorDot.classList.remove('default');
      cursorDot.classList.add('interview');
    }
  });

  const anyVisible = entries.some(entry => entry.isIntersecting);
  if (!anyVisible) {
    cursorDot.classList.remove('interview');
    cursorDot.classList.add('default');
  }
}, { threshold: 0.3 });

if (interview) observer.observe(interview);

//스크롤 바
const scrollBar = document.getElementById("scrollProgress");
const scrollBg = document.getElementById("scrollProgress-bg");
const scrollNms = document.querySelectorAll(".scrollProgress-nm");
const highlightSection = document.getElementById("highlightSection");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;

  scrollBar.style.height = scrollPercent + "%";

  const rect = highlightSection.getBoundingClientRect();
  const sectionHeight = rect.height;
  const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

  const inView = visibleHeight > sectionHeight / 2;

  if (inView) {
    scrollBar.style.backgroundColor = "#fff"; 
    scrollBg.classList.add("active");
    scrollNms.forEach(el => el.classList.add("active"));
  } else {
    scrollBar.style.backgroundColor = "#9181ff";
    scrollBg.classList.remove("active");
    scrollNms.forEach(el => el.classList.remove("active"));
  }
});

// 타이핑 애니메이션
const text = "Web Publisher !";
const cursor = document.getElementById("cursor");
const typingText = document.getElementById("typing-text");

let index = 0;

function type() {
    cursor.classList.remove("blink");
    if (index < text.length) {
        typingText.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100);
    } else {
        cursor.classList.add("blink");
        setTimeout(deleteText, 2000);
    }
}

function deleteText() {
    cursor.classList.remove("blink"); 
    if (index > 0) {
        typingText.textContent = typingText.textContent.slice(0, -1);
        index--;
        setTimeout(deleteText, 100);
    } else {
        setTimeout(type, 500);
    }
}

type();

const swiper = new Swiper('.mySwiper', {
  slidesPerView: 1.2, 
  spaceBetween: 50,
  loop: true,
  centeredSlides: false,
  on: {
    init: setBlurEffect,
    slideChangeTransitionStart: setBlurEffect
  }
});

function setBlurEffect() {
  document.querySelectorAll('.swiper-slide').forEach((slide) => {
    slide.classList.remove('blurred');
  });

  document.querySelectorAll('.swiper-slide:not(.swiper-slide-active)').forEach((slide) => {
    slide.classList.add('blurred');
  });
}

//도트 모션
 document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector('.section.stack');
    const targets = section.querySelectorAll('.bot > div'); 

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          targets.forEach(target => {
            target.classList.remove('show');
            target.querySelectorAll('.dots').forEach(dotGroup => {
              dotGroup.classList.remove('animate');
            });
           
            void target.offsetWidth;

            target.classList.add('show');
            target.querySelectorAll('.dots').forEach(dotGroup => {
              dotGroup.classList.add('animate');
            });
          });
        } else {
          targets.forEach(target => {
            target.classList.remove('show');
            target.querySelectorAll('.dots').forEach(dotGroup => {
              dotGroup.classList.remove('animate');
            });
          });
        }
      });
    }, { threshold: 0.3 });

    if (section) observer.observe(section);
  });

  //상가나라 팝업
  function openPopup(e) {
  e.preventDefault(); 
  const url = e.currentTarget.href;
  window.open(
    url,
    'popupWindow',
    'width=500,height=500,resizable=yes,scrollbars=yes'
  );
}

//코드 모달
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

document.querySelectorAll(".pop").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const targetId = btn.getAttribute("data-target");
    const href = btn.getAttribute("href");

    if (targetId) {
      // 코드 버튼 클릭 시
      e.preventDefault();

      // .html 파일 로드
      fetch(`${targetId}.html`)
        .then(response => response.text())
        .then(data => {
          const modalBody = document.getElementById("modal-body");
          modalBody.innerHTML = `<pre><code class="language-javascript">${data}</code></pre>`;
          Prism.highlightElement(modalBody.querySelector('code'));
          
          document.getElementById("modal").style.display = "flex";

          const scrollBarWidth = getScrollbarWidth();
          document.body.style.overflow = "hidden";
          document.body.style.paddingRight = `${scrollBarWidth}px`;
        })
        .catch(error => {
          console.error("코드 파일 로딩 실패:", error);
          alert("코드 파일을 불러올 수 없습니다.");
        });

    } else if (href) {
     
    } else {
      e.preventDefault();
    }
  });
});

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

document.querySelector(".close").addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target.id === "modal") {
    closeModal();
  }
});

//상페 모달
  document.querySelectorAll(".view").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("modal2").style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  document.querySelector(".modal2-close").addEventListener("click", function () {
    document.getElementById("modal2").style.display = "none";
    document.body.style.overflow = "";
  });

