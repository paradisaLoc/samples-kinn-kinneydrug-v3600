@wizRpl(OUTPUT=@DBHOT(INI,KinneyDrug.INI,ARExport,ExportDir)LOCAR.@DISF_@NOW.TXT);
@wizRpl(STYLE=TXT);

@exec(CGI=KINNEYDRUG_AR_EXPORT);

@wizClr(STYLE);
@wizClr(OUTPUT);

