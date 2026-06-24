// Tools interaktif Pétung — memanggil API backend deterministik
import { Header, Footer } from './layout'
import { DisclaimerBox } from '../components/Disclaimer'

const ToolShell = (props: { title: string; sub: string; children: any }) => (
  <>
    <Header />
    <section class="page-hero tool-hero">
      <h1>{props.title}</h1>
      <p>{props.sub}</p>
    </section>
    <section class="section tool-section">{props.children}</section>
    <section class="section">
      <DisclaimerBox />
    </section>
    <Footer />
  </>
)

export const CekWetonTool = () => (
  <ToolShell
    title="Cek Weton & Watak"
    sub="Masukkan tanggal lahir untuk menghitung weton, neptu, dan watak versi primbon. Gratis."
  >
    <div class="tool-card" data-tool="cek-weton">
      <label for="tgl-lahir">Tanggal lahir</label>
      <input type="date" id="tgl-lahir" class="input" max="2035-12-31" />
      <button id="btn-cek-weton" class="btn btn-primary btn-block">
        <i class="fas fa-calculator"></i> Hitung Weton
      </button>
      <div id="hasil-weton" class="tool-result" hidden></div>
    </div>
  </ToolShell>
)

export const CekJodohTool = () => (
  <ToolShell
    title="Cek Kecocokan (Weton Jodoh)"
    sub="Bandingkan dua weton menurut metode neptu jodoh. Bersifat edukasi-budaya, bukan kepastian."
  >
    <div class="tool-card" data-tool="cek-jodoh">
      <div class="two-col">
        <div>
          <label for="tgl-a">Tanggal lahir 1</label>
          <input type="date" id="tgl-a" class="input" max="2035-12-31" />
        </div>
        <div>
          <label for="tgl-b">Tanggal lahir 2</label>
          <input type="date" id="tgl-b" class="input" max="2035-12-31" />
        </div>
      </div>
      <button id="btn-cek-jodoh" class="btn btn-primary btn-block">
        <i class="fas fa-heart"></i> Cek Kecocokan
      </button>
      <div id="hasil-jodoh" class="tool-result" hidden></div>
    </div>
  </ToolShell>
)

export const HariBaikTool = () => (
  <ToolShell
    title="Cari Hari Baik"
    sub="Temukan tanggal yang selaras dengan wetonmu dalam rentang waktu pilihan, menurut tradisi Jawa."
  >
    <div class="tool-card" data-tool="hari-baik">
      <label for="tgl-lahir-hb">Tanggal lahir (pemilik hajat)</label>
      <input type="date" id="tgl-lahir-hb" class="input" max="2035-12-31" />
      <div class="two-col">
        <div>
          <label for="tgl-mulai">Cari dari</label>
          <input type="date" id="tgl-mulai" class="input" />
        </div>
        <div>
          <label for="tgl-selesai">Sampai</label>
          <input type="date" id="tgl-selesai" class="input" />
        </div>
      </div>
      <button id="btn-hari-baik" class="btn btn-primary btn-block">
        <i class="fas fa-calendar-check"></i> Cari Hari Baik
      </button>
      <div id="hasil-hari-baik" class="tool-result" hidden></div>
    </div>
  </ToolShell>
)

export const NamaUsahaTool = () => (
  <ToolShell
    title="Usul Nama Usaha Selaras Weton"
    sub="Dapatkan 3–5 usulan nama usaha yang selaras wetonmu menurut tradisi. Pilihan tetap di tanganmu."
  >
    <div class="tool-card" data-tool="nama-usaha">
      <label for="tgl-lahir-nu">Tanggal lahir pemilik</label>
      <input type="date" id="tgl-lahir-nu" class="input" max="2035-12-31" />
      <label for="kata-dasar">Kata dasar / bidang usaha</label>
      <input type="text" id="kata-dasar" class="input" placeholder="mis. Kopi, Batik, Toko" />
      <button id="btn-nama-usaha" class="btn btn-primary btn-block">
        <i class="fas fa-store"></i> Buat Usulan Nama
      </button>
      <div id="hasil-nama-usaha" class="tool-result" hidden></div>
    </div>
  </ToolShell>
)

export const IntakePage = () => (
  <ToolShell
    title="Konsultasi / Mulai Pesanan"
    sub="Ceritakan kebutuhanmu. Kami akan bantu menyusun outcome yang sesuai (harga final akan dikonfirmasi)."
  >
    <div class="tool-card" data-tool="intake">
      <label for="nama">Nama</label>
      <input type="text" id="nama" class="input" placeholder="Nama kamu" />
      <label for="hajat">Jenis hajat / kebutuhan</label>
      <select id="hajat" class="input">
        <option value="pengantin">Pernikahan (Pétung Pengantin)</option>
        <option value="usaha">Buka usaha (Pétung Usaha)</option>
        <option value="hajat">Hajat lain (pindahan/sunatan/syukuran)</option>
        <option value="lain">Lainnya</option>
      </select>
      <label for="kontak">Kontak (WhatsApp / email)</label>
      <input type="text" id="kontak" class="input" placeholder="08xx / email" />
      <label for="catatan">Catatan</label>
      <textarea id="catatan" class="input" rows={4} placeholder="Ceritakan kebutuhanmu..."></textarea>
      <button id="btn-intake" class="btn btn-primary btn-block">
        <i class="fas fa-paper-plane"></i> Kirim
      </button>
      <div id="hasil-intake" class="tool-result" hidden></div>
      <p class="price-note" style="margin-top:1rem">
        <i class="fas fa-circle-info"></i> Datamu tersimpan aman (Cloudflare D1) & disimpan
        minimal sesuai UU PDP. Setelah konsultasi, kamu bisa langsung checkout via QRIS/VA
        (MoR Oasis BI Pro / Duitku).
      </p>
    </div>
  </ToolShell>
)
