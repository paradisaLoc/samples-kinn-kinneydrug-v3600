/* Ad Batch Report: Scan Down from Ad Sheets */
@WIZINIT;
@WIZEDIT(DITTO,SELECT A DITTO NUMBER);
@WIZDISPLAY;

@WIZRPL(DATECREATED=@DSDF);
@WIZRPL(TIMECREATED=@FMT(T6D,@NOW));

/* Scan Downs from Ad Sheets */
@wizrpl(ExtGridUsp=Kinney_Scandown_xsl);
@WIZSET(FILENAME=Kinney_Scandown.xls);
@WIZRPL(OUTPUT=@OFFICEDBT\@WIZGET(FILENAME))
@EXEC(XLS=RTM\Kinney_Scandown.xls);
@wizClr(OUTPUT);

@WIZRPL(TITLE=SaveFile);
@WIZRPL(FORM=SaveFile);
@WIZRPL(width=1)
@WIZRPL(height=1)
@EXEC(HTT=script\SKU_BAT_KDLOC_save_xls);
