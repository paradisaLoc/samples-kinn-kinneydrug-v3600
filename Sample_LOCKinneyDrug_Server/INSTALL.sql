/* PRIORITY 28 */
/* EXECUTED EVERYTIME THE OPTION IS INSTALLED */

/* copy the mFloor demo */
@EXEC(EXE='xcopy.exe @RUNSamples\Sample_LOCKinneyDrug_Server\Htm\mFloor\*.* @OfficeHtm\mFloor\ /E /Y');

@EXEC(SQL=REFRESH_MENU);

/* exit if base is not installed */
@fmt(CMP,@dbHot(FindFirst,@OfficeHtm\dev\mFloor\app.js)=,'®fmt(CHR,26)');

@exec(EXE='cmd.exe /c rmdir /S /Q @OfficeHtm\dev\mFloor_site_en');
@exec(EXE='cmd.exe /c rmdir /S /Q @OfficeHtm\dev\mFloor_site_fr');

/* copy the demo site forms */
@EXEC(EXE='xcopy.exe @RUNSamples\Sample_LOCKinneyDrug_Server\Htm\dev\*.* @OfficeHtm\dev\ /E /Y');

/* execute build */ 
@EXEC(EXE='@OfficeHtm\dev\mFloor_site_en\build-phonegap.bat @Office');
@EXEC(EXE='@OfficeHtm\dev\mFloor_site_en\build-production.bat @Office');
@EXEC(EXE='@OfficeHtm\dev\mFloor_site_fr\build-production.bat @Office');

/* RESULT MFLOOR */
@WIZRPL(DIR=@OfficeHtm\dev\mFloor\);
@WIZRPL(FILE=BUILD.TXT);
@FMT(CMP,'@msgFILE(FINDINFILE,[ERR])=','®WIZRPL(X-PRIORITY=0)®WIZRPL(SUBJECT=MFLOOR BUILD SUCCESS)','®WIZRPL(X-PRIORITY=1)®WIZRPL(SUBJECT=MFLOOR BUILD ERROR)');
@WIZCLR(DIR);
@WIZCLR(FILE);

@WIZRPL(TARGET=@TER);
@EXEC(SQT=@OfficeHtm\dev\mFloor\BUILD.TXT);
@FMT(CMP,@WIZGET(X-PRIORITY)=0,,'®FMT(CHR,27)');
@WIZCLR(X-PRIORITY);

/* RESULT MFLOOR NATIVE */
@WIZRPL(DIR=@OfficeHtm\dev\mFloor\);
@WIZRPL(FILE=BUILD-NATIVE.TXT);
@FMT(CMP,'@msgFILE(FINDINFILE,[ERR])=','®WIZRPL(X-PRIORITY=0)®WIZRPL(SUBJECT=MFLOOR BUILD SUCCESS)','®WIZRPL(X-PRIORITY=1)®WIZRPL(SUBJECT=MFLOOR BUILD ERROR)');
@WIZCLR(DIR);
@WIZCLR(FILE);

@WIZRPL(TARGET=@TER);
@EXEC(SQT=@OfficeHtm\dev\mFloor\BUILD-NATIVE.TXT);
@FMT(CMP,@WIZGET(X-PRIORITY)=0,,'®FMT(CHR,27)');
@WIZCLR(X-PRIORITY);

/* UPDATE SAMPLE */
@WIZRPL(SRC_PATH=@RUNSamples\Sample_LOCKinneyDrug_Server\Inbox\mFloor_ZipSample.sqi);
@WIZRPL(TAR_PATH=@OFFICEXF@STORE@TER\mFloor_ZipSample.sqi);
@EXEC(XCH=COPYFILE);
