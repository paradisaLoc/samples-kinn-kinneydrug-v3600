/* FUNCTION TO RETURN 10 DIGIT TELEPHONE NUMBER */

@FMT(CMP,@DBSELECT(SELECT OBJECT_ID('dbo.fn_VerifyPhoneNumber'))=,,'®DBEXEC(DROP FUNCTION dbo.fn_VerifyPhoneNumber)');

CREATE FUNCTION dbo.fn_VerifyPhoneNumber(@PhoneNo AS varchar(1000))
RETURNS varchar(1000)
AS
BEGIN
	DECLARE @KeepValues as varchar(50)
	SET @KeepValues = '%[^0-9]%'
	WHILE PatIndex(@KeepValues, @PhoneNo) > 0
           SET @PhoneNo = Stuff(@PhoneNo, PatIndex(@KeepValues, @PhoneNo), 1, '')
	IF (LEN(@PhoneNo)!=10)
	   SET @PhoneNo = ''
	RETURN @PhoneNo
END;
