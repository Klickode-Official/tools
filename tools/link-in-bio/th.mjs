// Link in Bio Page Builder in Thai. The body keeps every id and class from tool.mjs; only the
// words change. `strings` translates the messages ./script.js shows while it runs.
export default {
  name: 'สร้างหน้ารวมลิงก์ (Link in Bio)',
  title: 'สร้างหน้ารวมลิงก์ Link in Bio ฟรี แบบ Linktree ไม่ต้องสมัคร',
  description: 'สร้างหน้ารวมลิงก์สำหรับไบโอ Instagram และ TikTok ใส่ลิงก์ Shopee, LINE, WhatsApp เลือกธีมและสี แล้วดาวน์โหลดเป็นไฟล์ HTML ไฟล์เดียวที่เป็นของคุณเอง',
  short: 'หน้าเดียวรวมทุกลิงก์ของคุณ ไฟล์เป็นของคุณเอง',
  body: `<div class="lib">
  <div class="lib-edit">
    <div class="lib-tabs" role="tablist" aria-label="การตั้งค่า">
      <button type="button" role="tab" aria-selected="true" data-tab="profile">โปรไฟล์</button>
      <button type="button" role="tab" aria-selected="false" data-tab="links">ลิงก์</button>
      <button type="button" role="tab" aria-selected="false" data-tab="style">สไตล์</button>
      <button type="button" role="tab" aria-selected="false" data-tab="publish">ดาวน์โหลด</button>
    </div>

    <section class="lib-panel" data-panel="profile">
      <div class="lib-profile">
        <div class="lib-avatar" id="avatar-slot" role="button" tabindex="0" aria-label="เพิ่มรูปโปรไฟล์"><span>เพิ่มรูป</span></div>
        <div class="lib-avatar-actions">
          <button type="button" class="btn small" id="avatar-pick">อัปโหลดรูป</button>
          <button type="button" class="btn small" id="avatar-remove" hidden>ใช้ตัวอักษรย่อแทน</button>
          <p class="hint">รูปจะถูกย่อและเก็บไว้ในหน้าเลย ไม่ต้องหาที่ฝากรูป</p>
        </div>
      </div>
      <input type="file" id="avatar-input" accept="image/*" hidden>
      <label class="lib-fld"><span>ชื่อ</span><input type="text" data-k="name" maxlength="60" placeholder="มะลิ แฮนด์เมด"></label>
      <label class="lib-fld"><span>ไบโอสั้นๆ <em>หนึ่งหรือสองบรรทัด</em></span><textarea data-k="bio" rows="3" maxlength="240" placeholder="เครื่องเงินทำมือจากเชียงใหม่ ส่งทั่วไทย"></textarea></label>
    </section>

    <section class="lib-panel" data-panel="links" hidden>
      <ul class="lib-links" id="links" aria-label="ลิงก์ของคุณ"></ul>
      <div class="lib-add">
        <label class="lib-fld"><span>เพิ่มลิงก์</span>
          <select id="add-platform" aria-label="ประเภทลิงก์"></select>
        </label>
        <button type="button" class="btn" id="add-link">เพิ่มลิงก์</button>
      </div>
      <p class="hint">ลากที่จับหรือกดลูกศรเพื่อเปลี่ยนลำดับ ลิงก์ที่ยังไม่มีที่อยู่จะไม่ถูกใส่ในหน้าที่ดาวน์โหลด</p>
    </section>

    <section class="lib-panel" data-panel="style" hidden>
      <div class="lib-fld"><span>ธีม</span><div class="lib-themes" id="themes" role="radiogroup" aria-label="ธีม"></div></div>
      <div class="lib-row">
        <div class="lib-fld"><span>รูปทรงปุ่ม</span>
          <div class="lib-seg" id="shape" role="radiogroup" aria-label="รูปทรงปุ่ม">
            <button type="button" data-v="rounded" aria-pressed="true">มุมมน</button>
            <button type="button" data-v="pill" aria-pressed="false">แคปซูล</button>
            <button type="button" data-v="square" aria-pressed="false">เหลี่ยม</button>
          </div>
        </div>
        <div class="lib-fld"><span>ฟอนต์</span>
          <div class="lib-seg" id="font" role="radiogroup" aria-label="ฟอนต์">
            <button type="button" data-v="sans" aria-pressed="true">เรียบ</button>
            <button type="button" data-v="serif" aria-pressed="false">หรูหรา</button>
            <button type="button" data-v="rounded" aria-pressed="false">เป็นกันเอง</button>
            <button type="button" data-v="mono" aria-pressed="false">เทคโนโลยี</button>
          </div>
        </div>
        <div class="lib-fld"><span>ไอคอน</span>
          <div class="lib-seg" id="icons" role="radiogroup" aria-label="ไอคอน">
            <button type="button" data-v="brand" aria-pressed="true">สีแบรนด์</button>
            <button type="button" data-v="mono" aria-pressed="false">สีเรียบ</button>
            <button type="button" data-v="none" aria-pressed="false">ไม่มี</button>
          </div>
        </div>
      </div>
      <div class="lib-fld"><span>สีของคุณเอง <em>ไม่ต้องแก้ถ้าอยากใช้สีของธีม</em></span>
        <div class="lib-colors">
          <label><input type="color" data-color="bg"> พื้นหลัง</label>
          <label><input type="color" data-color="button"> ปุ่ม</label>
          <label><input type="color" data-color="buttonText"> ตัวอักษรบนปุ่ม</label>
          <label><input type="color" data-color="text"> ตัวอักษร</label>
          <button type="button" class="btn small" id="colors-reset">คืนค่าสี</button>
        </div>
      </div>
    </section>

    <section class="lib-panel" data-panel="publish" hidden>
      <div class="toolbar">
        <button type="button" class="btn primary" id="download">ดาวน์โหลดหน้า</button>
        <button type="button" class="btn" data-copy="#html-out">คัดลอก HTML</button>
        <label class="check"><input type="checkbox" id="credit"> ลิงก์ “Made with Klickode Tools”</label>
      </div>
      <p class="hint" id="size-note"></p>
      <h2>หน้าตาเวลาแชร์ลิงก์</h2>
      <label class="lib-fld"><span>ชื่อหน้า</span><input type="text" data-meta="title" maxlength="70" placeholder="ใช้ชื่อของคุณ"></label>
      <label class="lib-fld"><span>คำอธิบาย</span><input type="text" data-meta="description" maxlength="200" placeholder="ใช้ไบโอของคุณ"></label>
      <label class="lib-fld"><span>ที่อยู่ของหน้า <em>ที่ที่คุณจะเอาไปวาง เช่น https://links.yourshop.com</em></span><input type="text" data-meta="url" maxlength="300" spellcheck="false" placeholder="https://"></label>
      <label class="lib-fld"><span>รูปตอนแชร์ <em>รูปที่อยู่บนเว็บแล้ว ขนาด 1200×630 ดีที่สุด</em></span><input type="text" data-meta="image" maxlength="500" spellcheck="false" placeholder="https://"></label>
      <details class="lib-code"><summary>ดูโค้ด HTML</summary><textarea id="html-out" readonly spellcheck="false" aria-label="โค้ด HTML ของหน้า"></textarea></details>
    </section>
  </div>

  <div class="lib-stage">
    <div class="lib-phone"><div class="lib-screen" id="preview"></div></div>
  </div>
</div>`,
  content: `<h2>วิธีทำหน้ารวมลิงก์</h2>
<ol><li>ใส่ชื่อ ไบโอสั้นๆ และรูปโปรไฟล์ ถ้าไม่มีรูป จะใช้ตัวอักษรย่อของชื่อแทน</li><li>เพิ่มลิงก์ เลือกแพลตฟอร์มอย่าง Shopee, LINE, TikTok หรือ WhatsApp แล้วใส่ชื่อร้านหรือเบอร์ ระบบจะสร้างลิงก์ให้ หรือจะใส่ลิงก์เว็บไซต์อะไรก็ได้</li><li>เลือกธีม ฟอนต์ และรูปทรงปุ่ม ตัวอย่างบนจอมือถือจะเปลี่ยนตามทันที</li><li>กดดาวน์โหลดหน้า แล้วนำไฟล์ไปวางบนเว็บโฮสติ้งฟรีอย่าง Netlify หรือ GitHub Pages จากนั้นเอาลิงก์ไปใส่ในไบโอ</li></ol>
<h2>ต่างจาก Linktree ยังไง?</h2>
<p>บริการรวมลิงก์ส่วนใหญ่เก็บหน้าของคุณไว้บนเซิร์ฟเวอร์ของเขา ใส่โลโก้ของเขา และเก็บเงินถ้าอยากเอาออกหรืออยากได้ธีมสวยๆ ที่นี่คุณได้ไฟล์ HTML ไฟล์เดียวที่เป็นของคุณ วางไว้ที่ไหนก็ได้ ไม่มีโฆษณา ไม่มีตัวติดตาม และไม่มีวันหายไปเพราะบริการปิดตัว</p>
<p>ไฟล์ไม่มี JavaScript และไม่โหลดอะไรจากที่อื่น จึงเปิดเร็วแม้เน็ตมือถือจะช้า</p>
<h2>เคล็ดลับ</h2>
<ul><li>เอาลิงก์ที่สำคัญที่สุดไว้บนสุด คนส่วนใหญ่กดแค่ปุ่มแรกหรือสองปุ่ม</li><li>เขียนข้อความบนปุ่มให้บอกว่ากดแล้วได้อะไร เช่น “สั่งซื้อทาง LINE” ดีกว่าแค่ “LINE”</li><li>ถ้าลูกค้าส่วนใหญ่เป็นคนไทย เขียนไบโอเป็นภาษาไทย หน้าจะแสดงฟอนต์ไทยได้สวยบนทุกเครื่อง</li></ul>`,
  faq: [
    { q: 'ใช้ฟรีจริงไหม?', a: 'ฟรีจริง ไม่ต้องสมัคร ไม่มีค่าสมาชิก และหน้าที่ดาวน์โหลดไม่มีโฆษณา ลิงก์ “Made with Klickode Tools” ด้านล่างจะปิดก็ได้' },
    { q: 'ดาวน์โหลดแล้วต้องเอาไปไว้ที่ไหน?', a: 'ที่ไหนก็ได้ที่วางไฟล์ HTML ได้ เช่น Netlify, Vercel, GitHub Pages, Cloudflare Pages ซึ่งมีแบบฟรีทั้งหมด หรือโฮสติ้งเว็บไซต์ที่คุณมีอยู่แล้ว' },
    { q: 'แก้ไขทีหลังได้ไหม?', a: 'ได้ เครื่องมือจะจำข้อมูลล่าสุดไว้ในเบราว์เซอร์นี้ เปิดกลับมาแก้แล้วดาวน์โหลดไฟล์ใหม่ไปวางแทนไฟล์เดิม' },
    { q: 'รูปโปรไฟล์ถูกอัปโหลดไปไหนไหม?', a: 'ไม่ รูปถูกย่อในเบราว์เซอร์ของคุณ แล้วเก็บไว้ในไฟล์ HTML เลย ไม่ต้องฝากรูปไว้ที่ไหน' },
    { q: 'ใส่ลิงก์ได้กี่อัน?', a: 'ไม่จำกัด แต่หน้าที่ดีมักมีแค่สามถึงหกลิงก์ เพื่อให้คนตัดสินใจกดได้ง่าย' },
  ],
  strings: {
    'Shop on Shopee': 'ช้อปบน Shopee',
    'Order on WhatsApp': 'สั่งซื้อทาง WhatsApp',
    'Care guide for silver': 'วิธีดูแลเครื่องเงิน',
    'The page is {kb} KB.': 'หน้านี้มีขนาด {kb} KB',
    '1 link has no address yet and won’t be included.': 'มี 1 ลิงก์ที่ยังไม่มีที่อยู่ จะไม่ถูกใส่ในหน้า',
    '{n} links have no address yet and won’t be included.': 'มี {n} ลิงก์ที่ยังไม่มีที่อยู่ จะไม่ถูกใส่ในหน้า',
    'That file couldn’t be opened as an image': 'เปิดไฟล์นี้เป็นรูปภาพไม่ได้',
    'Goes to': 'ไปที่',
    'Add your {what} to make this work.': 'ใส่{what}เพื่อให้ลิงก์นี้ใช้งานได้',
    'That doesn’t look like a web address. Try something like https://yourshop.com': 'ดูไม่เหมือนที่อยู่เว็บไซต์ ลองแบบ https://yourshop.com',
    'Add a web address to make this work.': 'ใส่ที่อยู่เว็บไซต์เพื่อให้ลิงก์นี้ใช้งานได้',
    'Button text': 'ข้อความบนปุ่ม',
    'My website': 'เว็บไซต์ของฉัน',
    'Web address': 'ที่อยู่เว็บไซต์',
    'Drag to move': 'ลากเพื่อย้าย',
    'Website or other link': 'เว็บไซต์หรือลิงก์อื่น',
    'Move up': 'เลื่อนขึ้น',
    'Move down': 'เลื่อนลง',
    'Remove link': 'ลบลิงก์',
    'No links yet. Add your first one below.': 'ยังไม่มีลิงก์ เพิ่มลิงก์แรกได้ด้านล่าง',
    Platforms: 'แพลตฟอร์ม',
    Other: 'อื่นๆ',
    'Website or any other link': 'เว็บไซต์หรือลิงก์อื่นๆ',
    Clean: 'เรียบง่าย',
    Night: 'กลางคืน',
    'Klickode red': 'แดง Klickode',
    Pastel: 'พาสเทล',
    Sunset: 'พระอาทิตย์ตก',
    'Thai gold': 'ทองไทย',
    'Page downloaded': 'ดาวน์โหลดหน้าแล้ว',
    // Platform field labels (shared with the Shop Card Maker's platforms.js)
    'Etsy shop name': 'ชื่อร้าน Etsy',
    'TikTok username': 'ชื่อผู้ใช้ TikTok',
    'Instagram username': 'ชื่อผู้ใช้ Instagram',
    'Facebook page name': 'ชื่อเพจ Facebook',
    'WhatsApp number (with country code)': 'เบอร์ WhatsApp (มีรหัสประเทศ)',
    'LINE ID': 'LINE ID',
    'Shopee shop link': 'ลิงก์ร้าน Shopee',
    'Lazada shop link': 'ลิงก์ร้าน Lazada',
    'Amazon storefront link': 'ลิงก์หน้าร้าน Amazon',
    'eBay store name': 'ชื่อร้าน eBay',
    'Store link': 'ลิงก์ร้านค้า',
    'YouTube handle': 'ชื่อช่อง YouTube (@)',
    'Telegram username': 'ชื่อผู้ใช้ Telegram',
    'Google Maps or review link': 'ลิงก์ Google Maps หรือรีวิว',
  },
};
