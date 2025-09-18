
    document.addEventListener('DOMContentLoaded', function() {
      // Variables
      const body = document.body;
      const homePage = document.getElementById('homepage');
      const mainContent = document.getElementById('main-content');
      const enterButton = document.getElementById('enter-button');
      const homeButton = document.getElementById('home-button');
      const footerHomeButton = document.getElementById('footer-home-button');
      const themeButtons = document.querySelectorAll('.theme-btn');
      const hamburgerButton = document.querySelector('.hamburger');
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
      const loginButton = document.getElementById('login-button');
      const mobileLoginButton = document.getElementById('mobile-login-button');
      const loginModal = document.getElementById('login-modal');
      const loginForm = document.getElementById('login-form');
      const loginError = document.getElementById('login-error');
      const closeModal = document.querySelector('.close-modal');
      const contactForm = document.getElementById('contact-form');
      const logoutButton = document.getElementById('logout-button');
      const dashboardSection = document.getElementById('dashboard');
      const sections = document.querySelectorAll('.section');
      const menuItems = document.querySelectorAll('.menu-item');
      
      // Initialize
      let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      // Set active theme from localStorage or default
      const savedTheme = localStorage.getItem('theme') || 'day';
      setTheme(savedTheme);
      
      // Check login state
      updateLoginState();
      
      // Handle login form submission
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Check for specific credentials
        if (username === 'correo13@gmail.com' && password === '123456') {
          localStorage.setItem('isLoggedIn', 'true');
          isLoggedIn = true;
          updateLoginState();
          closeLoginModal();
          showNotification('¡Inicio de sesión exitoso!', 'success');
        } else {
          loginError.style.display = 'block';
          loginError.textContent = 'Credenciales incorrectas (solo administrador permitido)';
        }
      });
      
      // Function to handle scrolling and section visibility
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 200;
          const sectionId = section.getAttribute('id');
          
          if (scrollPosition >= sectionTop) {
            section.classList.add('visible');
            
            // Update active menu item
            menuItems.forEach(item => {
              item.classList.remove('active');
              if (item.getAttribute('href') === `#${sectionId}`) {
                item.classList.add('active');
              }
            });
          }
        });
      };
      
      // Event Listeners
      window.addEventListener('scroll', handleScroll);
      
      // Enter button - hide homepage and show main content
      enterButton.addEventListener('click', function() {
        homePage.classList.add('hidden');
      });
      
      // Home button - show homepage
      homeButton.addEventListener('click', () => {
        homePage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      
      // Footer home button - show homepage
      footerHomeButton.addEventListener('click', () => {
        homePage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      
      // Theme switcher
      themeButtons.forEach(button => {
        button.addEventListener('click', function() {
          const theme = this.getAttribute('data-theme');
          setTheme(theme);
          
          // Save theme preference
          localStorage.setItem('theme', theme);
        });
      });
      
      // Mobile menu toggle
      hamburgerButton.addEventListener('click', function() {
        this.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });
      
      // Mobile menu items click - close menu
      mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
          hamburgerButton.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
      
      // Login modal
      loginButton.addEventListener('click', openLoginModal);
      mobileLoginButton.addEventListener('click', openLoginModal);
      closeModal.addEventListener('click', closeLoginModal);
      
      // Close modal when clicking outside
      window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
          closeLoginModal();
        }
      });
      
      // Logout button
      logoutButton.addEventListener('click', function() {
        localStorage.setItem('isLoggedIn', 'false');
        updateLoginState();
        
        // Show notification
        showNotification('Sesión cerrada correctamente', 'info');
      });
      
      // Contact form submission
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // For the prototype, we'll just show a success message
        showNotification('¡Mensaje enviado correctamente!', 'success');
        contactForm.reset();
      });
      
      // Functions
      function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        themeButtons.forEach(btn => {
          btn.classList.remove('active');
          if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
          }
        });
        
        // Update login button visibility based on theme
        updateLoginButtonVisibility();
      }

      function updateLoginButtonVisibility() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'night') {
          loginButton.style.display = 'block';
          mobileLoginButton.style.display = 'block';
        } else {
          loginButton.style.display = 'none';
          mobileLoginButton.style.display = 'none';
        }
      }
      
      function openLoginModal() {
        loginModal.classList.add('active');
        // Reset any previous error messages
        loginError.style.display = 'none';
        loginError.textContent = '';
        loginForm.reset();
      }
      
      function closeLoginModal() {
        loginModal.classList.remove('active');
        loginForm.reset();
      }
      
      function updateLoginState() {
        if (isLoggedIn) {
          loginButton.innerHTML = '<i class="fas fa-user-check mr-2"></i>Mi Cuenta';
          mobileLoginButton.innerHTML = '<i class="fas fa-user-check mr-2"></i>Mi Cuenta';
          dashboardSection.classList.add('active');
        } else {
          loginButton.innerHTML = '<i class="fas fa-user mr-2"></i>Ingresar';
          mobileLoginButton.innerHTML = '<i class="fas fa-user mr-2"></i>Ingresar';
          dashboardSection.classList.remove('active');
        }
      }
      
      function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 transform transition-all duration-300 opacity-0 translate-y-8`;
        
        // Set background color based on notification type
        if (type === 'success') {
          notification.classList.add('bg-green-500');
        } else if (type === 'error') {
          notification.classList.add('bg-red-500');
        } else {
          notification.classList.add('bg-blue-500');
        }
        
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
          notification.classList.remove('opacity-0', 'translate-y-8');
        }, 100);
        
        // Hide and remove notification after 3 seconds
        setTimeout(() => {
          notification.classList.add('opacity-0', 'translate-y-8');
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 3000);
      }
     
      
      // Initialize - Show sections that are already visible
      handleScroll();
    }
  );
  