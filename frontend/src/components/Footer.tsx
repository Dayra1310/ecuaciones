import logo from "../assets/logo-uniputumayo.webp";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Logo Uniputumayo" />
        </div>
        <div className="footer-info">
          <p className="footer-copyright">
            © 2026 Copyrights by Uniputumayo. All Rights Reserved.
          </p>
          <p className="footer-tutor">
            <strong>Tutor:</strong> Titto Amauryt
          </p>
          <p className="footer-students">
            <strong>Estudiantes:</strong> Coetata Karen, Lopez Valery, Quenguan Dayra, Ruales Dessiree, Valencia Julio
          </p>
          <p className="footer-details">
            Cuarto semestre · Tecnología en Desarrollo de Software · Ecuaciones Diferenciales
          </p>
        </div>
      </div>
    </footer>
  );
}
