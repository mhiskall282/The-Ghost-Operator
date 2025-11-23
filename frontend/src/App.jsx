import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
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

        .cta-button {
          padding: 0.8rem 1.8rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white; border-radius: 50px;
          text-decoration: none; font-weight: 600;
          position: relative; overflow: hidden;
          transition: all 0.3s;
          display: inline-block;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
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
        }
        .hero-image img {
          width: 100%; border-radius: 20px;
          filter: drop-shadow(0 0 30px rgba(139,92,246,0.6));
          background: rgba(139, 92, 246, 0.1);
          min-height: 400px;
          object-fit: cover;
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
          background: rgba(139,92,246,0.1);
          padding: 2.5rem; border-radius: 20px;
          border: 1px solid rgba(139,92,246,0.2);
          text-align: center;
        }

        /* STEPS */
        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
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
        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
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
          margin: 1.5rem 0 1rem;
          font-family: 'Space Grotesk', sans-serif;
          color: var(--accent);
        }
        .feature-card p {
          color: var(--text-light);
          line-height: 1.6;
        }
        .feature-image {
          width: 100%;
          max-width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 15px;
          margin-bottom: 1rem;
          background: rgba(139, 92, 246, 0.1);
        }
        .feature-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
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
          border-radius: 20px;
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
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
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero h1 {
            font-size: 2.5rem;
          }
          nav {
            padding: 1rem;
            flex-wrap: wrap;
          }
          .nav-links {
            gap: 1rem;
            font-size: 0.9rem;
          }
          .cta-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      {/* ================= NAVIGATION ================= */}
      <nav>
        <a href="#" className="logo">
          <img src="/images/HD%20Anonymous.jpeg" alt="GhostBounties Logo" />
          <span className="logo-text">GhostBounties</span>
        </a>

        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#docs">Docs</a></li>
        </ul>

        <a href="#get-started" className="cta-button">
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
            <img src="/images/HD%20Anonymous.jpeg" alt="GhostBounties Hero" />
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
              <img src="/images/_%20%2813%29.jpeg" className="feature-image" alt="Privacy First" />
              <h3>Privacy First</h3>
              <p>Never share GitHub cookies or credentials.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Instant Payments</h3>
              <p>Smart contracts pay instantly when your proof is valid.</p>
            </div>

            <div className="feature-card">
              <img src="/images/_%20%2814%29.jpeg" className="feature-image" alt="Chat Native" />
              <h3>Chat-Native</h3>
              <p>Chat with the bot via XMTP. No dashboard needed.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Build Reputation</h3>
              <p>Every proof boosts your decentralized GitHub reputation.</p>
            </div>

            <div className="feature-card">
              <img src="/images/_%20%2813%29.jpeg" className="feature-image" alt="Privacy First" />
              <h3>Fully Automated</h3>
              <p>Fluence handles verification. Polygon handles payouts.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
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
              src="/images/_%20%2815%29.jpeg"
              className="character-image"
              style={{ maxWidth: "250px" }}
              alt="How It Works"
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
          <p>© 2024 GhostBounties. Built with ❤️ using Fluence, XMTP, vlayer, Polygon, SQD.</p>
        </div>
      </footer>
    </>
  );
}