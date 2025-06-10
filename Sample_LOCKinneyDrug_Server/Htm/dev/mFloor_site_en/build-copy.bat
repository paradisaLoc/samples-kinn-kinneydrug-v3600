if not "%1"=="" pushd %1Htm\dev\mFloor_site_en
if "%STOREMAN%"=="" set STOREMAN=..\..\..\..\

rd ..\mFloor\app\view /s /q
md ..\mFloor\app\view

del ..\mFloor\app\model\Site*.js
del ..\mFloor\app\store\Site*.js
del ..\mFloor\overrides\*.* /q

del ..\mFloor\resources\sass\_Site*.scss
rd ..\mFloor\resources\images /s /q
md ..\mFloor\resources\images

For /D %%a in ("..\mFloor\app\model\*.*") do RD /S /Q "%%a"
For /D %%a in ("..\mFloor\app\store\*.*") do RD /S /Q "%%a"

xcopy "..\mFloor_base_en\app\*.*" "..\mFloor\app\" /s /e /y /i
xcopy "..\mFloor_base_en\resources\*.*" "..\mFloor\resources\" /s /e /y /i
xcopy "..\mFloor_base_en\overrides\*.*" "..\mFloor\overrides\" /s /e /y /i

xcopy "app\*.*" "..\mFloor\app\" /s /e /y /i
xcopy "resources\*.*" "..\mFloor\resources\" /s /e /y /i
xcopy "overrides\*.*" "..\mFloor\overrides\" /s /e /y /i

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%STOREMAN%Library\Install\Sencha\RefreshAppJs.ps1" "..\mFloor" "App.js"

if not "%1"=="" popd
