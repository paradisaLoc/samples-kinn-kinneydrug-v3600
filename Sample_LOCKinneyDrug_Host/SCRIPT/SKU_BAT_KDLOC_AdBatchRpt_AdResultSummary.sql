/* Ad Batch Report: Results Summary Report */

@WIZINIT;
@WIZEDIT(DITTO,SELECT A DITTO NUMBER);
@WIZTARGET(TARGET=RAL,SELECT F1000,F1018 FROM STO_TAB WHERE F1180='1' ORDER BY F1000);
@WIZDISPLAY;

@WIZRPL(DATECREATED=@DSDF);
@WIZRPL(TIMECREATED=@FMT(T6D,@NOW));

/* Add results Summary report */
@wizrpl(ExtGridUsp=Kinney_AdResultSummary_xls);
@WIZSET(FILENAME=Kinney_AdResultSummary.xls);
@WIZRPL(OUTPUT=@OFFICEDBT\@WIZGET(FILENAME))
@EXEC(XLS=RTM\Kinney_AdResultSummary.xls);
@wizClr(OUTPUT);

@WIZRPL(TITLE=SaveFile);
@WIZRPL(FORM=SaveFile);
@WIZRPL(width=1)
@WIZRPL(height=1)
@EXEC(HTT=script\SKU_BAT_KDLOC_save_xls);