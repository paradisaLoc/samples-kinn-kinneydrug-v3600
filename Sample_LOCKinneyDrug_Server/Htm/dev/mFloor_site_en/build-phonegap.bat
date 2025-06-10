rd ..\mFloor\resources\icon /s /q
rd ..\mFloor\resources\splash /s /q
rd ..\mFloor\resources\store /s /q

md ..\mFloor\resources\icon
md ..\mFloor\resources\splash
md ..\mFloor\resources\store

call build-copy

xcopy "resources\iosroot\*.*" "..\mFloor\phonegap\www\" /s /e /y /i
xcopy "resources\icon\*.*" "..\mFloor\resources\icon\" /s /e /y /i
xcopy "resources\splash\*.*" "..\mFloor\resources\splash\" /s /e /y /i
xcopy "resources\store\*.*" "..\mFloor\resources\store\" /s /e /y /i

xcopy "config.xml" "..\mFloor\" /y /i
xcopy "phonegap.local.properties" "..\mFloor\" /y /i
xcopy "phonegap\.cordova\config.json" "..\mFloor\phonegap\.cordova\" /s /e /y /i /d

copy app-phonegap.json ..\mFloor\app.json
copy index-phonegap.html ..\mFloor\index.html

cd ..\mFloor\
sencha app build native >..\mFloor_site_en\build.txt

