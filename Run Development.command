#!/bin/bash
set -e
cd "$(dirname "$0")"
[ ! -f "$HOME/.cargo/env" ] || source "$HOME/.cargo/env"
echo "Running Storyboard Studio Next v0.3.11 in development mode (no release app installation)."
cargo tauri dev
