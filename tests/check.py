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
ids = [n["attrs"]["id"] for n in page.nodes if "id" in n["attrs"]]
assert len(ids) == len(set(ids)), "Duplicate HTML IDs"
english = defaultdict(set)
for node in page.nodes:
    attrs = node["attrs"]
    for attribute in ("src", "href"):
        value = attrs.get(attribute, "")
        if value.startswith("#"):
            assert value[1:] in ids, value
        elif value and not urlparse(value).scheme and not value.startswith("//"):
            assert (ROOT / value.lstrip("/")).is_file(), value
    for target in attrs.get("aria-controls", "").split():
        assert target in ids, target
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
source = html + i18n + chat + (ROOT / "js/main.js").read_text(encoding="utf-8")
assert not re.search(r"Computer Science|Bilgisayar Bilimleri|2024|seninsiten\.com|AI Enthusiast", source)
assert not re.search(r"AIza[\w-]{30,}|sk-[\w-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY", source)
css = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT / "css").glob("*.css"))
animations = re.findall(r"@keyframes\s+([\w-]+)", css)
assert len(animations) == len(set(animations)), "Duplicate keyframes"
assert css.count("{") == css.count("}"), "Unbalanced CSS braces"
print(f"PASS: JS syntax/imports, HTML references, {len(keys)} EN/TR keys, API contracts, CNAME, content and CSS checks.")
