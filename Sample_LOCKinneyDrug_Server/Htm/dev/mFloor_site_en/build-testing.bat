call build-copy
copy app-production.json ..\mFloor\app.json
copy index-production.html ..\mFloor\index.html

cd ..\mFloor\
sencha app build testing >..\mFloor_site_en\build.txt
