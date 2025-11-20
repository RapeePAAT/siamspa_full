  const loader = document.getElementById('fullScreenLoader');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    let progress = 0;

    // Simulate loading progress
    const loadingInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 15;
        updateProgress(Math.min(progress, 90));
      }
    }, 150);

    function updateProgress(percent) {
      progressBar.style.width = percent + '%';
      progressPercent.textContent = Math.round(percent) + '%';
    }

    // เมื่อหน้าเว็บโหลดเสร็จ
    window.addEventListener('load', function() {
      clearInterval(loadingInterval);
      
      // Update to 100%
      updateProgress(100);
      
      // Hide loader after a short delay
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
      }, 500);
    });

    // Minimum loading time (ป้องกันกรณีโหลดเร็วเกินไป)
    const minLoadTime = 1500;
    const startTime = Date.now();

    window.addEventListener('load', function() {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);
      
      setTimeout(() => {
        clearInterval(loadingInterval);
        updateProgress(100);
        
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.classList.remove('loading');
          document.body.classList.add('loaded');
        }, 500);
      }, remainingTime);
    });