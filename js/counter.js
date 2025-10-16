document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.feature-box h3');
  const speed = 200; // The lower the slower

  const animateCounter = (counter) => {
    const updateCount = () => {
      const target = +counter.innerText.replace(/\D/g, '');
      const count = +counter.innerText.replace(/\D/g, '');

      // Lower inc to slow and higher to slow
      const inc = target / speed;

      // Check if target is reached
      if (count < target) {
        // Add inc to count and output in counter
        counter.innerText = Math.ceil(count + inc) + '+';
        // Call function every ms
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target + '+';
      }
    };

    updateCount();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  counters.forEach(counter => {
    observer.observe(counter);
  });
});