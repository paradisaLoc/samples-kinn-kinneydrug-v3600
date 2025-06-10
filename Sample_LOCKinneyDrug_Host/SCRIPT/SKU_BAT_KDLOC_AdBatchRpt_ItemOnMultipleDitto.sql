/* Ad Batch Report: Items on Multiple Ditto's */

@WIZRPL(DATECREATED=@DSDF);
@WIZRPL(TIMECREATED=@FMT(T6D,@NOW));

@wizrpl(ExtGridUsp=Kinney_ItemOnMultipleDitto_xls);
@WIZSET(FILENAME=Kinney_ItemOnMultipleDitto.xls);
@WIZRPL(OUTPUT=@OFFICEDBT\@WIZGET(FILENAME))
@EXEC(XLS=RTM\Kinney_ItemOnMultipleDitto.xls);
@wizClr(OUTPUT);

@WIZRPL(TITLE=SaveFile);
@WIZRPL(FORM=SaveFile);
@WIZRPL(width=1)
@WIZRPL(height=1)
@EXEC(HTT=script\SKU_BAT_KDLOC_save_xls);
 