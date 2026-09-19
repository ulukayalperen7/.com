"""Static site checks. Run from any directory with Python's standard library."""
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.nodes = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        node = {"tag": tag, "attrs": dict(attrs), "text": ""}
        self.nodes.append(node)
        if tag not in {"meta", "link", "input", "img", "br", "hr", "path"}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1]["tag"] == tag:
            self.stack.pop()

    def handle_data(self, data):
        for node in self.stack:
            node["text"] += data


html = (ROOT / "index.html").read_text(encoding="utf-8")
page = PageParser()
page.feed(html)
assert not page.stack, "Unclosed or misnested HTML elements"
ids = [n["attrs"]["id"] for n in page.nodes if "id" in n["attrs"]]
assert len(ids) == len(set(ids)), "Duplicate HTML IDs"
assert sum(n["tag"] == "h1" for n in page.nodes) == 1, "Expected one primary heading"
assert page.nodes[0]["attrs"]["lang"] == "en", "English must work without JavaScript"
english = defaultdict(set)
for node in page.nodes:
    attrs = node["attrs"]
    assert not any(key.startswith("on") for key in attrs), "Unexpected inline event handler"
    for attribute in ("src", "href"):
        value = attrs.get(attribute, "")
        if value.startswith("#"):
            assert value[1:] in ids, value
        elif value and not urlparse(value).scheme and not value.startswith("//"):
            assert (ROOT / value.lstrip("/")).is_file(), value
    for attribute in ("aria-controls", "aria-labelledby", "aria-describedby"):
        for target in attrs.get(attribute, "").split():
            assert target in ids, target
    if attrs.get("target") == "_blank":
        assert {"noopener", "noreferrer"} <= set(attrs.get("rel", "").split())
    if node["tag"] == "script" and attrs.get("src", "").startswith("https:"):
        assert attrs.get("integrity", "").startswith("sha384-"), "Unpinned external script"
        assert attrs.get("crossorigin") == "anonymous"
        assert "async" in attrs, "Optional Markdown libraries should not block parsing"
    if node["tag"] == "label":
        assert attrs["for"] in ids
    if "data-i18n" in attrs:
        value = attrs[attrs["data-i18n-attr"]] if "data-i18n-attr" in attrs else node["text"]
        assert value.strip(), attrs["data-i18n"]
        english[attrs["data-i18n"]].add(value)

i18n = (ROOT / "js/i18n.js").read_text(encoding="utf-8")
keys = re.findall(r"^\s*'([^']+)':", i18n, re.M)
assert len(keys) == len(set(keys)), "Duplicate translation keys"
assert set(keys) == set(english), f"Translation mismatch: {set(keys) ^ set(english)}"
assert all(len(values) == 1 for values in english.values()), "Conflicting English defaults"
for script in (ROOT / "js").glob("*.js"):
    subprocess.run(["node", "--check", str(script)], check=True)
    for path in re.findall(r"from ['\"](\.[^'\"]+)['\"]", script.read_text(encoding="utf-8")):
        assert (script.parent / path).is_file(), path

chat = (ROOT / "js/chat.js").read_text(encoding="utf-8")
assert not re.search(r"innerHTML|outerHTML|insertAdjacentHTML|document\.write", chat)
assert "DOMPurify.sanitize" in chat and "messageDiv.textContent = text" in chat
assert chat.count("fetch(") == 1
assert "message: messageText" in chat and "session_id: currentSessionId" in chat
assert "https://career-ai-backend-sfcs.onrender.com/chat" in chat
form = next(n for n in page.nodes if n["tag"] == "form" and n["attrs"].get("class") == "contact-form")
assert form["attrs"]["action"] == "https://formspree.io/f/xjkobaya"
assert form["attrs"]["method"].upper() == "POST"
for name in ("name", "email", "message"):
    assert any(n["attrs"].get("name") == name and "required" in n["attrs"] for n in page.nodes)
assert (ROOT / "CNAME").read_text().strip() == "alperenulukaya.com"
canonical = next(n for n in page.nodes if n["attrs"].get("rel") == "canonical")
assert canonical["attrs"]["href"] == "https://alperenulukaya.com/"
source = html + i18n + chat + (ROOT / "js/main.js").read_text(encoding="utf-8")
assert not re.search(r"Computer Science|Bilgisayar Bilimleri|2024|seninsiten\.com|AI Enthusiast", source)
assert not re.search(r"Orbitron|font-awesome|fonts\.googleapis|digital-rain|createParticles|Online|Çevrimiçi", source)
assert not any(marker in source for marker in ("\ufffd", "\u00c3\u00bc", "\u00c4\u00b1")), "Corrupted UTF-8 text"
assert not re.search(r"AIza[\w-]{30,}|sk-[\w-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY", source)
css = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT / "css").glob("*.css"))
animations = re.findall(r"@keyframes\s+([\w-]+)", css)
assert len(animations) == len(set(animations)), "Duplicate keyframes"
assert css.count("{") == css.count("}"), "Unbalanced CSS braces"
defined_tokens = set(re.findall(r"(--[\w-]+)\s*:", css))
used_tokens = set(re.findall(r"var\((--[\w-]+)", css))
assert used_tokens <= defined_tokens, f"Undefined CSS tokens: {used_tokens - defined_tokens}"
assert defined_tokens <= used_tokens, f"Unused CSS tokens: {defined_tokens - used_tokens}"


def luminance(hex_color):
    rgb = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return sum(c * weight for c, weight in zip(linear, (0.2126, 0.7152, 0.0722)))


style = (ROOT / "css/style.css").read_text(encoding="utf-8")
for theme in (":root", "body.light-mode"):
    block = re.search(re.escape(theme) + r"\s*\{([^}]+)\}", style)[1]
    colors = dict(re.findall(r"--([\w-]+):\s*(#[0-9a-f]{6})", block))
    pairs = [(foreground, background, 4.5)
             for foreground in ("text", "muted", "accent", "error")
             for background in ("page", "surface", "surface-soft")]
    pairs += [("accent-ink", "accent", 4.5)]
    pairs += [(foreground, background, 3)
              for foreground in ("border", "focus")
              for background in ("page", "surface", "surface-soft")]
    for foreground, background, minimum in pairs:
        light, dark = sorted((luminance(colors[foreground]), luminance(colors[background])), reverse=True)
        ratio = (light + 0.05) / (dark + 0.05)
        assert ratio >= minimum, f"{theme}: {foreground}/{background} contrast {ratio:.2f} < {minimum}"

print(f"PASS: JS syntax/imports, HTML references/semantics, {len(keys)} EN/TR keys, API contracts, metadata, content, CSS tokens and theme contrast.")
