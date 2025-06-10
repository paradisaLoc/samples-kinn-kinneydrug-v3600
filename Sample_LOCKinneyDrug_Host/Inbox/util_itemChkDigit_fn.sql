@FMT(CMP,@DBSELECT(SELECT OBJECT_ID('dbo.util_itemChkDigit_fn'))=,,'®DBEXEC(DROP FUNCTION dbo.util_itemChkDigit_fn)');

CREATE function dbo.util_itemChkDigit_fn(@Upc varchar(14))
returns varchar(13)
BEGIN
DECLARE 
 @i1 INTEGER,
 @Chk INTEGER
SET @UPC=RIGHT('000000000000000'+@UPC,12)
SET @Chk=0
SET @i1=1
WHILE @i1<=LEN(@UPC)
	BEGIN
		IF (@i1 % 2 = 0) 
		 SET @Chk=@Chk+CAST(SUBSTRING(@UPC,@i1,1) AS INTEGER)*3 
		ELSE
		 SET @Chk=@Chk+CAST(SUBSTRING(@UPC,@i1,1) AS INTEGER)*1 
		SET @i1=@i1+1
	END 
RETURN CASE WHEN LEFT(@UPC,1)='0' THEN RIGHT(@UPC,11) ELSE @UPC END+CAST(CEILING((@Chk+0.0)/10)*10-@Chk AS CHAR(1))
END;
