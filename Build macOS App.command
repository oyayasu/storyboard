#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
[ ! -f "$HOME/.cargo/env" ] || source "$HOME/.cargo/env"
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This build script must be run on a Mac (macOS)."
  exit 1
fi
if ! command -v cargo >/dev/null 2>&1; then
  echo "Rust/Cargo not found. Install Rust before building."
  exit 1
fi
if ! cargo tauri --version >/dev/null 2>&1; then
  echo "Tauri CLI 2 not found. Install it with: cargo install tauri-cli --version '^2' --locked"
  exit 1
fi
bash scripts/generate_macos_icon.sh
echo "Building Storyboard Studio Next v0.3.12 for macOS..."
cargo tauri build --bundles app,dmg
bundle="src-tauri/target/release/bundle/macos/Storyboard Studio Next.app"
if [[ ! -d "$bundle" ]]; then
  echo "Build did not produce the expected macOS .app at: $bundle"
  exit 1
fi
mkdir -p "$HOME/Applications"
destination="$HOME/Applications/Storyboard Studio Next.app"
backup=""
if [[ -e "$destination" ]]; then
  stamp="$(date +%Y%m%d-%H%M%S)"
  backup="$HOME/Applications/Storyboard Studio Next.backup-$stamp.app"
  echo "Backing up existing app to: $backup"
  mv "$destination" "$backup"
fi
echo "Installing application into ~/Applications..."
if ! ditto "$bundle" "$destination"; then
  echo "Installation failed."
  if [[ -n "$backup" && -d "$backup" && ! -e "$destination" ]]; then mv "$backup" "$destination"; fi
  exit 1
fi
echo
printf 'Built and installed: %s\n' "$destination"
echo "Your source folder and existing project data were not intentionally modified."
echo "Open the installed app from Finder > Home > Applications."
