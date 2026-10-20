# Reference QR matrices from segno, for tests/qr.test.js.
# segno adds a whole zero byte of padding when the data already ends on a byte boundary; the
# standard only pads up to the boundary, so that step is patched to follow the standard.
import json, sys, segno
import segno.encoder as enc
_orig = enc.write_padding_bits
def _spec(buff, version, length):
    if length % 8: _orig(buff, version, length)
enc.write_padding_bits = _spec
cases = [('https://www.klickode.com/', 'M'), ('HELLO WORLD', 'Q'), ('0812345678', 'L'), ('WIFI:T:WPA;S:Klickode Studio;P:p@ss word;;', 'M'),
         ('สวัสดีครับ', 'H'), ('emoji 😀 ok', 'L'), ('3141592653589793238462643383279502884197', 'H'),
         ('00020101021229370016A000000677010111011300668999999995802TH530376454071500.00630414F7', 'M'),
         ('https://line.me/R/ti/p/@klickode', 'Q'), ('x' * 300, 'L'), ('A1-' * 120, 'H'), ('9' * 1200, 'M')]
out = []
for text, ecl in cases:
    for boost in (False, True):
        q = segno.make_qr(text, error=ecl, boost_error=boost, encoding='utf-8')
        out.append({'text': text, 'ecl': ecl, 'boost': boost, 'version': q.version, 'refEcl': q.error.upper(), 'mask': q.mask,
                    'rows': [''.join('1' if v else '0' for v in row) for row in q.matrix]})
json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False, separators=(',', ':'))
