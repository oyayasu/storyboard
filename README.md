# Storyboard Studio Next v0.3.12 — macOS and Windows

The current source is v0.3.12 (Tauri 2, Rust, HTML/CSS/JavaScript). User project data is stored separately from the application source.

## macOS — Apple Silicon (M1/M2/M3/M4)

**Download a ready-to-install build:** Open the [macOS Apple Silicon GitHub Actions workflow](https://github.com/oyayasu/storyboard/actions/workflows/macos.yml), choose a successful run from the v0.3.12 branch, and download the `Storyboard-Studio-Next-v0.3.12-macOS-Apple-Silicon` artifact. Extract the artifact ZIP and either open the included DMG or unzip the included app bundle. Copy the application into `/Applications`.

The Mac build is **ad-hoc signed**, not Apple Developer ID notarized; macOS may require **System Settings → Privacy & Security → Open Anyway** on first launch. Do not bypass this prompt for software from an untrusted source.

**Build locally on a Mac:** Install Xcode Command Line Tools, Rust and the Tauri CLI v2, then run `bash 'Build macOS App.command'`. The script generates the macOS icon, builds the .app/.dmg, backs up any previous `~/Applications/Storyboard Studio Next.app`, and installs the newer app there.

## Windows 10/11 x64

See [README_WINDOWS10.md](README_WINDOWS10.md). Windows builds are still available but are not required for the macOS build.

Export .storyboardstudio backups before upgrading important projects.
