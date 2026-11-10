[Setup]
AppId={{BBF5A9CE-C28C-482E-9DF1-112DDE9E057E}
AppName=FolderExporter
AppVersion=1.10.1
DefaultDirName={localappdata}\Programs\FolderExporter
DefaultGroupName=FolderExporter
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir=apps\FolderExporter-v1.10.1\installer
OutputBaseFilename=FolderExporter-1.10.1-Windows-x64-setup
SetupIconFile=apps\FolderExporter-v1.10.1\FolderExporter.ico
UninstallDisplayIcon={app}\FolderExporter.exe
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
CloseApplications=yes
[Files]
Source: "apps\FolderExporter-v1.10.1\dist\FolderExporter\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
[Icons]
Name: "{autoprograms}\FolderExporter"; Filename: "{app}\FolderExporter.exe"
[Run]
Filename: "{app}\FolderExporter.exe"; Description: "Open FolderExporter"; Flags: nowait postinstall skipifsilent
