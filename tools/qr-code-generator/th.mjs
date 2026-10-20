// QR Code Generator in Thai. The body keeps every id and class from tool.mjs; only the words
// change. `strings` translates the messages ./script.js shows while it runs (see t() in ui.js).
export default {
  name: 'สร้าง QR Code',
  title: 'สร้าง QR Code ฟรี ใส่โลโก้ได้ ไม่หมดอายุ ไม่ต้องสมัคร',
  description: 'สร้าง QR Code สำหรับลิงก์ Wi-Fi LINE WhatsApp และนามบัตร ใส่โลโก้และสีของแบรนด์ แล้วบันทึกเป็น PNG หรือ SVG ใช้ได้ตลอด ไม่หมดอายุ ไม่ติดตามคนสแกน',
  short: 'QR Code สำหรับลิงก์ Wi-Fi LINE และ WhatsApp ใส่โลโก้ได้',
  body: `<div class="qrg">
  <div class="qrg-form">
    <div class="qrg-types" id="types" role="radiogroup" aria-label="QR นี้จะเปิดอะไร"></div>
    <input type="hidden" id="qr-type" value="url">

    <div class="qrg-fields">
      <div data-type="url"><label class="fld wide"><span>ลิงก์</span><input type="text" id="f-url" placeholder="https://www.example.com" spellcheck="false" inputmode="url"></label></div>
      <div data-type="text" hidden><label class="fld wide"><span>ข้อความ</span><textarea id="f-text" rows="4" placeholder="พิมพ์อะไรก็ได้ มือถือจะแสดงเป็นข้อความธรรมดา"></textarea></label></div>
      <div data-type="wifi" hidden>
        <label class="fld"><span>ชื่อเครือข่าย</span><input type="text" id="f-ssid" placeholder="Cafe Guest" spellcheck="false"></label>
        <label class="fld"><span>รหัสผ่าน</span><input type="text" id="f-pass" spellcheck="false" autocomplete="off"></label>
        <label class="fld"><span>ความปลอดภัย</span><select id="f-sec"><option value="WPA">WPA / WPA2 / WPA3</option><option value="WEP">WEP (เราเตอร์รุ่นเก่า)</option><option value="nopass">ไม่มีรหัสผ่าน</option></select></label>
        <label class="fld chk"><input type="checkbox" id="f-hidden"> <span>เครือข่ายที่ซ่อนชื่อ</span></label>
      </div>
      <div data-type="whatsapp" hidden>
        <label class="fld"><span>เบอร์ WhatsApp</span><input type="text" id="f-wa" placeholder="081 234 5678 หรือ +44 7700 900123" inputmode="tel"></label>
        <label class="fld"><span>ข้อความเริ่มต้นแชท <em>ไม่บังคับ</em></span><input type="text" id="f-wa-msg" placeholder="สวัสดีค่ะ เห็นร้านจาก…"></label>
      </div>
      <div data-type="line" hidden><label class="fld wide"><span>LINE ID หรือบัญชีทางการ <em>ใส่ @ นำหน้าสำหรับบัญชีทางการ (LINE OA)</em></span><input type="text" id="f-line" placeholder="@yourshop" spellcheck="false"></label></div>
      <div data-type="email" hidden>
        <label class="fld"><span>อีเมล</span><input type="text" id="f-email" placeholder="hello@example.com" inputmode="email" spellcheck="false"></label>
        <label class="fld"><span>หัวเรื่อง <em>ไม่บังคับ</em></span><input type="text" id="f-subject"></label>
        <label class="fld wide"><span>ข้อความ <em>ไม่บังคับ</em></span><textarea id="f-body" rows="2"></textarea></label>
      </div>
      <div data-type="phone" hidden><label class="fld wide"><span>เบอร์โทร</span><input type="text" id="f-tel" placeholder="02 123 4567" inputmode="tel"></label></div>
      <div data-type="sms" hidden>
        <label class="fld"><span>เบอร์โทร</span><input type="text" id="f-sms" inputmode="tel"></label>
        <label class="fld"><span>ข้อความ</span><input type="text" id="f-sms-msg"></label>
      </div>
      <div data-type="contact" hidden>
        <label class="fld"><span>ชื่อ</span><input type="text" id="f-c-name"></label>
        <label class="fld"><span>บริษัท</span><input type="text" id="f-c-org"></label>
        <label class="fld"><span>ตำแหน่ง</span><input type="text" id="f-c-title"></label>
        <label class="fld"><span>เบอร์โทร</span><input type="text" id="f-c-tel" inputmode="tel"></label>
        <label class="fld"><span>อีเมล</span><input type="text" id="f-c-email" inputmode="email" spellcheck="false"></label>
        <label class="fld"><span>เว็บไซต์</span><input type="text" id="f-c-url" spellcheck="false"></label>
        <label class="fld wide"><span>ที่อยู่</span><input type="text" id="f-c-adr"></label>
      </div>
    </div>

    <h2 class="qrg-h">ดีไซน์</h2>
    <div class="qrg-design">
      <div class="fld"><span>สไตล์</span><div class="seg" id="style" role="radiogroup" aria-label="สไตล์"><button type="button" data-v="square" aria-pressed="true">เหลี่ยม</button><button type="button" data-v="rounded" aria-pressed="false">มน</button><button type="button" data-v="dots" aria-pressed="false">จุด</button></div><input type="hidden" id="qr-style" value="square"></div>
      <div class="fld"><span>สี</span><div class="qrg-colours">
        <label class="swatch" title="สีของ QR"><input type="color" id="dark" value="#111111"><span>QR</span></label>
        <label class="swatch" title="สีพื้นหลัง"><input type="color" id="light" value="#ffffff"><span>พื้นหลัง</span></label>
        <label class="fld chk"><input type="checkbox" id="transparent"> <span>พื้นโปร่งใส</span></label>
      </div></div>
      <div class="fld"><span>โลโก้ตรงกลาง <em>ไม่บังคับ</em></span><div class="qrg-logo"><button type="button" class="btn small" id="logo-btn">ใส่โลโก้</button><button type="button" class="btn small" id="logo-remove" hidden>เอาออก</button><input type="file" id="logo-input" accept="image/*" hidden></div></div>
      <label class="fld"><span>ข้อความใต้ QR <em>ไม่บังคับ</em></span><input type="text" id="caption" maxlength="40" placeholder="สแกนดูเมนู"></label>
      <label class="fld"><span>การแก้ไขข้อผิดพลาด <em>ยิ่งสูงยิ่งทนรอยขีดข่วนและโลโก้</em></span><select id="ecl"><option value="auto">อัตโนมัติ</option><option value="L">ต่ำ (7%)</option><option value="M">กลาง (15%)</option><option value="Q">ค่อนข้างสูง (25%)</option><option value="H">สูง (30%)</option></select></label>
      <label class="fld"><span>ขอบ <em id="margin-val">4 ช่อง</em></span><input type="range" id="margin" min="0" max="8" value="4"></label>
    </div>
  </div>

  <div class="qrg-side">
    <div class="qrg-preview" id="preview" aria-live="polite"></div>
    <div class="status" id="status" aria-live="polite"></div>
    <div class="qrg-actions">
      <button class="btn primary" id="png">ดาวน์โหลด PNG</button>
      <button class="btn" id="svg">SVG</button>
      <button class="btn" id="copy">คัดลอกรูป</button>
      <label class="check qrg-size">ขนาด <select id="size"><option value="512">512 px</option><option value="1024" selected>1024 px</option><option value="2048">2048 px</option><option value="4096">4096 px</option></select></label>
    </div>
    <p class="qrg-meta" id="meta"></p>
    <details class="qrg-inside"><summary>ข้อมูลที่อยู่ใน QR</summary><pre id="payload"></pre></details>
  </div>
</div>`,
  content: `<h2>วิธีสร้าง QR Code</h2>
<ol><li>เลือกว่าอยากให้ QR เปิดอะไร เช่น ลิงก์ Wi-Fi แชท WhatsApp บัญชี LINE หรือนามบัตร</li><li>กรอกรายละเอียด ตัวอย่างจะเปลี่ยนตามที่คุณพิมพ์ทันที</li><li>เลือกสไตล์และสี จะใส่โลโก้ร้านด้วยก็ได้</li><li>ดาวน์โหลดเป็น PNG สำหรับโพสต์และหน้าจอ หรือ SVG สำหรับงานพิมพ์ เพราะ SVG ขยายเท่าไหร่ก็ยังคมชัด</li></ol>
<p>ก่อนสั่งพิมพ์เมนูทีละหลายร้อยแผ่น ลองสแกนด้วยมือถือของคุณเองก่อนทุกครั้ง</p>
<h2>QR ที่สร้างที่นี่ไม่มีวันหมดอายุ</h2>
<p>เว็บสร้าง QR “ฟรี” หลายแห่งให้ลิงก์สั้นที่วิ่งผ่านเซิร์ฟเวอร์ของเขา เพื่อนับจำนวนคนสแกน และพอหมดช่วงทดลองใช้ก็ปิด QR ของคุณได้ QR ที่สร้างที่นี่เก็บลิงก์หรือข้อมูลจริงของคุณไว้ข้างในเลย ไม่มีตัวกลางที่จะหมดอายุ ติดตามคน หรือพัง</p>
<p>ข้อเสียคือ พิมพ์ไปแล้วจะแก้ไม่ได้ ถ้าลิงก์อาจเปลี่ยนในอนาคต ให้ชี้ QR ไปที่หน้าที่คุณควบคุมเอง เช่น เว็บไซต์ของร้าน</p>
<h2>เคล็ดลับให้สแกนติดตั้งแต่ครั้งแรก</h2>
<ul><li>ใช้สีเข้มบนพื้นสว่าง QR สีอ่อนบนพื้นเข้มทำให้มือถือหลายรุ่นอ่านไม่ออก</li><li>อย่าตัดขอบ เครื่องสแกนต้องการพื้นที่ว่างรอบ QR</li><li>ยิ่งสั้นยิ่งดี ลิงก์สั้นทำให้ QR ไม่แน่น สแกนจากระยะไกลได้</li><li>พิมพ์ให้ใหญ่พอ ประมาณ 2 × 2 ซม. สำหรับของที่ถือในมือ และใหญ่กว่านั้นมากสำหรับโปสเตอร์ที่ต้องสแกนจากอีกฝั่งของห้อง</li></ul>`,
  faq: [
    { q: 'สร้าง QR Code ที่นี่ฟรีจริงไหม?', a: 'ฟรีจริง ไม่ต้องสมัคร ไม่มีลายน้ำ สร้างได้ไม่จำกัด และสแกนได้ไม่จำกัดจำนวนครั้ง' },
    { q: 'QR Code หมดอายุไหม?', a: 'ไม่หมดอายุ เพราะ QR เก็บลิงก์หรือข้อมูลของคุณไว้ข้างในโดยตรง ใช้ได้ตราบที่ลิงก์นั้นยังใช้งานได้' },
    { q: 'ใส่โลโก้ตรงกลางได้ไหม?', a: 'ได้ เมื่อใส่โลโก้ ระดับการแก้ไขข้อผิดพลาดจะถูกปรับเป็นสูง มือถือจึงยังอ่าน QR ได้แม้ตรงกลางถูกบัง แนะนำให้ใช้โลโก้เรียบๆ และทดสอบก่อนพิมพ์' },
    { q: 'QR Wi-Fi ใช้งานยังไง?', a: 'มือถือจะอ่านชื่อเครือข่ายและรหัสผ่านจาก QR แล้วถามว่าจะเชื่อมต่อไหม ใช้ได้กับแอปกล้องบน iPhone และ Android ส่วนใหญ่ ข้อมูลอยู่แค่ในรูปที่คุณดาวน์โหลด ไม่มีการส่งมาให้เรา' },
    { q: 'ควรใช้ PNG หรือ SVG?', a: 'PNG สำหรับโพสต์โซเชียล เว็บไซต์ และหน้าจอ ส่วน SVG สำหรับงานพิมพ์ โดยเฉพาะโปสเตอร์หรือป้ายไวนิลขนาดใหญ่ เพราะไม่มีวันแตก' },
    { q: 'ดูจำนวนคนสแกนได้ไหม?', a: 'QR แบบนี้ดูไม่ได้ เพราะไม่มีเซิร์ฟเวอร์ติดตามตรงกลาง ถ้าต้องการตัวเลข ให้ใช้ลิงก์ที่ติด UTM แล้วดูในระบบวิเคราะห์ของเว็บไซต์คุณ' },
  ],
  strings: {
    Link: 'ลิงก์',
    Text: 'ข้อความ',
    'Wi-Fi': 'Wi-Fi',
    WhatsApp: 'WhatsApp',
    LINE: 'LINE',
    Email: 'อีเมล',
    Call: 'โทร',
    SMS: 'SMS',
    Contact: 'นามบัตร',
    'Fill in the details and your code appears here.': 'กรอกรายละเอียด แล้ว QR ของคุณจะแสดงตรงนี้',
    '1 module': '1 ช่อง',
    '{n} modules': '{n} ช่อง',
    '{size} × {size} modules · level {ecl} · 1 character': '{size} × {size} ช่อง · ระดับ {ecl} · 1 ตัวอักษร',
    '{size} × {size} modules · level {ecl} · {chars} characters': '{size} × {size} ช่อง · ระดับ {ecl} · {chars} ตัวอักษร',
    'With a logo, use High error correction so the covered middle can be recovered.': 'เมื่อใส่โลโก้ ควรใช้การแก้ไขข้อผิดพลาดระดับสูง เพื่อให้อ่านส่วนตรงกลางที่ถูกบังได้',
    'That’s a lot of data, so the code is dense. Print it large, or shorten the content.': 'ข้อมูลเยอะมาก QR จึงแน่น ควรพิมพ์ให้ใหญ่ หรือย่อเนื้อหาให้สั้นลง',
    'Ready. Test it with your phone camera before printing.': 'พร้อมแล้ว ลองสแกนด้วยกล้องมือถือก่อนสั่งพิมพ์',
    'The code is lighter than its background. Many phone cameras can’t read that, so swap the colours.': 'QR สีอ่อนกว่าพื้นหลัง กล้องมือถือหลายรุ่นอ่านไม่ได้ ลองสลับสีกัน',
    'The colours are quite close (contrast {c}:1). Go darker on the code or lighter on the background, and test it with a phone.': 'สีใกล้กันเกินไป (คอนทราสต์ {c}:1) ใช้สี QR ให้เข้มขึ้นหรือพื้นหลังให้สว่างขึ้น แล้วลองสแกนด้วยมือถือ',
    'That’s too much text for one QR code. Shorten it or use a lower error correction level.': 'ข้อความยาวเกินกว่าจะใส่ใน QR เดียว ลองย่อให้สั้นลง หรือลดระดับการแก้ไขข้อผิดพลาด',
    'Change logo': 'เปลี่ยนโลโก้',
    'Add logo': 'ใส่โลโก้',
    'Pick an image file for the logo': 'เลือกไฟล์รูปสำหรับโลโก้',
    'That logo is over 15 MB': 'โลโก้ใหญ่เกิน 15 MB',
    'That image couldn’t be opened': 'เปิดรูปนี้ไม่ได้',
    'Fill in the details first': 'กรอกรายละเอียดก่อน',
    'Image copied': 'คัดลอกรูปแล้ว',
    'Your browser won’t copy images here. Use Download PNG instead.': 'เบราว์เซอร์นี้คัดลอกรูปไม่ได้ ใช้ปุ่มดาวน์โหลด PNG แทน',
  },
};
