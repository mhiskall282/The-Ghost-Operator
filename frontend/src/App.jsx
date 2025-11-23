import React, { useEffect } from "react";

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        // Close mobile menu on link click
        setIsMobileMenuOpen(false);
      });
    });

    // Create floating particles
    function createParticles() {
      const particlesContainer = document.getElementById("particles");
      if (!particlesContainer) return;

      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 15 + "s";
        particle.style.animationDuration = Math.random() * 10 + 10 + "s";
        particlesContainer.appendChild(particle);
      }
    }

    // Handle navbar shadow on scroll
    window.addEventListener("scroll", () => {
      const nav = document.querySelector("nav");
      if (!nav) return;
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        nav.style.boxShadow = "0 2px 20px rgba(139, 92, 246, 0.4)";
      } else {
        nav.style.boxShadow = "0 2px 20px rgba(139, 92, 246, 0.3)";
      }
    });

    // Animate elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    document.querySelectorAll(".feature-card, .step").forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
      observer.observe(el);
    });

    createParticles();
  }, []);

  const scrollToSection = id => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleImageClick = (e) => {
    const img = e.currentTarget;
    // Remove any existing animation class first
    img.classList.remove('animate');
    // Force reflow to restart animation
    void img.offsetWidth;
    // Add animation class
    img.classList.add('animate');
    setTimeout(() => {
      img.classList.remove('animate');
    }, 600);
  };

  return (
    <>
      {/* ---- GLOBAL CSS ---- */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --primary: #8b5cf6;
          --secondary: #6d28d9;
          --accent: #a78bfa;
          --dark-purple: #1e1b4b;
          --darker-purple: #0f172a;
          --light-purple: #4c1d95;
          --text: #e9d5ff;
          --text-light: #c4b5fd;
          --white: #ffffff;
        }
        body {
          font-family: 'Inter', sans-serif;
          color: var(--text);
          line-height: 1.7;
          overflow-x: hidden;
          background: var(--darker-purple);
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        #root {
          width: 100%;
          min-height: 100vh;
        }
        nav {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(30, 27, 75, 0.9);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          box-shadow: 0 2px 20px rgba(139, 92, 246, 0.3);
          animation: slideDown 0.5s ease-out;
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .logo {
          display: flex; align-items: center; gap: 0.75rem; text-decoration: none;
        }
        .logo img {
          height: 40px;
          width: auto;
          max-width: 200px;
          object-fit: contain;
          object-position: center;
          filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
          transition: all 0.3s;
          animation: logoGlow 3s ease-in-out infinite;
        }
        @keyframes logoGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.8)); }
        }
        .logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent), var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from { filter: drop-shadow(0 0 5px rgba(139, 92, 246, 0.5)); }
          to { filter: drop-shadow(0 0 15px rgba(167, 139, 250, 0.8)); }
        }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a {
          text-decoration: none; color: var(--text-light);
          font-weight: 500; font-family: 'Space Grotesk';
          transition: all 0.3s; position: relative;
        }
        .nav-links a::after {
          content: ''; position: absolute; bottom: -5px; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          transition: width 0.3s;
        }
        .nav-links a:hover { color: var(--accent); }
        .nav-links a:hover::after { width: 100%; }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1001;
        }
        .hamburger span {
          width: 25px;
          height: 3px;
          background: var(--accent);
          border-radius: 2px;
          transition: all 0.3s;
        }
        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }
        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        .mobile-only {
          display: none;
        }
        .desktop-only {
          display: inline-block;
        }

        .cta-button {
          padding: 0.8rem 1.8rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white; border-radius: 50px;
          text-decoration: none; font-weight: 600;
          position: relative; overflow: hidden;
          transition: all 0.3s;
          display: inline-block;
          border: none;
          cursor: pointer;
        }
        .cta-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .cta-button:hover::before {
          width: 300px;
          height: 300px;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }
        .cta-button span {
          position: relative;
          z-index: 1;
        }

        /* -------- HERO SECTION -------- */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e1b4b, #0f172a, #1e1b4b);
          padding-top: 80px;
          position: relative;
        }
        .hero-content {
          max-width: 1200px; padding: 2rem;
          display: grid; gap: 3rem;
          grid-template-columns: 1fr 1fr;
          align-items: center;
        }
        .hero-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .hero-image img {
          width: 100%;
          height: 100%;
          max-height: 500px;
          border-radius: 20px;
          filter: drop-shadow(0 0 30px rgba(139,92,246,0.6));
          background: rgba(139, 92, 246, 0.1);
          object-fit: contain;
          object-position: center;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .hero-image img:hover {
          transform: scale(1.05);
          filter: drop-shadow(0 0 40px rgba(139,92,246,0.9));
        }
        .hero-image img:active {
          transform: scale(0.98);
        }
        @keyframes heroPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .hero-image img.animate {
          animation: heroPulse 0.6s ease;
        }
        .particles { position: absolute; width: 100%; height: 100%; }

        .particle {
          position: absolute;
          width: 4px; height: 4px;
          background: var(--accent);
          border-radius: 50%;
          opacity: 0.6;
          animation: particleFloat 15s infinite;
        }
        @keyframes particleFloat {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 0.6; }
          100% { transform: translateY(-100px); opacity: 0; }
        }

        /* FEATURES */
        .features { padding: 6rem 2rem; }
        .container { max-width: 1200px; margin: auto; }
        .features-grid {
          display: grid; gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        .feature-card {
          background: transparent;
          padding: 2rem;
          border-radius: 0;
          border: none;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
        }

        /* STEPS */
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        
        /* CTA */
        .cta-section {
          padding: 6rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, var(--dark-purple), var(--secondary), var(--primary));
        }

        /* FOOTER */
        footer {
          padding: 3rem 2rem; text-align: center;
          border-top: 1px solid rgba(139,92,246,0.2);
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .footer-links a {
          color: var(--text-light);
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-links a:hover {
          color: var(--accent);
        }

        /* HERO STYLES */
        .hero h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          background: linear-gradient(135deg, var(--text), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Space Grotesk', sans-serif;
          word-wrap: break-word;
          hyphens: auto;
        }
        .hero h1 br {
          display: block;
        }
        .subtitle {
          font-size: 1.25rem;
          color: var(--text-light);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn-primary, .btn-secondary {
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before, .btn-secondary::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .btn-primary:hover::before, .btn-secondary:hover::before {
          width: 300px;
          height: 300px;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }
        .btn-primary span, .btn-secondary span {
          position: relative;
          z-index: 1;
        }
        .btn-secondary {
          background: transparent;
          color: var(--text-light);
          border: 2px solid rgba(139, 92, 246, 0.5);
        }
        .btn-secondary:hover {
          border-color: var(--primary);
          color: var(--accent);
          transform: translateY(-2px);
        }

        /* SECTION STYLES */
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
          font-family: 'Space Grotesk', sans-serif;
          background: linear-gradient(135deg, var(--text), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .section-subtitle {
          font-size: 1.1rem;
          text-align: center;
          color: var(--text-light);
          margin-bottom: 3rem;
        }

        /* FEATURE CARD STYLES */
        .feature-card h3 {
          font-size: 1.5rem;
          margin: 0 0 1rem;
          font-family: 'Space Grotesk', sans-serif;
          color: var(--accent);
          font-weight: 600;
        }
        .feature-card p {
          color: var(--text-light);
          line-height: 1.6;
          margin: 0;
        }
        .feature-image {
          width: 100%;
          max-width: 400px;
          height: 280px;
          object-fit: cover;
          object-position: center;
          border-radius: 20px;
          margin: 0 auto 1.5rem;
          display: block;
          background: transparent;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
        .feature-image:hover {
          transform: scale(1.05);
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.8));
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
        }
        .feature-image:active {
          transform: scale(0.95);
        }
        @keyframes imagePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .feature-image.animate {
          animation: imagePulse 0.6s ease;
        }

        /* HOW IT WORKS SECTION */
        .how-it-works {
          padding: 6rem 2rem;
          background: rgba(30, 27, 75, 0.3);
        }
        .step {
          background: rgba(139, 92, 246, 0.1);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(139, 92, 246, 0.2);
          text-align: center;
        }
        .step-number {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 auto 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
        }
        .step h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--accent);
          font-family: 'Space Grotesk', sans-serif;
        }
        .step p {
          color: var(--text-light);
          line-height: 1.6;
        }
        .character-image {
          width: 100%;
          max-width: 250px;
          height: auto;
          border-radius: 20px;
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
          object-fit: contain;
          object-position: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .character-image:hover {
          transform: scale(1.1) rotate(2deg);
          filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.8));
        }
        .character-image:active {
          transform: scale(0.95) rotate(-2deg);
        }
        @keyframes characterSpin {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .character-image.animate {
          animation: characterSpin 0.6s ease;
        }

        /* CTA SECTION */
        .cta-section h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-family: 'Space Grotesk', sans-serif;
        }
        .cta-section p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: var(--text-light);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .mobile-only {
            display: block;
          }
          .desktop-only {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            height: 100vh;
            width: 70%;
            max-width: 300px;
            background: rgba(30, 27, 75, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 6rem 2rem 2rem;
            gap: 2rem;
            transition: right 0.3s ease;
            box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
          }
          .nav-links.active {
            right: 0;
          }
          .nav-links li {
            width: 100%;
          }
          .nav-links a {
            display: block;
            padding: 1rem;
            font-size: 1.1rem;
          }
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 1rem;
          }
          .hero h1 {
            font-size: 2rem;
            line-height: 1.3;
          }
          .hero h1 br {
            display: none;
          }
          .hero-image img {
            max-height: 300px;
          }
          .hero-buttons {
            justify-content: center;
          }
          nav {
            padding: 1rem;
          }
          .logo-text {
            font-size: 1.25rem;
          }
          .cta-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
          .feature-image {
            max-width: 280px;
            height: 200px;
          }
          .character-image {
            max-width: 200px;
          }
          .steps {
            grid-template-columns: 1fr;
          }
          .section-title {
            font-size: 2rem;
          }
          .subtitle {
            font-size: 1rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .steps {
            grid-template-columns: repeat(2, 1fr);
          }
          .hero h1 {
            font-size: 2.8rem;
          }
        }

        @media (max-width: 480px) {
          .hero h1 {
            font-size: 1.75rem;
          }
          .btn-primary, .btn-secondary {
            padding: 0.8rem 1.5rem;
            font-size: 0.9rem;
          }
          .section-title {
            font-size: 1.75rem;
          }
          .feature-image {
            max-width: 240px;
            height: 180px;
          }
        }
      `}</style>

      {/* ================= NAVIGATION ================= */}
      <nav>
        <a href="#" className="logo">
          <img src="/images/images/logo.png" alt="GhostBounties Logo" />
          <span className="logo-text">GhostBounties</span>
        </a>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#docs">Docs</a></li>
          <li className="mobile-only"><a href="#get-started">Get Started</a></li>
        </ul>

        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <a href="#get-started" className="cta-button desktop-only">
          <span>Get Started</span>
        </a>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-content">
          <div>
            <h1>Get Paid for GitHub Tasks<br />Without Sharing Secrets</h1>
            <p className="subtitle">
              Zero-knowledge proofs. Instant payments. No API keys. No trust required.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => scrollToSection("get-started")}>
                <span>Start Earning</span>
              </button>
              <button className="btn-secondary" onClick={() => scrollToSection("how-it-works")}>
                Learn More
              </button>
            </div>
          </div>

          <div className="hero-image">
            <img src="/images/images/hero-image.jpeg" alt="GhostBounties Hero" onClick={(e) => handleImageClick(e)} />
          </div>

          <div className="particles" id="particles"></div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">Why GhostBounties?</h2>
          <p className="section-subtitle">
            The trustless way to earn crypto by completing verifiable GitHub actions
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <img src="/images/feature-3.jpeg" className="feature-image" alt="Privacy First" onClick={(e) => handleImageClick(e)} />
              <h3>Privacy First</h3>
              <p>Never share GitHub cookies or credentials.</p>
            </div>

            <div className="feature-card">
              <img src="/images/images/feature-1.jpeg" className="feature-image" alt="Instant Payments" onClick={(e) => handleImageClick(e)} />
              <h3>Instant Payments</h3>
              <p>Smart contracts pay instantly when your proof is valid.</p>
            </div>

            <div className="feature-card">
              <img src="/images/feature-4.jpeg" className="feature-image" alt="Chat Native" onClick={(e) => handleImageClick(e)} />
              <h3>Chat-Native</h3>
              <p>Chat with the bot via XMTP. No dashboard needed.</p>
            </div>

            <div className="feature-card">
              <img src="/images/images/feature-2.jpeg" className="feature-image" alt="Build Reputation" onClick={(e) => handleImageClick(e)} />
              <h3>Build Reputation</h3>
              <p>Every proof boosts your decentralized GitHub reputation.</p>
            </div>

            <div className="feature-card">
              <img src="/images/feature-5.jpeg" className="feature-image" alt="Fully Automated" onClick={(e) => handleImageClick(e)} />
              <h3>Fully Automated</h3>
              <p>Fluence handles verification. Polygon handles payouts.</p>
            </div>

            <div className="feature-card">
              <img src="/images/images/feature-1.jpeg" className="feature-image" alt="Trustless & Decentralized" onClick={(e) => handleImageClick(e)} />
              <h3>Trustless & Decentralized</h3>
              <p>ZK-TLS, decentralized compute, and unstoppable payouts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">From task to payment in minutes</p>

          <div style={{ textAlign: "center", margin: "3rem 0" }}>
            <img
              src="/images/feature-6.jpeg"
              className="character-image"
              style={{ maxWidth: "250px" }}
              alt="How It Works"
              onClick={(e) => handleImageClick(e)}
            />
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Ask What's Available</h3>
              <p>Message the bot on XMTP.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Get Assigned a Task</h3>
              <p>The bot tells you what to do.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Do the Thing</h3>
              <p>Star, fork, or edit the repo.</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Generate a Proof</h3>
              <p>Click link → vlayer generates ZK proof.</p>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <h3>Submit Proof</h3>
              <p>Send proof ID back via XMTP.</p>
            </div>

            <div className="step">
              <div className="step-number">6</div>
              <h3>Get Paid</h3>
              <p>Polygon contract releases USDC instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section" id="get-started">
        <div className="container">
          <h2>Ready to Start Earning?</h2>
          <p>No sign-ups. No KYC. Just chat and earn.</p>

          <a
            href="https://github.com/your-org/ghost-bot"
            className="cta-button"
            style={{ background: "white", color: "var(--primary)" }}
          >
            <span>View on GitHub</span>
          </a>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="container">
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="https://github.com/your-org/ghost-bot">GitHub</a>
            <a href="/README.md">Documentation</a>
          </div>
          <p>© 2025 GhostBounties. Built with ❤️ using Fluence, XMTP, vlayer, Polygon, SQD.</p>
        </div>
      </footer>
    </>
  );
}