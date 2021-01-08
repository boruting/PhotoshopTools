
@echo off
set CEP_A=textAssets
set CEP_B=boru.UI-toolBox
set CEP_C=boru.UI-tool
set CEP_D=boru.PSD-lib
set CEP_E=materialArt-lib
set CEP_F=PhotoshopTools
echo %~dp0 

rem mklink /J "%~dp0%CEP_A%" "D:\Git\jsx\tool\%CEP_A%"
mklink /J "%~dp0PS_CEP_WordArt" "D:\Git\PS_CEP_WordArt"
mklink /J "%~dp0%CEP_B%" "D:\Git\jsx\tool\%CEP_B%"
mklink /J "%~dp0%CEP_C%" "D:\Git\jsx\tool\%CEP_C%"
mklink /J "%~dp0%CEP_D%" "D:\Git\jsx\tool\%CEP_D%"
mklink /J "%~dp0%CEP_E%" "D:\Git\jsx\tool\%CEP_E%"
mklink /J "%~dp0%CEP_F%" "D:\Git\%CEP_F%"
pause





