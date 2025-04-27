/**
 * Sets up hero section video transitions with fade effects and automatic rotation
 */
export function setupVideoTransitions() {
  const videoSlider = document.querySelector("#video-slider");
  const videoButtons = document.querySelectorAll(".vid-btn");
  let currentVideoIndex = 0;
  let isTransitioning = false;
  let rotationInterval;
  
  if (!videoSlider || !videoButtons.length) return;
  
  const fadeOverlay = document.createElement('div');
  fadeOverlay.className = 'video-fade-overlay';
  videoSlider.parentNode.appendChild(fadeOverlay);
  
  if (!document.querySelector(".controls .active")) {
    videoButtons[0].classList.add("active");
  }
  
  const activeButton = document.querySelector(".controls .active");
  if (activeButton) {
    const initialSrc = activeButton.getAttribute("data-src");
    if (initialSrc && videoSlider.src !== initialSrc) {
      videoSlider.src = initialSrc;
    }
    
    videoButtons.forEach((btn, index) => {
      if (btn === activeButton) {
        currentVideoIndex = index;
      }
    });
  }
  
  videoSlider.style.opacity = '1';
  videoSlider.style.backgroundColor = '#000';
  videoSlider.play().catch(e => console.log("Autoplay prevented:", e));
  
  videoButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (isTransitioning) return;
      
      resetRotationTimer();
      
      changeVideoWithTransition(index);
    });
  });
  
  startRotationTimer();
  
  function startRotationTimer() {
    if (rotationInterval) {
      clearInterval(rotationInterval);
    }
    
    rotationInterval = setInterval(() => {
      if (isTransitioning) return;
      const nextIndex = (currentVideoIndex + 1) % videoButtons.length;
      changeVideoWithTransition(nextIndex);
    }, 8000);
  }
  
  function resetRotationTimer() {
    clearInterval(rotationInterval);
    startRotationTimer();
  }
  
  function changeVideoWithTransition(newIndex) {
    if (isTransitioning || currentVideoIndex === newIndex) return;
    
    isTransitioning = true;
    
    document.querySelector(".controls .active").classList.remove("active");
    videoButtons[newIndex].classList.add("active");
    
    fadeOverlay.classList.add('fade-active');
    
    setTimeout(() => {
      const newSrc = videoButtons[newIndex].getAttribute('data-src');
      videoSlider.src = newSrc;
      currentVideoIndex = newIndex;
      
      videoSlider.load();
      videoSlider.play().catch(e => console.log("Autoplay prevented:", e));
      
      const videoLoadHandler = () => {
        setTimeout(() => {
          fadeOverlay.classList.remove('fade-active');
          isTransitioning = false;
        }, 300);
        
        videoSlider.removeEventListener('canplay', videoLoadHandler);
      };
      
      videoSlider.addEventListener('canplay', videoLoadHandler);
      
      setTimeout(() => {
        if (isTransitioning) {
          fadeOverlay.classList.remove('fade-active');
          isTransitioning = false;
        }
      }, 2000);
    }, 500);
  }
  
  videoSlider.addEventListener('loadeddata', () => {
    videoSlider.play().catch(e => console.log("Autoplay prevented:", e));
  });
  
  videoSlider.addEventListener('ended', () => {
    const nextIndex = (currentVideoIndex + 1) % videoButtons.length;
    changeVideoWithTransition(nextIndex);
  });
}

export default setupVideoTransitions;
