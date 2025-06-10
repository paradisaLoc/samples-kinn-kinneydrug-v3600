/* 62.Store Sales Ranking Report By Dept */
/* 30.Custom */

@wizset(TITLE=Store Sales Ranking Report By Dept);
@wizset(HEIGHT=720);
@wizset(WIDTH=1020);


/* SET DEFAULT VARIABLE VALUE */
@WIZSET(DETAIL=M);
@WIZSET(DATE=@DATE(@DSDF,DS@WIZGET(DETAIL)F));
@WIZSET(TARGET=RAL);
@WIZSET(F03=ALL);

@WIZSET(Form=NEWFORM);
@EXEC(@FMT(CMP,@WIZGET(OUTPUT)=,HTT,CGI)=Script\cub_KDLOC_store_sales_ranking);

