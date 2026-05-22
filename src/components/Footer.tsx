export default function Footer() {
  return (
    <footer className="kni-footer">
      <div className="footer-divider" />
      <div className="kni-footer-inner">
        
        {/* Left: SDG */}
        <div className="footer-sdg">
          <img
            src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-04.jpg"
            alt="SDG 4 Quality Education"
          />
          <div className="footer-sdg-text">
            <h4>Aligned with SDG 4: Quality Education</h4>
            <p>
              Kulay ng Isip promotes inclusive and equitable quality education
              by teaching children Color Theory through interactive gameplay.
            </p>
          </div>
        </div>

        {/* Center: copyright */}
        <div className="footer-copy">
          <span className="game-name">Kulay ng Isip</span>
          <p>TechTytes Studios &copy; {new Date().getFullYear()}</p>
        </div>

        {/* Right: logos */}
        <div className="footer-logos">
          <img src="https://i.imgur.com/kCqxe4i.png" alt="TechTytes Logo" />
          <img src="https://i.imgur.com/ClLKyGh.png" alt="Arterion Logo" />
        </div>

      </div>
    </footer>
  );
}