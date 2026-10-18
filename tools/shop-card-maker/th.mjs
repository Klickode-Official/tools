// Shop Card Maker in Thai. The body keeps every id and class from tool.mjs; only the words
// change. `strings` translates the messages ./script.js shows while it runs; the Thai card
// wording itself lives in ./copy-th.js.
export default {
  name: 'สร้างการ์ดร้านค้าออนไลน์',
  title: 'สร้างการ์ดร้านค้า Shopee LINE TikTok ใส่เว็บหรือโพสต์',
  description: 'ทำกล่อง “ช้อปกับเราบน Shopee” “แอดไลน์” หรือ “ติดตาม TikTok” ใส่เว็บไซต์หรือโพสต์โซเชียล เลือกแพลตฟอร์ม ปรับสี แล้วคัดลอกโค้ดหรือบันทึกเป็น PNG ฟรี',
  short: 'การ์ด “ช้อปกับเราบน Shopee/LINE/TikTok” สำหรับเว็บไซต์คุณ',
  body: `<div class="scm">
  <div class="scm-platforms" id="platforms" role="radiogroup" aria-label="แพลตฟอร์ม"></div>

  <div class="scm-stage">
    <div class="scm-stage-bar">
      <div class="seg" role="radiogroup" aria-label="รูปแบบ" id="layout">
        <button type="button" data-v="banner" aria-pressed="true">แบนเนอร์</button>
        <button type="button" data-v="card" aria-pressed="false">การ์ด</button>
        <button type="button" data-v="button" aria-pressed="false">ปุ่ม</button>
      </div>
      <div class="seg" role="radiogroup" aria-label="ความกว้างตัวอย่าง" id="device">
        <button type="button" data-v="desktop" aria-pressed="true">คอมพิวเตอร์</button>
        <button type="button" data-v="mobile" aria-pressed="false">มือถือ</button>
      </div>
    </div>
    <div class="scm-canvas" id="canvas"><div class="scm-frame" id="preview"></div></div>
  </div>

  <div class="scm-tabs" role="tablist" aria-label="การตั้งค่า">
    <button type="button" role="tab" aria-selected="true" data-tab="business">ธุรกิจของคุณ</button>
    <button type="button" role="tab" aria-selected="false" data-tab="words">ข้อความ</button>
    <button type="button" role="tab" aria-selected="false" data-tab="style">สไตล์</button>
    <button type="button" role="tab" aria-selected="false" data-tab="extras">เทศกาลและ QR</button>
    <button type="button" role="tab" aria-selected="false" data-tab="export">รับโค้ดหรือรูปภาพ</button>
  </div>

  <section class="scm-panel" data-panel="business">
    <div class="scm-form">
      <label class="fld"><span>ชื่อธุรกิจ</span><input type="text" id="f-name" data-k="name" maxlength="60"></label>
      <label class="fld"><span id="handle-label">ลิงก์ร้าน</span><input type="text" id="f-handle" data-k="handle" maxlength="300" spellcheck="false"></label>
      <label class="fld" id="msg-field" hidden><span>ข้อความเริ่มต้น (ไม่บังคับ)</span><input type="text" data-k="message" maxlength="200" placeholder="สวัสดีค่ะ อยากสอบถามเรื่อง…"></label>
      <p class="fld-note wide" id="url-out"></p>
      <label class="fld"><span>ชื่อบนการ์ด</span><input type="text" data-k="shopName" maxlength="60"></label>
      <label class="fld"><span>ที่ตั้งหรือสโลแกน</span><input type="text" data-k="location" maxlength="60"></label>
      <label class="fld"><span>คะแนน (เต็ม 5)</span><input type="text" data-k="rating" maxlength="4" inputmode="decimal"></label>
      <label class="fld"><span>จำนวนรีวิว</span><input type="text" data-k="reviews" maxlength="10" inputmode="numeric"></label>
    </div>
    <h2>รูปภาพ</h2>
    <div class="scm-pics">
      <div class="pic-slot avatar" data-img="avatar"><span>โลโก้ร้าน</span></div>
      <div class="pic-slot" data-img="products.0"><span>รูปที่ 1</span></div>
      <div class="pic-slot" data-img="products.1"><span>รูปที่ 2</span></div>
      <div class="pic-slot" data-img="products.2"><span>รูปที่ 3</span></div>
      <div class="pic-slot" data-img="products.3"><span>รูปที่ 4</span></div>
    </div>
    <input type="file" id="pic-input" accept="image/*" hidden>
    <p class="hint">คลิกที่กล่องเพื่อเพิ่มรูป รูปจะถูกย่อและเก็บไว้ในโค้ดเลย ไม่ต้องหาที่ฝากรูป</p>
  </section>

  <section class="scm-panel" data-panel="words" hidden>
    <div class="scm-form">
      <label class="fld"><span>ป้ายเล็กด้านบน</span><input type="text" data-k="badge" maxlength="60"></label>
      <label class="fld"><span>หัวข้อ <em>ใส่ *ดอกจัน* ครอบคำที่อยากให้เป็นสี</em></span><input type="text" data-k="headline" maxlength="90"></label>
      <label class="fld wide"><span>ข้อความ <em>ใช้ **ดอกจันคู่** เพื่อทำตัวหนา</em></span><textarea data-k="text" rows="3" maxlength="400"></textarea></label>
      <label class="fld"><span>จุดเด่นแบบมีเครื่องหมายถูก (บรรทัดละข้อ)</span><textarea data-k="bullets" rows="3" maxlength="300"></textarea></label>
      <div class="fld"><span>ตัวเลขบนการ์ด</span>
        <div class="stat-rows" id="stats">
          <input type="text" data-stat="0.0" maxlength="12" aria-label="ตัวเลข 1"><input type="text" data-stat="0.1" maxlength="24" aria-label="คำอธิบาย 1">
          <input type="text" data-stat="1.0" maxlength="12" aria-label="ตัวเลข 2"><input type="text" data-stat="1.1" maxlength="24" aria-label="คำอธิบาย 2">
          <input type="text" data-stat="2.0" maxlength="12" aria-label="ตัวเลข 3"><input type="text" data-stat="2.1" maxlength="24" aria-label="คำอธิบาย 3">
        </div>
      </div>
      <label class="fld"><span>ปุ่มหลัก</span><input type="text" data-k="button" maxlength="50"></label>
      <label class="fld"><span>ปุ่มบนการ์ด</span><input type="text" data-k="cardButton" maxlength="30"></label>
      <label class="fld"><span>ป้ายมุมการ์ด</span><input type="text" data-k="cardLabel" maxlength="24"></label>
      <div class="fld"><span>&nbsp;</span><button type="button" class="btn" id="reset-words">คืนค่าข้อความของแพลตฟอร์มนี้</button></div>
    </div>
  </section>

  <section class="scm-panel" data-panel="style" hidden>
    <div class="scm-form">
      <div class="fld wide"><span>ลุค <em>จุดเริ่มต้น เลือกแล้วยังปรับทุกอย่างด้านล่างได้</em></span>
        <div class="scm-looks" id="look" role="radiogroup" aria-label="ลุค"></div>
      </div>
      <div class="fld"><span>สี</span>
        <div class="seg" id="theme" role="radiogroup" aria-label="สี">
          <button type="button" data-v="brand" aria-pressed="true">ตามแพลตฟอร์ม</button>
          <button type="button" data-v="light" aria-pressed="false">สว่าง</button>
          <button type="button" data-v="dark" aria-pressed="false">มืด</button>
        </div>
      </div>
      <div class="fld"><span>ฟอนต์หัวข้อ</span>
        <div class="seg" id="headingFont" role="radiogroup" aria-label="ฟอนต์หัวข้อ">
          <button type="button" data-v="sans" aria-pressed="true">เรียบ</button>
          <button type="button" data-v="serif" aria-pressed="false">หรูหรา</button>
          <button type="button" data-v="rounded" aria-pressed="false">เป็นกันเอง</button>
          <button type="button" data-v="mono" aria-pressed="false">เทคโนโลยี</button>
        </div>
      </div>
      <div class="fld"><span>สีปุ่ม</span>
        <div class="color-row"><input type="color" id="f-accent" aria-label="สีปุ่ม"><button type="button" class="btn small" id="accent-reset">ใช้สีของแพลตฟอร์ม</button></div>
      </div>
      <div class="fld"><span>พื้นหลัง</span>
        <div class="color-row"><input type="color" id="f-bg" aria-label="สีพื้นหลัง"><button type="button" class="btn small" id="bg-reset">ใช้พื้นหลังของแพลตฟอร์ม</button></div>
      </div>
      <label class="fld"><span>ความมนของมุม <output id="radius-val">20</output></span><input type="range" data-k="radius" min="0" max="36" step="1"></label>
      <label class="fld"><span>รูปสินค้า</span>
        <select data-k="productCount"><option value="4">4 รูป</option><option value="3">3 รูป</option><option value="2">2 รูป</option><option value="0">ไม่มีรูป</option></select>
      </label>
      <div class="fld wide"><span>แสดง</span>
        <div class="checks">
          <label><input type="checkbox" data-show="badge"> ป้ายด้านบน</label>
          <label><input type="checkbox" data-show="bullets"> จุดเด่น</label>
          <label><input type="checkbox" data-show="note"> บรรทัด “เปิดในแท็บใหม่”</label>
          <label><input type="checkbox" data-show="card"> การ์ดร้าน</label>
          <label><input type="checkbox" data-show="rating"> ดาวรีวิว</label>
          <label><input type="checkbox" data-show="stats"> ตัวเลข</label>
          <label><input type="checkbox" data-shadow> เงา</label>
        </div>
      </div>
      <div class="fld wide"><span>โลโก้แพลตฟอร์ม</span>
        <div class="color-row"><button type="button" class="btn small" id="logo-upload">อัปโหลดโลโก้อื่น</button><button type="button" class="btn small" id="logo-reset" hidden>กลับไปใช้โลโก้มาตรฐาน</button></div>
      </div>
    </div>
  </section>

  <section class="scm-panel" data-panel="extras" hidden>
    <div class="scm-form">
      <div class="fld wide"><span>เทศกาล <em>สีและของตกแต่งใหม่ โลโก้และปุ่มของแพลตฟอร์มยังเหมือนเดิม</em></span>
        <div class="scm-seasons" id="season" role="radiogroup" aria-label="เทศกาล"></div>
      </div>
      <label class="fld" id="season-badge-field"><span>ข้อความสติกเกอร์</span><input type="text" data-k="seasonBadge" maxlength="24" placeholder="เช่น 11.11 SALE"></label>
    </div>
    <h2>QR Code</h2>
    <div class="scm-form">
      <div class="fld"><span>&nbsp;</span><div class="checks"><label><input type="checkbox" id="f-qr"> ใส่ QR Code บนการ์ด</label></div></div>
      <div class="fld"><span>ตำแหน่ง</span>
        <div class="seg" id="qrPos" role="radiogroup" aria-label="ตำแหน่ง QR Code">
          <button type="button" data-v="cta" aria-pressed="true">ข้างปุ่ม</button>
          <button type="button" data-v="card" aria-pressed="false">บนการ์ดร้าน</button>
        </div>
      </div>
      <label class="fld"><span>ข้อความข้างๆ</span><input type="text" data-k="qrCaption" maxlength="30" placeholder="สแกนเพื่อเข้าร้าน"></label>
      <div class="fld"><span>สี QR</span>
        <div class="color-row"><input type="color" id="f-qr-color" aria-label="สี QR Code"><button type="button" class="btn small" id="qr-color-reset">ดำ</button></div>
      </div>
      <p class="fld-note wide" id="qr-note" aria-live="polite"></p>
    </div>
  </section>

  <section class="scm-panel" data-panel="export" hidden>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-head"><span class="label">โค้ดสำหรับเว็บไซต์</span><span><button type="button" class="btn small" id="dl-html">ดาวน์โหลด .html</button><button type="button" class="btn small" data-copy="#code">คัดลอก</button></span></div>
        <textarea id="code" readonly spellcheck="false" aria-label="โค้ดสำหรับฝัง"></textarea>
      </div>
      <div class="scm-export">
        <h2>รูปสำหรับโซเชียลมีเดีย</h2>
        <div class="toolbar">
          <label class="check">ขนาด
            <select id="png-size">
              <option value="auto">เฉพาะการ์ด</option>
              <option value="1080x1080">โพสต์สี่เหลี่ยม (1080×1080)</option>
              <option value="1080x1350">โพสต์แนวตั้ง (1080×1350)</option>
              <option value="1080x1920">สตอรี่ / รีล (1080×1920)</option>
              <option value="1200x630">ภาพตัวอย่างลิงก์ (1200×630)</option>
            </select>
          </label>
          <label class="check">พื้นหลัง
            <select id="png-bg">
              <option value="brand">สีของแพลตฟอร์ม</option>
              <option value="white">ขาว</option>
              <option value="transparent">โปร่งใส</option>
            </select>
          </label>
        </div>
        <button type="button" class="btn primary" id="dl-png" data-dl>ดาวน์โหลด PNG</button>
        <p class="hint" id="code-size"></p>
        <h2>วางโค้ดที่ไหน</h2>
        <ul class="paste-list">
          <li><strong>WordPress:</strong> เพิ่มบล็อก “Custom HTML”</li>
          <li><strong>Shopify:</strong> Online Store → Customize แล้วเพิ่มส่วน “Custom liquid”</li>
          <li><strong>Wix:</strong> Add → Embed code → “Embed HTML”</li>
          <li><strong>Squarespace:</strong> เพิ่มบล็อก “Code”</li>
        </ul>
      </div>
    </div>
  </section>
</div>`,
  content: `<h2>เครื่องมือนี้ใช้ทำอะไร</h2>
<p>ถ้าคุณขายของบน Shopee, Lazada หรือ TikTok Shop หรือรับออร์เดอร์ทาง LINE และ WhatsApp เว็บไซต์ของคุณควรพาลูกค้าไปที่นั่นได้ในคลิกเดียว เครื่องมือนี้ทำกล่องสวยๆ สำหรับเรื่องนี้ในสีของแพลตฟอร์มนั้น ลูกค้าเห็นแล้วจำได้ทันที</p>
<h2>วิธีทำ</h2>
<ol><li>เลือกแพลตฟอร์มด้านบน</li><li>ใส่ชื่อธุรกิจ และลิงก์ร้าน ชื่อผู้ใช้ หรือเบอร์โทร ระบบจะสร้างลิงก์ให้</li><li>ปรับข้อความ สี และรูปภาพจนพอใจ</li><li>คัดลอกโค้ดไปวางในเว็บไซต์ หรือดาวน์โหลด PNG ไปโพสต์ Instagram, Facebook หรือสตอรี่</li></ol>
<h2>ลุค เทศกาล และ QR Code</h2>
<p>ในแท็บ <strong>สไตล์</strong> ลุคจะเปลี่ยนอารมณ์ของการ์ดได้ในคลิกเดียว Minimal เรียบและโปร่ง Bold มีขอบหนาและตัวอักษรใหญ่ Luxury ใช้ฟอนต์มีเชิงกับเส้นบาง ส่วน Festival มนและสนุกขึ้นหน่อย เลือกแล้วยังเปลี่ยนฟอนต์ มุม และสีเองได้</p>
<p>ช่วงลดราคาหรือเทศกาล เลือกธีมในแท็บ <strong>เทศกาลและ QR</strong> มีทั้งสงกรานต์ ลอยกระทง 11.11 Black Friday ตรุษจีน และคริสต์มาส แต่ละธีมมีของตกแต่งของตัวเองและสติกเกอร์ที่แก้ข้อความได้ QR Code จะชี้ไปลิงก์เดียวกับปุ่ม เหมาะกับโปสเตอร์ เมนู และสตอรี่ Instagram ที่กดลิงก์ไม่ได้</p>
<h2>เรื่องโลโก้</h2>
<p>โลโก้แพลตฟอร์มมาจาก <a href="https://simpleicons.org" rel="noopener">Simple Icons</a> และเป็นของบริษัทเจ้าของ ใช้เพื่อพาคนไปที่ร้านหรือโปรไฟล์ของคุณเองบนแพลตฟอร์มนั้นได้ ซึ่งแบรนด์ต่างๆ อนุญาต แต่อย่าดัดแปลงให้ดูเหมือนโลโก้ของคุณ Amazon และ Lazada ไม่ได้เปิดให้ใช้โลโก้แบบนี้ การ์ดของสองแพลตฟอร์มนี้จึงแสดงเป็นชื่อแทน ถ้าคุณได้รับอนุญาตให้ใช้โลโก้ อัปโหลดเองได้ในแท็บสไตล์</p>`,
  faq: [
    { q: "โค้ดจะตีกับดีไซน์เว็บไซต์ของฉันไหม?", a: "ไม่ควร สไตล์ทั้งหมดถูกจำกัดไว้เฉพาะในการ์ด ฟอนต์และสีของเว็บคุณจะไม่ไหลเข้ามา และการ์ดก็ไม่ไปเปลี่ยนส่วนอื่นของหน้า บนมือถือก็เรียงตัวสวย" },
    { q: "รูปภาพของฉันถูกเก็บไว้ที่ไหน?", a: "เก็บไว้ในโค้ดเลย รูปจะถูกย่อให้เล็กแล้วเขียนลงใน HTML ไม่ต้องอัปโหลดหรือฝากไว้ที่ไหน ใช้ง่ายแต่โค้ดจะยาวขึ้น ขนาดโค้ดแสดงอยู่ข้างปุ่มดาวน์โหลด" },
    { q: "ต้องอัปเดตตัวเลขเองไหม?", a: "ใช่ การ์ดแสดงตามที่คุณพิมพ์ จึงไม่ล้าสมัยเอง ควรกลับมาแก้ยอดขายหรือจำนวนผู้ติดตามเป็นระยะ" },
    { q: "QR Code สแกนได้แน่ไหม?", a: "ควรได้ QR ถูกวาดเป็นสีเข้มบนพื้นขาวพร้อมขอบว่างที่เครื่องสแกนต้องการ และใช้ลิงก์เดียวกับปุ่ม ถ้าเลือกสี QR ที่อ่อนเกินไป การ์ดจะใช้สีดำแทนและแจ้งให้ทราบ ลองสแกนด้วยมือถือของคุณก่อนสั่งพิมพ์" },
    { q: "หมดช่วงลดราคาแล้วปิดธีมเทศกาลได้ไหม?", a: "ได้ ตั้งเทศกาลเป็น “ไม่มี” การ์ดจะกลับไปใช้สีปกติ ข้อความและรูปภาพยังอยู่เหมือนเดิม" },
    { q: "เครื่องมือนี้ทำโดย Shopee, TikTok หรือ LINE หรือเปล่า?", a: "ไม่ใช่ นี่เป็นเครื่องมืออิสระ และการ์ดที่สร้างไม่ได้รับการรับรองจากบริษัทเหล่านั้น" },
  ],
  strings: {
    "Your Shop": "ร้านของคุณ",
    "Bangkok, Thailand": "กรุงเทพฯ",
    "Scan to visit": "สแกนเพื่อเข้าร้าน",
    "The code is {kb} KB.": "โค้ดมีขนาด {kb} KB",
    "The code is {kb} KB. Pictures make up most of that; remove some if your site limits HTML length.": "โค้ดมีขนาด {kb} KB ส่วนใหญ่เป็นรูปภาพ ถ้าเว็บของคุณจำกัดความยาว HTML ลองเอารูปออกบ้าง",
    "Buttons link to": "ปุ่มลิงก์ไปที่",
    "Add your link above so the buttons go somewhere.": "ใส่ลิงก์ด้านบนก่อน ปุ่มจะได้พาไปที่ร้าน",
    "The QR code uses the same link as your buttons.": "QR Code ใช้ลิงก์เดียวกับปุ่ม",
    "Add your shop link under “Your business” and the QR code will appear.": "ใส่ลิงก์ร้านในแท็บ “ธุรกิจของคุณ” แล้ว QR Code จะปรากฏ",
    "Buttons are too small for a QR code. Switch to Banner or Card to show it.": "ปุ่มเล็กเกินกว่าจะใส่ QR Code ได้ เปลี่ยนเป็นแบนเนอร์หรือการ์ดเพื่อแสดง QR",
    "The shop card is hidden, so the QR code sits next to the button instead.": "การ์ดร้านถูกซ่อนอยู่ QR Code จึงไปอยู่ข้างปุ่มแทน",
    "That colour is too pale for phones to scan reliably, so the code is drawn in black. Pick a darker colour.": "สีนี้อ่อนเกินกว่ามือถือจะสแกนได้แน่นอน จึงวาด QR เป็นสีดำแทน ลองเลือกสีที่เข้มขึ้น",
    "Scan it with your phone to check it opens the right page, especially before you print.": "ลองสแกนด้วยมือถือเพื่อเช็กว่าเปิดหน้าที่ถูกต้อง โดยเฉพาะก่อนสั่งพิมพ์",
    "Words reset": "คืนค่าข้อความแล้ว",
    "That file couldn’t be opened as an image": "เปิดไฟล์นี้เป็นรูปภาพไม่ได้",
    "Your browser couldn’t draw the image. Try Chrome or Edge, or take a screenshot of the preview.": "เบราว์เซอร์นี้สร้างรูปไม่ได้ ลองใช้ Chrome หรือ Edge หรือแคปหน้าจอตัวอย่างแทน",
    "Classic": "คลาสสิก",
    "Minimal": "มินิมอล",
    "Bold": "โดดเด่น",
    "Luxury": "หรูหรา",
    "Festival": "สนุกสนาน",
    "None": "ไม่มี",
    "Songkran": "สงกรานต์",
    "Loy Krathong": "ลอยกระทง",
    "11.11": "11.11",
    "Black Friday": "Black Friday",
    "Lunar New Year": "ตรุษจีน",
    "Christmas": "คริสต์มาส",
    "Etsy shop name": "ชื่อร้าน Etsy",
    "TikTok username": "ชื่อผู้ใช้ TikTok",
    "Instagram username": "ชื่อผู้ใช้ Instagram",
    "Facebook page name": "ชื่อเพจ Facebook",
    "WhatsApp number (with country code)": "เบอร์ WhatsApp (มีรหัสประเทศ)",
    "LINE ID": "LINE ID",
    "Shopee shop link": "ลิงก์ร้าน Shopee",
    "Lazada shop link": "ลิงก์ร้าน Lazada",
    "Amazon storefront link": "ลิงก์หน้าร้าน Amazon",
    "eBay store name": "ชื่อร้าน eBay",
    "Store link": "ลิงก์ร้านค้า",
    "YouTube handle": "ชื่อช่อง YouTube (@)",
    "Telegram username": "ชื่อผู้ใช้ Telegram",
    "Google Maps or review link": "ลิงก์ Google Maps หรือรีวิว",
  },
};
