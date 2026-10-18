// Tool categories, in display order. Each gets a hub page at /<slug>/ that links
// its tools together, which helps both visitors and search engines.
export const categories = [
  {
    id: 'business',
    intro: `<p>If you sell on Etsy, Shopee, TikTok Shop or through WhatsApp, your website and your social posts should point people to the place they can actually buy. These tools make the cards, QR codes, pay signs and link pages that do that, in your colours, without a designer.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["I want a “shop us on Etsy” box for my website", 'shop-card-maker'],
      ["I need an image for an Instagram or Facebook post that links to my shop", 'shop-card-maker'],
      ["I want WhatsApp or LINE buttons on my contact page", 'shop-card-maker'],
      ["I need a QR code for my menu, Wi-Fi or LINE account", 'qr-code-generator'],
      ["Customers should be able to pay me by PromptPay", 'promptpay-qr'],
      ["I want one page with all my links for my Instagram or TikTok bio", 'link-in-bio'],
    ],
    icon: '<path d="M3 10.5 4.6 4h14.8l1.6 6.5"/><path d="M3 10.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12.5V20h14v-7.5"/><path d="M10 20v-4.5h4V20"/>',
    slug: 'business-tools',
    name: 'Business & social',
    title: 'Free Tools for Small Businesses and Social Media',
    description: 'Shop cards, QR codes, PromptPay pay signs and link-in-bio pages for small businesses on Etsy, TikTok, Shopee, LINE and Instagram. Free, no account needed.',
    th: {
      name: "ธุรกิจและโซเชียล",
      title: "เครื่องมือฟรีสำหรับร้านค้าออนไลน์และธุรกิจ SME",
      description: "สร้าง QR พร้อมเพย์ QR Code การ์ดร้านค้า และหน้ารวมลิงก์ สำหรับร้านบน Shopee, Lazada, TikTok, LINE และ Instagram ใช้ฟรี ไม่ต้องสมัคร",
      intro: `<p>ถ้าคุณขายของบน Shopee, Lazada, TikTok Shop หรือผ่าน LINE และ WhatsApp เว็บไซต์และโพสต์โซเชียลของคุณควรพาลูกค้าไปยังที่ที่ซื้อได้จริง เครื่องมือในหมวดนี้ช่วยทำการ์ดร้านค้า QR Code ป้ายรับเงินพร้อมเพย์ และหน้ารวมลิงก์ในสีของแบรนด์คุณ โดยไม่ต้องจ้างนักออกแบบ</p>`,
      guide: [
        ["อยากให้ลูกค้าโอนเงินผ่านพร้อมเพย์ได้", 'promptpay-qr'],
        ["อยากได้ QR Code สำหรับเมนู Wi-Fi หรือบัญชี LINE", 'qr-code-generator'],
        ["อยากได้กล่อง “ช้อปกับเราบน Shopee” ไว้บนเว็บไซต์", 'shop-card-maker'],
        ["อยากได้รูปโพสต์ Facebook หรือ Instagram ที่พาไปร้าน", 'shop-card-maker'],
        ["อยากได้หน้าเดียวรวมทุกลิงก์ไว้ใส่ไบโอ Instagram หรือ TikTok", 'link-in-bio'],
      ],
    },
  },
  {
    id: 'images',
    intro: `<p>Most image problems come down to three things: the wrong format, a file that’s too big, or dimensions that don’t fit. A fourth one people forget about is the hidden data in photos, like where they were taken. Every tool here works on your device, so you can use them on private photos too.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["A form won’t take my file because it’s HEIC, AVIF or WebP", 'image-converter'],
      ["My photo is over the upload limit (say 200 KB or 2 MB)", 'image-compressor'],
      ["I need exact pixel sizes, like 1080 × 1080", 'image-resizer'],
      ["I want to post a photo without giving away where I live", 'exif-remover'],
      ["My website is slow because the images are huge", 'image-compressor'],
      ["One photo needs to fit Instagram, Facebook and a story", 'social-image-resizer'],
      ["What are the exact colours in my logo?", 'brand-palette'],
    ],
    icon: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m21 15-5-5L5 21"/>',
    slug: 'image-tools',
    name: 'Image tools',
    title: 'Free Image Tools: Convert, Compress and Resize Online',
    description: 'Convert, shrink and resize images, or strip the location data out of your photos. It all happens in your browser, so nothing gets uploaded.',
    th: {
      name: "เครื่องมือรูปภาพ",
      title: "เครื่องมือรูปภาพฟรี: แปลงไฟล์ ย่อขนาด และปรับขนาดรูปออนไลน์",
      description: "แปลงไฟล์รูป ย่อขนาดไฟล์ ปรับขนาด และลบข้อมูลตำแหน่งออกจากรูปถ่าย ทุกอย่างทำงานในเบราว์เซอร์ รูปของคุณจึงไม่ถูกอัปโหลด",
      intro: `<p>ปัญหาเรื่องรูปส่วนใหญ่มีอยู่ไม่กี่อย่าง คือไฟล์ผิดนามสกุล ไฟล์ใหญ่เกิน หรือขนาดรูปไม่พอดี อีกเรื่องที่คนมักลืมคือข้อมูลที่ซ่อนอยู่ในรูป เช่นตำแหน่งที่ถ่าย เครื่องมือทั้งหมดในหมวดนี้ทำงานบนเครื่องของคุณ จึงใช้กับรูปส่วนตัวได้อย่างสบายใจ</p>`,
      guide: [
        ["เว็บไม่รับไฟล์ HEIC, AVIF หรือ WebP", 'image-converter'],
        ["รูปใหญ่เกินที่ระบบกำหนด เช่น 200 KB หรือ 2 MB", 'image-compressor'],
        ["ต้องการขนาดพิกเซลที่แน่นอน เช่น 1080 × 1080", 'image-resizer'],
        ["อยากโพสต์รูปโดยไม่บอกว่าบ้านอยู่ที่ไหน", 'exif-remover'],
        ["อยากให้รูปเดียวพอดีทั้ง Instagram, Facebook และสตอรี่", 'social-image-resizer'],
        ["อยากรู้รหัสสีที่แท้จริงในโลโก้", 'brand-palette'],
      ],
    },
  },
  {
    id: 'json',
    intro: `<p>JSON is how most apps and APIs pass data around, and it’s strict: one stray comma and nothing works. These tools help you read it, fix it, compare versions and move it in and out of spreadsheets. Long ID numbers are kept exactly as written, which many online formatters get wrong.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["An API sent back one long unreadable line", 'json-formatter'],
      ["Something says “Unexpected token” and I can’t find it", 'json-formatter'],
      ["What changed between yesterday’s response and today’s?", 'json-diff'],
      ["I have a spreadsheet and need JSON", 'csv-to-json'],
      ["I have JSON and need to open it in Excel or Google Sheets", 'json-to-csv'],
      ["I need a schema to validate responses or document an API", 'json-schema-generator'],
    ],
    icon: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>',
    slug: 'json-tools',
    name: 'JSON & data',
    title: 'Free JSON Tools: Format, Compare and Convert',
    description: 'Tidy up and check JSON, compare two files, switch between CSV and JSON, and get a schema from a sample response.',
    th: {
      name: "JSON และข้อมูล",
      title: "เครื่องมือ JSON ฟรี: จัดรูปแบบ เปรียบเทียบ และแปลงไฟล์",
      description: "จัดรูปแบบและตรวจสอบ JSON เปรียบเทียบสองไฟล์ แปลงระหว่าง CSV กับ JSON และสร้าง JSON Schema จากตัวอย่างข้อมูล",
      intro: `<p>JSON คือรูปแบบที่แอปและ API ส่วนใหญ่ใช้รับส่งข้อมูล และมันเข้มงวดมาก แค่ลูกน้ำเกินตัวเดียวก็ใช้ไม่ได้แล้ว เครื่องมือในหมวดนี้ช่วยให้อ่านง่าย หาจุดผิด เปรียบเทียบเวอร์ชัน และย้ายข้อมูลเข้าออกสเปรดชีต ตัวเลขยาวๆ อย่างเลขไอดีจะถูกเก็บไว้ตรงตามต้นฉบับ</p>`,
      guide: [
        ["API ส่งข้อมูลกลับมาเป็นบรรทัดยาวอ่านไม่ออก", 'json-formatter'],
        ["ขึ้นข้อความ “Unexpected token” แต่หาไม่เจอว่าผิดตรงไหน", 'json-formatter'],
        ["ข้อมูลวันนี้ต่างจากเมื่อวานตรงไหน?", 'json-diff'],
        ["มีสเปรดชีตแต่ต้องการ JSON", 'csv-to-json'],
        ["มี JSON แต่อยากเปิดใน Excel หรือ Google Sheets", 'json-to-csv'],
        ["ต้องการ Schema ไว้ตรวจข้อมูลหรือทำเอกสาร API", 'json-schema-generator'],
      ],
    },
  },
  {
    id: 'seo',
    intro: `<p>A lot of SEO is getting the basics right on every page: a title that fits, a description worth clicking, nothing blocked by mistake, and text that’s about what people search for. These tools check those basics from the HTML or text you paste in. Nothing is fetched or sent anywhere.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["Is my title or description too long for Google?", 'serp-preview'],
      ["Does this page have the tags it needs (canonical, Open Graph, alt text)?", 'meta-tag-analyzer'],
      ["Did I block Google from part of my site?", 'robots-txt-tester'],
      ["Am I repeating one word too often?", 'keyword-density'],
    ],
    icon: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/>',
    slug: 'seo-tools',
    name: 'SEO tools',
    title: 'Free SEO Tools: Meta Tags, SERP Preview and robots.txt',
    description: 'Check your meta tags, see how a page looks in Google, test robots.txt rules and count your keywords. No account needed.',
    th: {
      name: "เครื่องมือ SEO",
      title: "เครื่องมือ SEO ฟรี: เช็กเมตาแท็ก ตัวอย่างผลค้นหา และ robots.txt",
      description: "ตรวจเมตาแท็ก ดูว่าหน้าเว็บจะแสดงบน Google อย่างไร ทดสอบกฎ robots.txt และนับความถี่คีย์เวิร์ด ใช้ฟรี ไม่ต้องสมัคร",
      intro: `<p>SEO ส่วนใหญ่คือการทำพื้นฐานให้ถูกในทุกหน้า ทั้งชื่อหน้าที่ยาวพอดี คำอธิบายที่น่าคลิก ไม่บล็อกหน้าสำคัญโดยไม่ตั้งใจ และเนื้อหาที่ตรงกับสิ่งที่คนค้นหา เครื่องมือในหมวดนี้ตรวจพื้นฐานเหล่านี้จาก HTML หรือข้อความที่คุณวาง โดยไม่ส่งข้อมูลไปไหน</p>`,
      guide: [
        ["ชื่อหน้าหรือคำอธิบายยาวเกินที่ Google แสดงไหม?", 'serp-preview'],
        ["หน้านี้มีแท็กที่จำเป็นครบไหม (canonical, Open Graph, alt)?", 'meta-tag-analyzer'],
        ["เผลอบล็อก Google ไม่ให้เข้าบางส่วนของเว็บหรือเปล่า?", 'robots-txt-tester'],
        ["ใช้คำไหนซ้ำมากเกินไปหรือเปล่า?", 'keyword-density'],
      ],
    },
  },
  {
    id: 'text',
    intro: `<p>Small text jobs that come up every day: checking a pattern before it goes into code, spotting what someone changed in a document, or renaming a list of fields from one style to another. Thai text is counted properly, word by word.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["Does my regex match what I think it matches?", 'regex-tester'],
      ["What changed between two versions of this text?", 'text-diff'],
      ["I need these names in camelCase or snake_case", 'case-converter'],
      ["How many words and characters is this?", 'case-converter'],
    ],
    icon: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    slug: 'text-tools',
    name: 'Regex & text',
    title: 'Free Regex and Text Tools',
    description: 'Test regular expressions, compare two versions of a text, and switch between naming styles like camelCase and snake_case.',
    th: {
      name: "Regex และข้อความ",
      title: "เครื่องมือ Regex และข้อความฟรี",
      description: "ทดสอบ Regular Expression เปรียบเทียบข้อความสองเวอร์ชัน และแปลงรูปแบบชื่อ เช่น camelCase และ snake_case พร้อมนับคำภาษาไทยได้ถูกต้อง",
      intro: `<p>งานข้อความเล็กๆ ที่เจอทุกวัน เช่น ทดสอบ pattern ก่อนใส่ในโค้ด ดูว่ามีคนแก้อะไรในเอกสาร หรือเปลี่ยนชื่อฟิลด์จากรูปแบบหนึ่งไปอีกแบบ ข้อความภาษาไทยจะถูกนับเป็นคำได้อย่างถูกต้อง</p>`,
      guide: [
        ["Regex ของฉันจับสิ่งที่ต้องการจริงไหม?", 'regex-tester'],
        ["ข้อความสองเวอร์ชันต่างกันตรงไหน?", 'text-diff'],
        ["ต้องการเปลี่ยนชื่อเหล่านี้เป็น camelCase หรือ snake_case", 'case-converter'],
        ["ข้อความนี้มีกี่คำ กี่ตัวอักษร?", 'case-converter'],
      ],
    },
  },
  {
    id: 'encoding',
    intro: `<p>The small conversions developers look up constantly: decoding a Base64 string, fixing a URL full of %20s, reading what’s inside a login token, making test IDs or turning an epoch number into a date you can read. Tokens and keys stay in your browser.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["What does this Base64 string say?", 'base64'],
      ["My link has %20 and %26 all over it", 'url-encoder'],
      ["What’s inside this JWT, and has it expired?", 'jwt-decoder'],
      ["I need a batch of UUIDs for test data", 'uuid-generator'],
      ["What date is 1700000000?", 'timestamp-converter'],
    ],
    icon: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    slug: 'encoding-tools',
    name: 'Encoding & IDs',
    title: 'Free Encoding Tools: Base64, URL, JWT and UUID',
    description: 'Encode and decode Base64 and URLs, read what’s inside a JWT, make UUIDs and turn Unix timestamps into dates.',
    th: {
      name: "เข้ารหัสและไอดี",
      title: "เครื่องมือเข้ารหัสฟรี: Base64, URL, JWT และ UUID",
      description: "เข้ารหัสและถอดรหัส Base64 และ URL ดูข้อมูลใน JWT สร้าง UUID และแปลง Unix timestamp เป็นวันที่ พร้อมปี พ.ศ.",
      intro: `<p>งานแปลงข้อมูลที่นักพัฒนาต้องค้นหาบ่อยๆ เช่น ถอดรหัสข้อความ Base64 แก้ลิงก์ที่มี %20 เต็มไปหมด ดูข้อมูลใน token สร้างไอดีสำหรับทดสอบ หรือแปลงตัวเลข epoch เป็นวันที่ที่อ่านออก token และคีย์ต่างๆ จะอยู่ในเบราว์เซอร์ของคุณเท่านั้น</p>`,
      guide: [
        ["ข้อความ Base64 นี้เขียนว่าอะไร?", 'base64'],
        ["ลิงก์มี %20 และ %26 เต็มไปหมด", 'url-encoder'],
        ["ใน JWT นี้มีอะไร หมดอายุหรือยัง?", 'jwt-decoder'],
        ["ต้องการ UUID หลายตัวสำหรับข้อมูลทดสอบ", 'uuid-generator'],
        ["1700000000 คือวันที่เท่าไหร่?", 'timestamp-converter'],
      ],
    },
  },
];

// Wrap a category's icon paths in an <svg> (24×24, stroked with currentColor).
export const categoryIcon = (c, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.icon}</svg>`;

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
