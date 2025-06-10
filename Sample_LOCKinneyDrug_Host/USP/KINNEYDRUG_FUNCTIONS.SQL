/* Search segment from string function */
IF ((SELECT OBJECT_ID('Kinney_SegmentFromString')) IS NOT NULL) 
DROP function Kinney_SegmentFromString
GO

CREATE FUNCTION dbo.Kinney_SegmentFromString(@String VARCHAR(5000),@Seg INT,@Sep VARCHAR(4))
RETURNS VARCHAR(5000)
AS
BEGIN
  -- ADD A LAST SEPARATOR TO THE INITIAL STRING
  SET @String=@String+@Sep
  -- DECLARE TEMP TABLE
  DECLARE @isep INT=1             -- POSITION OF SEPARATOR
  DECLARE @nseg INT=1             -- Segment Number
  DECLARE @lsep INT=LEN(@Sep)     -- Separator lenght
  DECLARE @vposalue VARCHAR(1000)='' -- Return value
  -- Loop to find proper segment
  WHILE @isep <LEN(@String)
  BEGIN       
    IF(@nseg=@Seg) -- When proper segment found, extract value
     BEGIN
       SET @vposalue = (SELECT SUBSTRING(@String,@isep,CHARINDEX(@Sep,@String,@isep)-@isep))
     END
    -- Next
    SET @isep = (SELECT CHARINDEX(@Sep,@String,@isep)+@lsep)
    SET @nseg = @nseg+1
  END
  RETURN isnull(@vposalue,'')
END
GO

/* Seach parameter by name from string function */
IF ((SELECT OBJECT_ID('Kinney_ParamByName')) IS NOT NULL) 
 DROP function Kinney_ParamByName
GO

CREATE FUNCTION [dbo].[Kinney_ParamByName](@String VARCHAR(5000),@vposar VARCHAR(60))
RETURNS VARCHAR(5000)
AS
BEGIN
  SET @String = @String + ','
  -- DECLARE VARIABLES
  DECLARE @npos INT = (CHARINDEX(@vposar,@String)) -- Position of begining of Name
  DECLARE @vpos INT                                -- Position of begining of Variable
  DECLARE @value VARCHAR(5000) = ''          -- Return value
  IF(@npos>0) -- If Name is found, find parameter
   BEGIN
    SET @vpos = @npos + LEN(@vposar) + 1
    SET @value = (SUBSTRING(@String,@vpos,CHARINDEX(',',@String,@vpos)-@vpos))
   END
  RETURN @value
END
GO