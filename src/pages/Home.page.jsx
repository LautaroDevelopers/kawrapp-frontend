import { useState, useEffect, useRef } from 'react';

export const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState({0: 0, 1: 0});
  const [menuOpen, setMenuOpen] = useState(false);
  const carousel1Ref = useRef(null);
  const carousel2Ref = useRef(null);
  const carouselIntervals = useRef([]);

  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para inicializar los carruseles
  useEffect(() => {
    const carousels = [carousel1Ref.current, carousel2Ref.current];
    const observerOptions = { threshold: 0.5 };
    // Copy the ref value to a local variable
    const intervals = carouselIntervals.current;
    
    const observers = carousels.map((carousel, index) => {
      if (!carousel) return null;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Iniciar carrusel cuando es visible
            const intervalId = setInterval(() => {
              setActiveItem(prev => ({
                ...prev,
                [index]: (prev[index] + 1) % 3
              }));
            }, 4000);
            
            intervals[index] = intervalId;
          } else if (intervals[index]) {
            // Limpiar intervalo cuando no es visible
            clearInterval(intervals[index]);
          }
        });
      }, observerOptions);
      
      observer.observe(carousel);
      return observer;
    });
    
    // Limpieza al desmontar
    return () => {
      observers.forEach((observer, index) => {
        if (observer) {
          observer.disconnect();
        }
        if (intervals[index]) {
          clearInterval(intervals[index]);
        }
      });
    };
  }, []);


  // Manejadores de eventos para el menú móvil
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="home-container">
      <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-brand">
            <img src="/img/logo.png" alt="Logo Kawra" className="brand-logo" />
            <span className="brand-text">Kawra</span>
          </div>
          <button className="menu-toggle" aria-label="Abrir menú" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </button>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><a href="#inicio" onClick={closeMenu}>Inicio</a></li>
            <li><a href="#productos" onClick={closeMenu}>Productos</a></li>
            <li><a href="#nosotros" onClick={closeMenu}>Nosotros</a></li>
            <li><a href="#vision" onClick={closeMenu}>Visión</a></li>
            <li><a href="#contacto" onClick={closeMenu}>Contacto</a></li>
            <li><a href="/auth/login" onClick={closeMenu}>Iniciar Sesión</a></li>
          </ul>
        </div>
      </nav>

      <section className="hero" id="inicio">
        <div className="hero-content">
          <h1>Monte Quesero & Casa Kawra</h1>
          <p>Elaborados con leche de cabras en libre pastoreo, siguiendo métodos tradicionales y con amor por lo artesanal</p>
        </div>
      </section>

      <section className="section" id="productos">
        <h2 className="section-title">Nuestros Productos</h2>
        <div className="products">
          <div className="product-card">
            <img src="/img/queso.png" alt="Queso Blando Fresco" />
            <h3>Queso Blando Fresco</h3>
            <p>Suave y delicado, con textura cremosa y sabor delicadamente lácteo. Ideal para ensaladas y acompañamientos.</p>
          </div>
          <div className="product-card">
            <img src="/img/quesoUntable.png" alt="Queso Untable" />
            <h3>Queso Untable</h3>
            <p>Cremoso y versátil, perfecto para untar en panes y tostadas. Con la suavidad característica de la leche de cabra.</p>
          </div>
          <div className="product-card">
            <img src="/img/SemiDuro.png" alt="Queso Semi Duro" />
            <h3>Queso Semi Duro</h3>
            <p>Con carácter y personalidad, maduración media que le confiere un sabor equilibrado y una textura firme pero suave.</p>
          </div>
        </div>
      </section>

      <section className="section about" id="nosotros">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">Nuestra Historia</h2>
            <p>En Kawra, creemos en la producción sustentable y el bienestar animal. Nuestras cabras pastan libremente en las praderas naturales del este Mendocino, alimentándose de hierbas frescas y aromáticas que dan a nuestros quesos su sabor único.</p>
            <p>Cada queso es elaborado artesanalmente, siguiendo recetas tradicionales y cuidando cada detalle del proceso, desde el ordeñe hasta la maduración.</p>
            <p>Monte Quesero & Casa Kawra une quesería boutique con alojamiento rural inmersivo. Visión: ser referente nacional en triple impacto, fusionando producción gourmet y experiencias auténticas saliendo de la convencional ruta del vino y agregando valor al este Mendocino.</p>
          </div>
          <div className="about-image">
            <div className="carousel" ref={carousel1Ref}>
              <div className={`carousel-item ${activeItem[0] === 0 ? 'active' : ''}`}>
                <img src="/img/pastandoUno.jpeg" alt="Cabras pastando en libertad 1" />
              </div>
              <div className={`carousel-item ${activeItem[0] === 1 ? 'active' : ''}`}>
                <img src="/img/pastandoDos.jpeg" alt="Cabras pastando en libertad 2" />
              </div>
              <div className={`carousel-item ${activeItem[0] === 2 ? 'active' : ''}`}>
                <img src="/img/pastandoTres.jpeg" alt="Cabras pastando en libertad 3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about" id="vision">
        <div className="about-content">
          <div className="about-image">
            <div className="carousel" ref={carousel2Ref}>
              <div className={`carousel-item ${activeItem[1] === 0 ? 'active' : ''}`}>
                <img src="/img/img.jpeg" alt="Imagen uno" />
              </div>
              <div className={`carousel-item ${activeItem[1] === 1 ? 'active' : ''}`}>
                <img src="/img/imgDos.jpeg" alt="Imagen dos" />
              </div>
              <div className={`carousel-item ${activeItem[1] === 2 ? 'active' : ''}`}>
                <video width="100%" height="100%" autoPlay loop muted>
                  <source src="/img/videoUno.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            </div>
          </div>
          <div className="about-text">
            <h2 className="section-title">Visión a futuro</h2>
            <p>Se planea realizar una experiencia inmersiva con hospedaje en cabañas dentro del tambo donde el huésped podrá ordeñar, elabora su propio queso, degusta gastronomía km 0 y vive fogones bajo las estrellas.</p>
            <p>Dicho hospedaje será de construcción en quincha con energía solar, horno de barro, zonas de fogón, senderos y tienda de la finca, para crear una experiencia más cercana a la naturaleza y la tranquilidad del campo mendocino.</p>
          </div>
        </div>
      </section>

      <footer id="contacto">
        <h2 className="contact-title">Contacto</h2>
        <div className="contact-container">
          <div className="contact-info">
            <p><i className="fas fa-phone"></i> Teléfono: +54 261 662-1571</p>
            <p><i className="fas fa-envelope"></i> Email: kawra@gmail.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Dirección: Calle Galingneana Segura adyacente a ruta siete</p>
            <p><i className="fab fa-instagram"></i> Instagram: <a href="https://www.instagram.com/juanaabalsamo" target="_blank" rel="noopener noreferrer" className="social-link">@juanaabalsamo</a></p>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3337.4374358634543!2d-68.01697668526726!3d-33.29382598082059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDE3JzM3LjgiUyA2OMCwMDAnNTEuOSJX!5e0!3m2!1ses!2sar!4v1706636713803!5m2!1ses!2sar"
              width="100%"
              height="300"
              style={{border: 0}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa ubicación Kawra"
            />
            <a href="https://www.google.com/maps?q=-33.293826,-68.014424" target="_blank" rel="noopener noreferrer" className="map-link">
              <i className="fas fa-map-marked-alt"></i> Ver ubicación exacta en Google Maps
            </a>
          </div>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} Kawra - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}