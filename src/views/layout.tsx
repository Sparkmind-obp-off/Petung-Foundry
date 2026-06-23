// Layout fragments: Header & Footer (dipakai semua halaman Pétung)
import { DisclaimerBox } from '../components/Disclaimer'

export const Header = () => (
  <header id="site-header" class="site-header">
    <nav class="nav-container">
      <a href="/" class="brand">
        <span class="brand-mark" aria-hidden="true">
          <i class="fas fa-compass-drafting"></i>
        </span>
        <span class="brand-text">
          Pétung
          <small>by SparkMind</small>
        </span>
      </a>
      <div class="nav-links">
        <a href="/#solusi">Solusi</a>
        <a href="/petung/cek">Cek Weton</a>
        <a href="/petung/hari-baik">Hari Baik</a>
        <a href="/petung/jodoh">Cek Kecocokan</a>
        <a href="/#cara-kerja">Cara Kerja</a>
      </div>
      <a href="/petung/cek" class="btn btn-primary btn-sm">
        Coba Gratis
      </a>
    </nav>
  </header>
)

export const Footer = () => (
  <footer id="site-footer" class="site-footer">
    <div class="footer-grid">
      <div>
        <div class="brand brand-footer">
          <span class="brand-mark" aria-hidden="true">
            <i class="fas fa-compass-drafting"></i>
          </span>
          <span class="brand-text">Pétung<small>by SparkMind</small></span>
        </div>
        <p class="footer-tagline">
          Outcome Foundry untuk hajat & keputusan bermakna khas Jawa.
        </p>
      </div>
      <div>
        <h4>Solusi</h4>
        <a href="/petung/petung-pengantin">Pétung Pengantin</a>
        <a href="/petung/petung-usaha">Pétung Usaha</a>
        <a href="/petung/petung-hajat">Pétung Hajat</a>
        <a href="/petung/kartu-weton">Kartu Weton</a>
      </div>
      <div>
        <h4>Tools Gratis</h4>
        <a href="/petung/cek">Cek Weton</a>
        <a href="/petung/jodoh">Cek Kecocokan</a>
        <a href="/petung/hari-baik">Cari Hari Baik</a>
        <a href="/petung/nama-usaha">Usul Nama Usaha</a>
      </div>
      <div>
        <h4>Tentang</h4>
        <a href="/#cara-kerja">Cara Kerja</a>
        <a href="/#etika">Etika & Truth-Lock</a>
        <a href="https://github.com/Sparkmind-obp-off/Petung-Foundry" target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
    </div>
    <div class="footer-disclaimer">
      <DisclaimerBox />
    </div>
    <p class="footer-copy">
      © 2026 Pétung · SparkMind Outcome Foundry · Indonesia-first · QRIS/VA via MoR Oasis BI Pro
    </p>
  </footer>
)
