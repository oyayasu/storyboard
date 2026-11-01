#!/bin/bash
set -euo pipefail
storyboard_stage="$(mktemp -d)"
trap 'rm -rf "$storyboard_stage"' EXIT
storyboard_archive="$HOME/Downloads/Storyboard-Studio-v0.3.15-Mac-Apple-Silicon.zip"
if [ -f "$storyboard_archive" ]; then
  /usr/bin/ditto -xk "$storyboard_archive" "$storyboard_stage"
fi
storyboard_incoming=""
for candidate in "$storyboard_stage/Storyboard Studio Next.app" "$HOME/Downloads/Storyboard Studio Next"*.app; do
  if [ -f "$candidate/Contents/Info.plist" ] && [ "$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$candidate/Contents/Info.plist" 2>/dev/null)" = "0.3.15" ] && [ "$(/usr/libexec/PlistBuddy -c 'Print CFBundleIdentifier' "$candidate/Contents/Info.plist" 2>/dev/null)" = "local.filipe.storyboardstudio.next" ]; then
    storyboard_incoming="$candidate"
    break
  fi
done
[ -n "$storyboard_incoming" ] || { echo 'Download the v0.3.15 app ZIP into Downloads first.'; exit 1; }
/usr/bin/codesign --verify --deep --strict "$storyboard_incoming"
/usr/bin/osascript -e 'if application "Storyboard Studio Next" is running then tell application "Storyboard Studio Next" to quit' >/dev/null 2>&1 || true
mkdir -p "$HOME/Applications"
storyboard_destination="$HOME/Applications/Storyboard Studio Next.app"
storyboard_backup=""
if [ -e "$storyboard_destination" ]; then
  storyboard_backup="$HOME/Applications/Storyboard Studio Next.backup-$(date +%Y%m%d-%H%M%S).app"
  mv "$storyboard_destination" "$storyboard_backup"
fi
if ! /usr/bin/ditto "$storyboard_incoming" "$storyboard_destination"; then
  [ ! -e "$storyboard_destination" ] || mv "$storyboard_destination" "$storyboard_stage/incomplete.app"
  [ -z "$storyboard_backup" ] || mv "$storyboard_backup" "$storyboard_destination"
  exit 1
fi
/usr/bin/xattr -dr com.apple.quarantine "$storyboard_destination" 2>/dev/null || true
/usr/bin/open "$storyboard_destination"
