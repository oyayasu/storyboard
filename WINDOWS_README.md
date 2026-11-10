# Windows x64 builds

Install the app's `*-setup.exe`. These are Windows 10/11 x64 builds; Storyboard Studio Next remains a separate app from the old original Storyboard Studio. Tauri installers install Microsoft WebView2 if needed. The binaries are unsigned.

FolderExporter also includes a portable ZIP. Extract the complete folder before opening FolderExporter.exe; its `_internal` folder contains its required runtime and must stay beside the EXE. Python does not need to be installed to run the compiled app.

Subtitler retains its own document association and self-contained audio projects. Recognition requires Windows-native FFmpeg and whisper-cli, plus a Whisper model. Existing GGML `.bin` models can be reused. Put the Windows executables and their accompanying DLLs in `Documents/Shared Whisper/engine`, or select them in Subtitler's Settings. macOS executables cannot run on Windows. WhisperX remains optional and needs its own Windows Python environment.

When moving a workflow from Mac, copy the complete main project folder including Studio Link, plus the editable .StoryboardStudio and .subtitler files. Choose/reconnect the project folder on Windows. Locate external recordings when needed, or recover them from a self-contained Subtitler project. Existing Resolve/Premiere projects may need their own media relinking after a computer/path change.

Versions: Storyboard Studio Next 0.12.1; Subtitler 0.8.2; FolderExporter 1.10.1. FolderExporter's compatibility update respects Storyboard Studio's archive parent and committed recovery journals and queries Windows process handles safely. No speech models or personal projects are bundled.

Storyboard Studio 0.12.1 also normalizes the project root before checking ownership/containment on Windows, including short temp-folder names and canonical paths.

The Windows Storyboard Studio launcher locates the installed Subtitler executable (including a custom location recorded by its document association), so Match timing does not require adding Subtitler to PATH. Release builds do not open a console window.

Subtitler 0.8.2 fixes Windows folder-copy flush permissions and rebases existing short/long folder aliases when moving its save folder.
