@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
where git >nul 2>&1
if errorlevel 1 (
  echo Git nao encontrado. Instale Git for Windows ou use Add file - Upload files no GitHub.
  pause
  exit /b 1
)
echo Repositorio: https://github.com/oyayasu/storyboard.git
echo ATENCAO: esse repositorio e PUBLICO. Revise antes de publicar.
echo.
if not exist ".git" (
  git init || goto :fail
)
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  git remote add origin https://github.com/oyayasu/storyboard.git || goto :fail
) else (
  for /f "delims=" %%R in ('git remote get-url origin') do set "OLDREMOTE=%%R"
  if /i not "!OLDREMOTE!"=="https://github.com/oyayasu/storyboard.git" (
    echo O remoto origin nao e o repositorio esperado: !OLDREMOTE!
    goto :fail
  )
)
git fetch origin main || goto :fail
git checkout -B main origin/main || goto :fail
git add -A || goto :fail
git diff --cached --quiet
if not errorlevel 1 (
  git commit -m "Add Storyboard Studio Next 0.3.11 Windows 10 source and build" || goto :fail
) else (
  echo Nenhuma alteracao detectada.
)
git push -u origin main || goto :fail
echo.
echo ENVIO CONCLUIDO. Confira https://github.com/oyayasu/storyboard/actions
pause
exit /b 0
:fail
echo.
echo Ocorreu um erro. Confira a mensagem acima. Nenhuma acao de push forcado foi executada.
pause
exit /b 1
