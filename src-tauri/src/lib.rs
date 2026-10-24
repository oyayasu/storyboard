use base64::{engine::general_purpose::STANDARD, Engine as _};
use std::{fs, path::Path};
use tauri::{AppHandle, Manager};

#[tauri::command]
fn pick_export_directory() -> Option<String> {
    rfd::FileDialog::new()
        .set_title("Choose Export Folder")
        .pick_folder()
        .map(|p| p.to_string_lossy().to_string())
}

#[tauri::command]
fn write_export_file(directory: String, filename: String, base64_data: String) -> Result<String, String> {
    let safe_name = Path::new(&filename)
        .file_name()
        .ok_or_else(|| "Invalid export filename".to_string())?;
    let bytes = STANDARD
        .decode(base64_data.as_bytes())
        .map_err(|e| format!("Could not decode export: {e}"))?;
    let path = Path::new(&directory).join(safe_name);
    fs::write(&path, bytes).map_err(|e| format!("Could not write export: {e}"))?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
fn force_exit(app: AppHandle) {
    app.exit(0);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                window.app_handle().exit(0);
            }
        })
        .invoke_handler(tauri::generate_handler![
            pick_export_directory,
            write_export_file,
            force_exit
        ])
        .run(tauri::generate_context!())
        .expect("error while running Storyboard Studio");
}
