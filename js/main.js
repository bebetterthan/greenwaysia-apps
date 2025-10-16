console.log("main.js loaded and executing");
document.addEventListener('DOMContentLoaded', () => {
  const isMapPage = document.title.includes("Map");

  // Set map-page class FIRST before anything else
  if (isMapPage) {
    document.body.classList.add('map-page');
    console.log('Map page detected, added map-page class to body');
  }

  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger-menu');
  const closeMenu = document.querySelector('.close-menu');
  const navWrapper = document.querySelector('.nav-wrapper');
  const overlay = document.querySelector('.overlay');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const recenterBtn = document.querySelector('.recenter-btn');

  console.log('Hamburger:', hamburger);
  console.log('navWrapper:', navWrapper);
  console.log('closeMenu:', closeMenu);
  console.log('overlay:', overlay);
  console.log('Is Map Page:', isMapPage);

  if (hamburger && navWrapper && closeMenu) {
    console.log('All elements found, adding event listeners.');
    hamburger.addEventListener('click', () => {
      console.log('Hamburger menu clicked, isMapPage:', isMapPage);
      navWrapper.classList.add('active');

      // Hide hamburger icon itself when menu opens
      if (hamburger) {
        hamburger.classList.add('hidden');
        console.log('Hiding hamburger icon');
      }

      // Hide map controls ONLY on map page when navigation menu opens
      if (isMapPage) {
        if (sidebarToggle) {
          sidebarToggle.classList.add('hidden');
          console.log('Hiding sidebar toggle (map page)');
        }
        if (recenterBtn) {
          recenterBtn.classList.add('hidden');
          console.log('Hiding recenter button (map page)');
        }
      }

      // Only show overlay on non-map pages
      if (overlay && !isMapPage) {
        overlay.classList.add('active');
        overlay.classList.add('nav-overlay');
        console.log('Overlay activated (non-map page)');
      } else {
        console.log('Overlay NOT activated (map page)');
      }
    });

    const closeSidebar = () => {
      console.log('Closing sidebar, isMapPage:', isMapPage);
      navWrapper.classList.remove('active');

      // Show hamburger icon when menu closes
      if (hamburger) {
        hamburger.classList.remove('hidden');
        console.log('Showing hamburger icon');
      }

      // Show map controls again ONLY on map page when menu closes
      if (isMapPage) {
        if (sidebarToggle) {
          sidebarToggle.classList.remove('hidden');
          console.log('Showing sidebar toggle (map page)');
        }
        if (recenterBtn) {
          recenterBtn.classList.remove('hidden');
          console.log('Showing recenter button (map page)');
        }
      }

      if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.remove('nav-overlay');
        console.log('Overlay removed');
      }
    };

    closeMenu.addEventListener('click', closeSidebar);

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (overlay.classList.contains('nav-overlay')) {
          closeSidebar();
        }
      });
    }
  }
});
