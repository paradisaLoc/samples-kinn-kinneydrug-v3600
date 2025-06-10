/* 30.Daily Department Sales */
/* 30.Custom */

@wizset(TITLE=Daily Sales - Department);
@wizset(HEIGHT=720);
@wizset(WIDTH=1020);


/* SET DEFAULT VARIABLE VALUE */
@WIZSET(DATE=@DSMF);
@WIZSET(TARGET=RAL);
@WIZSET(F03=ALL);

@WIZSET(Form=NEWFORM);
@EXEC(@FMT(CMP,@WIZGET(OUTPUT)=,HTT,CGI)=Script\cub_KDLOC_daily_dept_sales);

