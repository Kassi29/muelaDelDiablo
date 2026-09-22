@echo off
setlocal

:: Verificar si python está en el PATH
where python >nul 2>nul
if %errorlevel% equ 0 (
    python "%~dp0generate_qr.py" %*
    goto end
)

:: Verificar si py launcher está disponible
where py >nul 2>nul
if %errorlevel% equ 0 (
    py "%~dp0generate_qr.py" %*
    goto end
)

:: Si no se encontró directamente
echo [ERROR] No se detecto Python instalado en el PATH.
echo Por favor asegurate de tener Python instalado o agregarlo al PATH del sistema.
echo Puedes descargarlo desde: https://www.python.org/downloads/
pause

:end
endlocal
