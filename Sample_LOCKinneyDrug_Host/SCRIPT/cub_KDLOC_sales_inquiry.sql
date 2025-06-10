/* 10.Sales inquiry report */
/* 30.Custom */

@wizset(TITLE=Sales inquiry Report);
@wizset(HEIGHT=800);
@wizset(WIDTH=400);

@dbHot(REG,SET,USER@USER/CUBE/cub_KDLOC_sales_inquiry*);

@FMT(CMP,@dbHot(REG,USER@USER/Cube/cub_KDLOC_sales_inquiry/STOP)=,'®dbHot(REGSET,USER@USER/Cube/cub_KDLOC_sales_inquiry/STOP,,®DATE(@DSDD,DSMF))')
@FMT(CMP,@dbHot(REG,USER@USER/Cube/cub_KDLOC_sales_inquiry/START)=,'®dbHot(REGSET,USER@USER/Cube/cub_KDLOC_sales_inquiry/START,,®DATE(@dbHot(REG,USER@USER/Cube/cub_KDLOC_sales_inquiry/STOP),DSMD))')
@FMT(CMP,@TOOLS(PopupDefault,F1000_RPT,FIRST,@dbHot(REG,USER@USER/Cube/cub_KDLOC_sales_inquiry/TARGET))<>@dbHot(REG,USER@USER/Cube/cub_KDLOC_sales_inquiry/TARGET),'®dbHot(REGSET,USER@USER/Cube/cub_KDLOC_sales_inquiry/TARGET,,®TOOLS(PopupDefault,F1000_RPT,FIRST,RAL))')
@FMT(CMP,@dbHot(REG,USER@USER/Cube/cub_KDLOC_sales_inquiry/DEPT)=,'®dbHot(REGSET,USER@USER/Cube/cub_KDLOC_sales_inquiry/DEPT,,DEPT1)')
@FMT(CMP,@dbHot(REG,USER@USER/Cube/cub_KDLOC_sales_inquiry/SALETYPE)=,'®dbHot(REGSET,USER@USER/Cube/cub_KDLOC_sales_inquiry/SALETYPE,,REG)')

@FMT(CMP,@wizget(SILENTMODE)=1,'®EXEC(CGI=Script\cub_KDLOC_sales_inquiry)®FMT(CHR,27)');

@WIZSET(Form=NEWFORM);
@EXEC(@FMT(CMP,@WIZGET(OUTPUT)=,HTT,CGI)=Script\cub_KDLOC_sales_inquiry);

