#!/usr/bin/env python3
"""Conservative, dependency-free checks before a Windows GitHub Actions build."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys

root = Path(__file__).resolve().parent.parent

class SourceRefs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'script' and 'src' in d: self.refs.append(d['src'])
        if tag == 'link' and 'href' in d: self.refs.append(d['href'])

try:
    config = json.loads((root / 'src-tauri/tauri.conf.json').read_text(encoding='utf8'))
    cargo = (root / 'src-tauri/Cargo.toml').read_text(encoding='utf8')
    index = (root / 'src/index.html').read_text(encoding='utf8')
    app = (root / 'src/app.js').read_text(encoding='utf8')
    state = (root / 'src/state.js').read_text(encoding='utf8')
    readme = (root / 'README_WINDOWS10.md').read_text(encoding='utf8')
    assert config['version'] == '0.3.11'
    assert config['productName'] == 'Storyboard Studio Next'
    assert config['build']['frontendDist'] == '../src'
    assert config['app']['withGlobalTauri'] is True
    assert config['bundle']['windows']['nsis']['installMode'] == 'currentUser'
    assert config['bundle']['windows']['webviewInstallMode']['type'] == 'downloadBootstrapper'
    assert 'tauri = { version = "2"' in cargo
    assert re.search(r'^version = "0\.3\.11"$', cargo, flags=re.M)
    assert (root / 'src-tauri/Cargo.lock').is_file()
    for f in ('src-tauri/src/main.rs', 'src-tauri/src/lib.rs', 'src-tauri/build.rs', 'src/db.js', 'src/importer.js', 'src/media.js', 'src/state.js', 'src/app.js'):
        assert (root / f).is_file(), f
    for path in config['bundle']['icon']:
        ico = root / 'src-tauri' / path
        assert ico.is_file(), path
        if path.endswith('.ico'): assert ico.read_bytes()[:4] == b'\x00\x00\x01\x00', 'invalid ICO header'
    refs = SourceRefs(); refs.feed(index)
    for ref in refs.refs:
        assert (root / 'src' / ref).is_file(), f'Broken entry reference: {ref}'
    for f in ('folder-icon.png', 'menu-click-1.wav', 'menu-click-2.wav', 'menu-click-3.wav', 'notes-icon.png', 'page-flip-back.wav', 'page-flip-forward.wav', 'stickies.png'):
        assert (root / 'src/assets' / f).is_file(), f
    assert 'storyboardStudio.next.v03.state' in state, 'Local storage identity changed'
    assert '.storyboardstudio' in (root / 'src/media.js').read_text(encoding='utf8'), 'Project export is missing'
    assert 'e.ctrlKey&&!e.metaKey&&k===\'y\'' in app, 'Windows Redo shortcut is missing'
    assert 'GitHub Actions' in readme
except (AssertionError, KeyError, OSError, ValueError) as err:
    print(f'CHECK FAILED: {err}', file=sys.stderr)
    sys.exit(1)
print('PASS: configuration, icons, assets, local storage ID, version and Windows CI prerequisites.')
