/* 65.Script Count Report */
/* 30.Custom */

@wizset(TITLE=Daily Department Sales);
@wizset(HEIGHT=925);
@wizset(WIDTH=1020);


/* SET DEFAULT VARIABLE VALUE */
@WIZSET(DETAIL=M);
@WIZSET(DATE=@DATE(@DSDF,DS@WIZGET(DETAIL)F));
@WIZSET(TARGET=RAL);

@WIZSET(Form=NEWFORM);
@EXEC(@FMT(CMP,@WIZGET(OUTPUT)=,HTT,CGI)=Script\cub_KDLOC_daily_Rx);

