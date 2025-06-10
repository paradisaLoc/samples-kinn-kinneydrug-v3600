if not "%1"=="" pushd %1Htm\dev\mFloor_site_en

call build-copy %1

copy app-production.json ..\mFloor\app.json
copy index-production.html ..\mFloor\index.html

cd ..\mFloor\
rd build /s /q
md build

sencha app build production >build.txt

rd ..\..\mFloor\resources /s /q
md ..\..\mFloor\resources

xcopy build\Production\SMS\*.* ..\..\mFloor\ /y >nul
xcopy build\Production\SMS\resources\*.* ..\..\mFloor\resources\ /s /y >nul

copy ..\mFloor_site_en\index-honeywell.html ..\..\mFloor\
copy ..\mFloor_site_en\index-datalogic.html ..\..\mFloor\
copy ..\mFloor_site_en\index-zebra.html ..\..\mFloor\
copy ..\mFloor_site_en\index-dryrain.html ..\..\mFloor\

rem Honeywell driver
xcopy "..\mFloor_site_en\hardware\BarcodeReader.js" "..\..\mFloor\" /y /i /d >nul
xcopy "..\mFloor_site_en\hardware\BarcodeReader-Ajax.js" "..\..\mFloor\" /y /i /d >nul 
xcopy "..\mFloor_site_en\hardware\BarcodeReader-SwiftSettings.js" "..\..\mFloor\" /y /i /d >nul

rem Zebra driver
xcopy "..\mFloor_site_en\hardware\ebapi-modules.js" "..\..\mFloor\hardware\" /y /i /d >nul

if not "%1"=="" popd
