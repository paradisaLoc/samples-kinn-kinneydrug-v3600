IF ((SELECT OBJECT_ID('dbo.KDLOC_VALIDATE_AGE')) IS NOT NULL)
	DROP FUNCTION [dbo].KDLOC_VALIDATE_AGE;
GO

CREATE FUNCTION dbo.KDLOC_VALIDATE_AGE(@Birthdate DATETIME, @RequiredAge INT)
RETURNS INT
AS
BEGIN
    DECLARE @Today DATETIME = GETDATE();
    DECLARE @Age INT;
    
    IF @Birthdate > @Today
        RETURN 0;

    SELECT @Age = DATEDIFF(year, @Birthdate, @Today) - CASE 
        WHEN  (DATEPART(month, @Birthdate) * 100 + DATEPART(day, @Birthdate) > DATEPART(month, @Today) * 100 + DATEPART(day, @Today)) THEN 1 
        ELSE 0
        END;

    IF @Age < @RequiredAge
        RETURN 0;

    RETURN 1;
END