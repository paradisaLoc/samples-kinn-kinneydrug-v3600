/* PRICE CALCULATION */

IF ((SELECT OBJECT_ID('mFloor_itm_activeLevel')) IS NOT NULL)
DROP FUNCTION mFloor_itm_activeLevel
go

CREATE FUNCTION dbo.mFloor_itm_activeLevel (
	@F01 VARCHAR(20), /* Key number */
	@F126 INTEGER=NULL, /* force level */
	@F1163 INTEGER=NULL, /* price level */
	@F1711 INTEGER=NULL, /* fall back level */
	@F1811 INTEGER=NULL) /* base level */
RETURNS INTEGER
AS
BEGIN
	IF @F126=0 SET @F126=NULL -- Contract price
	IF @F126 IS NOT NULL RETURN @F126
	IF @F1711 IS NULL and @F1811 IS NULL and @F1163=1 RETURN @F1163

	DECLARE @F01N VARCHAR(20)

	-- Price level
	IF @F01N IS NULL AND @F1163 IS NOT NULL
	BEGIN
		SELECT @F01N=F01 FROM PRICE_TAB WHERE F01=@F01 AND F126=@F1163
		IF @F01N IS NOT NULL RETURN @F1163
	END

	-- Fall back level
	IF @F01N IS NULL AND @F1711 IS NOT NULL
	BEGIN
		SELECT @F01N=F01 FROM PRICE_TAB WHERE F01=@F01 AND F126=@F1711
		IF @F01N IS NOT NULL RETURN @F1711
	END

	-- Base level
	IF @F1811 IS NULL SET @F1811=1
	RETURN @F1811
END
go

/* PRODUCT GENERAL */

IF ((SELECT OBJECT_ID('mFloor_itm_searchGeneral')) IS NOT NULL) 
DROP PROCEDURE mFloor_itm_searchGeneral;
go

CREATE PROCEDURE dbo.mFloor_itm_searchGeneral (
@ExtMaxRecords INT=NULL,
@CurUser INT=NULL,
@D253 DATETIME=NULL,		/* start timestamp */
@E253 DATETIME=NULL,		/* Stop timestamp */
@F01 VARCHAR(40)=NULL, 		/* UPC Code */
@F01L VARCHAR(1000)=NULL, 	/* UPC list */
@F02 VARCHAR(40)=NULL, 		/* POS Description */
@F03 INTEGER=NULL,			/* dept */
@F04 INTEGER=NULL,			/* sub-dept */
@F16 INTEGER=NULL,			/* Familiy */
@F17 INTEGER=NULL,			/* Category */
@F18 INTEGER=NULL,			/* Report code */
@F155 VARCHAR(40)=NULL, 	/* Brand Description */
@F113 VARCHAR(40)=NULL, 	/* promo Event */
@F116 VARCHAR(40)=NULL, 	/* aisle */
@F117 VARCHAR(40)=NULL, 	/* shelf */
@F126 INTEGER=NULL)			/* Price level */
AS
BEGIN
	DECLARE @F1148 VARCHAR(20)
	DECLARE @F1152 INTEGER
	DECLARE @F1163 INTEGER
	DECLARE @F1711 INTEGER
	DECLARE @F1811 INTEGER
	DECLARE @sql NVARCHAR(max)
	DECLARE	@prm NVARCHAR(max)

	IF @ExtMaxRecords IS NULL SET @ExtMaxRecords=25

	SELECT @F1148 = F1148
		FROM CLK_TAB
		WHERE F1185=@CurUser

	SELECT @F1152 = F1152
		FROM CLT_TAB
		WHERE F1148=@F1148
	IF (@F1152 IS NULL) SET @F1152=1

	SELECT @F1163=F1163,@F1711=F1711,@F1811=F1811
		FROM CLF_TAB
		WHERE F1152=@F1152
	IF (@F1163 IS NULL) SET @F1163=1
	IF (@F1811 IS NULL) SET @F1811=1
	IF(@F113 = '1') SET @F113 = 'REG'

	SET @Sql =
	'SELECT TOP (' + CONVERT(nvarchar,@ExtMaxRecords) + ')
	OBJ.F155,				/* Brand */
	OBJ.F22,				/* Size */
	POS.F01, 				/* Code */
	POS.F02, 				/* Description */
	PRI.F126,				/* price level */
	PRI.F1007, 				/* price */
	PRI.F1006 				/* price/qty */
	FROM OBJ_TAB OBJ
	JOIN POS_TAB POS ON POS.F01=OBJ.F01
	JOIN PRICE_TAB PRI ON
			PRI.F01=OBJ.F01 AND
			PRI.F126=dbo.mFloor_itm_activeLevel(OBJ.F01,@F126,@F1163,@F1711,@F1811) AND 
			(@F113 IS NULL OR @F113 <> PRI.F113) -- price source (expected value REG)
	JOIN SDP_TAB SDP ON SDP.F04=POS.F04
	WHERE '
	IF @F01 IS NOT NULL
		SELECT @Sql = @Sql + 'OBJ.F01 = @F01 AND /* UPC code */ '
	IF @F02 IS NOT NULL
		SELECT @Sql = @Sql + 'ISNULL(POS.F02,'''') LIKE ''%''+@F02+''%'' AND /* POS Descr */ '
	IF @F03 IS NOT NULL
		SELECT @Sql = @Sql + 'ISNULL(SDP.F03,0) = @F03 AND /* dept */ '
	IF @F04 IS NOT NULL
		SELECT @Sql = @Sql + 'ISNULL(POS.F04,0) = @F04 AND /* sub-dept */ '
	IF @F16 IS NOT NULL
		SELECT @Sql = @Sql + 'ISNULL(OBJ.F16,0) = @F16 AND /* Family code */ '
	IF @F17 IS NOT NULL
		SELECT @Sql = @Sql + 'ISNULL(OBJ.F17,0) = @F17 AND /* Category */ '
	IF @F18 IS NOT NULL
		SELECT @Sql = @Sql + 'ISNULL(OBJ.F18,0) = @F18 AND /* Report code */ '
	IF @F155 IS NOT NULL
		SELECT @Sql = @Sql + 'ISNULL(OBJ.F155,'''') LIKE ''%''+@F155+''%'' AND /* Brand Descr */ '
	IF @F116 IS NOT NULL
		SELECT @Sql = @Sql + 'POS.F01 IN (SELECT F01 FROM LOC_TAB WHERE F116 LIKE @F116) AND /* aisle */ '

	SELECT @Sql = @Sql + '
	ISNULL(POS.F88,''0'')<>''1'' AND  /* store cpn */
	ISNULL(POS.F104,''0'')<>''1'' AND /* vendor cpn */
	ISNULL(POS.F86,''0'')<>''1'' /* not for sale */
	ORDER BY POS.F02 '

	SET @prm = '
			@F01 VARCHAR(40), -- UPC Code
			@F02 VARCHAR(40), -- POS Description
			@F03 INTEGER, -- dept
			@F04 INTEGER, -- sub-dept
			@F16 INTEGER, -- Familiy
			@F17 INTEGER, -- Category
			@F18 INTEGER, -- Report code
			@F155 VARCHAR(40), -- Brand Description
			@F113 VARCHAR(40), -- promo Event
			@F116 VARCHAR(40), -- aisle
			@F1163 INTEGER,
			@F1711 INTEGER,
			@F1811 INTEGER,
			@F126 INTEGER,
			@ExtMaxRecords INT'

		Exec sp_executesql @sql, @prm,
			@F01, -- UPC Code
			@F02, -- POS Description
			@F03, -- dept
			@F04, -- sub-dept
			@F16, -- Familiy
			@F17, -- Category
			@F18, -- Report code
			@F155, -- Brand Description
			@F113, -- promo Event
			@F116, -- aisle
			@F1163,
			@F1711,
			@F1811,
			@F126,
			@ExtMaxRecords

END;
go

/* VENDOR LIST BY ITEMS */

IF ((SELECT OBJECT_ID('mFloor_itm_cost_list')) IS NOT NULL)
DROP PROCEDURE mFloor_itm_cost_list
go

CREATE PROCEDURE mFloor_itm_cost_list (
	@F01 VARCHAR(40)=NULL
)
AS BEGIN
	SELECT
	COS.F01,
	COS.F27,
	COS.F19,
	COS.F38,
	VND.F334,
	COS.F90,
	COS.F1184
	FROM COST_TAB COS
	JOIN VENDOR_TAB VND ON COS.F27=VND.F27
	WHERE COS.F01=@F01
	ORDER BY F90 DESC, F27, F1184
END
go

IF ((SELECT OBJECT_ID('mFloor_itm_cost_auth')) IS NOT NULL)
DROP PROCEDURE mFloor_itm_cost_auth
go

CREATE PROCEDURE mFloor_itm_cost_auth (
	@F01 VARCHAR(40)=NULL
)
AS BEGIN
	SELECT
	COS.F01,
	COS.F27,
	COS.F19,
	COS.F38,
	VND.F334,
	COS.F90,
	COS.F1184
	FROM COST_TAB COS
	JOIN VENDOR_TAB VND ON COS.F27=VND.F27
	WHERE COS.F01=@F01 AND ISNULL(COS.F90,'1')='1'
END
go

/* SHELF LOCATION LIST BY ITEMS */

IF ((SELECT OBJECT_ID('mFloor_itm_loc_list')) IS NOT NULL)
DROP PROCEDURE mFloor_itm_loc_list
go

CREATE PROCEDURE mFloor_itm_loc_list (
	@F01 VARCHAR(40)=NULL)
AS BEGIN
	SELECT
	LOC.F01,
	LOC.F117,
	LOC.F25,
	LOC.F1030,
	LOC.F116,
	LOC.F118,
	LOC.F157
	FROM LOC_TAB LOC
	WHERE LOC.F01=@F01
	ORDER BY F157 DESC, F117, F25
END
go

/* ALTERNATE CODE LIST BY ITEMS */

IF ((SELECT OBJECT_ID('mFloor_itm_alt_list')) IS NOT NULL)
DROP PROCEDURE mFloor_itm_alt_list
go

CREATE PROCEDURE mFloor_itm_alt_list (
	@F01 VARCHAR(40)=NULL)
AS BEGIN
	SELECT
	ALT.F01,
	ALT.F154,
	ALT.F1874,
	ALT.F126,
	ALT.F1898
	FROM ALT_TAB ALT
	WHERE ALT.F01=@F01
	ORDER BY F1898 DESC, F154
END
go

/* PRICE LEVEL LIST BY ITEMS */

IF ((SELECT OBJECT_ID('mFloor_itm_price_list')) IS NOT NULL)
DROP PROCEDURE mFloor_itm_price_list
go

CREATE PROCEDURE mFloor_itm_price_list (
	@F01 VARCHAR(40)=NULL)
AS BEGIN
	SELECT 
	@F01 As F01,
	PRI.F1007,
	PRI.F1006,
	PRI.F1013,
	PRI.F1014,
	PRI.F1015,
	PRI.F1012,
	PRI.F126,
	LVL.F1017,
	PRI.F113,
	PRI.F1220,
	PRI.F1221,
	PRI.F139,
	PRI.F143,
	PRI.F1011
	FROM PRICE_TAB PRI
	JOIN LVL_TAB LVL ON PRI.F126 = LVL.F126
	WHERE PRI.F01=@F01
	ORDER BY PRI.F126
END
go

/* ITEM E_COUPON */

IF ((SELECT OBJECT_ID('mFloor_itm_ecpn')) IS NOT NULL)
DROP PROCEDURE mFloor_itm_ecpn
go

CREATE PROCEDURE mFloor_itm_ecpn (
	@F01 VARCHAR(40)=NULL)
AS BEGIN
	SELECT 
	@F01 As F01,
	*
	FROM ECL_TAB ECL
	JOIN POS_TAB POS ON POS.F01 = @F01
	
	WHERE ECL.F1033=POS.F383
END
go

