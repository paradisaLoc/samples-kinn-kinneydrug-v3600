SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF ((SELECT OBJECT_ID('dbo.usp_PayCharge')) IS NOT NULL)
	DROP PROCEDURE [dbo].[usp_PayCharge]
GO

CREATE PROCEDURE [dbo].[usp_PayCharge]
	@Xch varchar(20), -- Exchange type
	@PayStoreID varchar(5), -- Store or Merchant ID
	@PayTermID varchar(5), -- Terminal ID
	@PayBackupServer int, -- Backup server
	@PayTrack varchar(20) OUTPUT, -- Card number (optional)
	@PayTranMode varchar(15) OUTPUT, -- NULL=Regular, V=Void, R=RefundMode, N=Negative
	@PayTranCode varchar(4) OUTPUT, -- 0=Redemption, 0P=PartialApproval, 1=Pre-Auth, 6=Balance, 200=Increase, 201=Activation
	@PayPartial varchar(4) OUTPUT, -- 1=Partial
	@CardType varchar(5) OUTPUT, -- T=Giftcard, L=Private card
	@PaySubType varchar(5) OUTPUT, -- Subtype not used
	@PayAmnt money OUTPUT, -- Value of request
	@PayGenericIPTaxTL money OUTPUT, -- Total tax
	@PayGenericIPOver int OUTPUT,		-- force create
	@PayBalance money OUTPUT, -- Balance after operationValue of request
	@PayInvoice varchar(30) OUTPUT, -- Transaction number
	@PayDate datetime OUTPUT, -- Transaction date
	@PayTime varchar(6) OUTPUT, -- Transaction time
	@PayInvLine int OUTPUT, -- Line# in trs
	@AuthID bigint OUTPUT, -- Auth ID HASH (F1079)
	@PayXml varchar(max) OUTPUT, -- Xml data
	@PayRCode varchar(2) OUTPUT, -- Reponse Code
	@PayDisplay varchar(200) OUTPUT,
	@CustName varchar(50) OUTPUT
AS
BEGIN

----- OFFLINE -----

IF dbo.sms_GetVariableInt('PayBackupServer')>ISNULL(@PayBackupServer,0)
BEGIN
	SET @PayRCode = 'NR'
	SET @PayDisplay = 'SERVER OFFLINE'
	RETURN
END

BEGIN TRY

DECLARE @AValue money
DECLARE @AValue2 money
DECLARE @AValue3 int
DECLARE @AString varchar(100)
DECLARE @TrsAmnt money
DECLARE @TlzBalance int
DECLARE @TlzTrans int

IF @PayTrack IS NULL SET @PayTrack = ''
IF @PayTranCode IS NULL SET @PayTranCode = '0'
IF @PayInvLine IS NULL SET @PayInvLine = '0'
IF @PayDate IS NULL SET @PayDate = GetDate()
IF @PayTime IS NULL SET @PayTime = '000000'

SET @PayRCode = '00'
SET @TlzBalance = 7501
SET @CustName = 'CustName'

SET @TlzTrans = CASE
	WHEN @PayTranCode='0' THEN 1206 -- sale
	WHEN @PayTranCode='1' THEN 1206 -- pre-auth
	WHEN @PayTranCode='2' THEN 1206 -- completion
	WHEN @PayTranCode='104' THEN 201 -- card payment
	ELSE 0 END

-- Validate TranCode
IF (@PayTranCode <> '0' AND
   @PayTranCode <> '6' AND
   @PayTranCode <> '1' AND
   @PayTranCode <> '2' AND
   @PayTranCode <> '104')
	SET @PayRCode = 'IT'

----- REFUND -------

SET @TrsAmnt = @PayAmnt
IF (PATINDEX('%N%',@PayTranMode) <> 0)
	SET @TrsAmnt = -@TrsAmnt
IF (PATINDEX('%R%',@PayTranMode) <> 0)
	BEGIN
		IF (@PayTranCode = '1')
			SET @PayTranCode = 103
		ELSE
			SET @TrsAmnt = -@TrsAmnt
	END

---- XML DATA TENDERS -------

IF @PayXml IS NOT NULL 
BEGIN
	DECLARE @xmlDoc XML;
	SET @xmlDoc=@PayXml 
	INSERT INTO KINNEY_AR_TRS (F254,F1056,F1057,F1148,F1032,F1034,F1101,F64,F65,F67,F253,F1036,F1079,F1100,F1765) SELECT
		@PayDate AS F254,
		@PayStoreID AS F1056,
		@PayTermID AS F1057,
		@PayTrack AS F1148,
		@PayInvoice AS F1032,
		xmlData.a.value('(F1034)[1]','INT') AS F1034,
		xmlData.a.value('(F1101)[1]','INT') AS F1101,
		xmlData.a.value('(F64)[1]','FLOAT') AS F64,
		xmlData.a.value('(F65)[1]','MONEY') AS F65,
		0 AS F67,
		GETDATE() AS F253,
		@PayTime AS F1036,
		xmlData.a.value('(F1079)[1]','VARCHAR(50)') AS F1079,
		ISNULL(xmlData.a.value('(F1100)[1]','INT'),0) AS F1100,
		xmlData.a.value('(F1765)[1]','INT') AS F1765
	FROM @xmlDoc.nodes('/tenders/line') xmlData(a)
END

---- SEND EOT -------

IF @Xch='PAYSENDEOT'
BEGIN
	SET @PayRCode = '00'
	SET @PayDisplay = 'Transaction stored'
	RETURN
END

----- BALANCE INQUIRY -----

IF (@PayTranCode = '6' AND @PayRCode = '00')
	BEGIN
		SELECT @PayBalance=F65,@CustName=F1155 FROM KINNEY_AR_ACC WHERE F1148 = @PayTrack AND F1034 = @TlzBalance
		IF @PayBalance IS NULL SET @PayRCode = 'UA'
	END
ELSE

----- TOR -----

IF (PATINDEX('%C%',@PayTranMode) <> 0 AND @PayRCode = '00')
	BEGIN
		IF (@PayTrack = '')
			SET @PayTrack = (SELECT F1148 FROM KINNEY_AR_TRS WHERE F254 = @PayDate AND F1034 = @TlzTrans AND
				F1056 = @PayStoreID AND F1057 = @PayTermID AND F1032 = @PayInvoice AND F1101 = @PayInvLine)
		ELSE
			SET @TrsAmnt = (SELECT F65 FROM KINNEY_AR_TRS WHERE F254 = @PayDate AND F1034 = @TlzTrans AND F1148 = @PayTrack AND
				F1056 = @PayStoreID AND F1057 = @PayTermID AND F1032 = @PayInvoice AND F1101 = @PayInvLine)

		IF (@TrsAmnt IS NOT NULL AND @PayTrack <> '')
			BEGIN
				IF (@PayTranCode = '200' OR @PayTranCode = '201')
					UPDATE KINNEY_AR_ACC SET @PayBalance = F65 = F65 + @TrsAmnt,F253=GetDate() WHERE F1148 = @PayTrack and F1034 = @TlzBalance
				ELSE
					UPDATE KINNEY_AR_ACC SET @PayBalance = F65 = F65 - @TrsAmnt,F253=GetDate() WHERE F1148 = @PayTrack and F1034 = @TlzBalance

				DELETE FROM KINNEY_AR_TRS WHERE F254 = @PayDate AND F1148 = @PayTrack AND F1034 = @TlzTrans AND
					F1056 = @PayStoreID AND F1057 = @PayTermID AND F1032 = @PayInvoice AND F1101 = @PayInvLine
			END

		SET @PayRCode = '00'
		SET @PayDisplay = 'Transaction reversed'
	END
ELSE

----- VOID -----

IF (PATINDEX('%V%',@PayTranMode) <> 0 AND @PayRCode = '00')
	BEGIN
		SET @AValue = (SELECT F65 FROM KINNEY_AR_TRS WHERE F1148 = @PayTrack AND F1034 = @TlzTrans AND
			F1079 = @AuthID AND F1056 = @PayStoreID AND F1057 = @PayTermID AND F1032 = @PayInvoice AND F1101 = @PayInvLine)

		IF (@AValue = @TrsAmnt)
			BEGIN
	--			IF (@PayTranCode = '200' OR @PayTranCode = '201')
					UPDATE KINNEY_AR_ACC SET @PayBalance = F65 = F65 + @TrsAmnt,F253=GetDate() WHERE F1148 = @PayTrack and F1034 = @TlzBalance
	--			ELSE
	--				UPDATE KINNEY_AR_ACC SET @PayBalance = F65 = F65 - @TrsAmnt,F253=GetDate() WHERE F1148 = @PayTrack and F1034 = @TlzBalance

				UPDATE KINNEY_AR_TRS SET F65 = 0 WHERE F1148 = @PayTrack AND F1034 = @TlzTrans AND
					F1079 = @AuthID AND F1056 = @PayStoreID AND F1057 = @PayTermID AND F1032 = @PayInvoice AND F1101 = @PayInvLine
			END
		ELSE
			BEGIN
				SET @PayRCode = 'NF'
				SET @PayDisplay = 'Transaction not found'
			END
	END
ELSE

----- PAYMENT ------

IF (@PayTranCode = '104' AND @PayRCode = '00')
	BEGIN

 -- Refund mode
	IF (PATINDEX('%R%',@PayTranMode) <> 0)
		BEGIN
			SET @AValue = (SELECT ISNULL(SUM(F65),0) FROM KINNEY_AR_TRS WHERE F1148 = @PayTrack AND F1034 = @TlzTrans AND F1079 = @AuthID AND F1056 = @PayStoreID)
			IF (@AValue <> -@TrsAmnt)
				BEGIN
					SET @PayRCode = 'NF'
					SET @PayDisplay = 'Transaction not found'
				END
		END

	IF @PayRCode = '00'
		BEGIN
			SELECT TOP 1 @AValue=F65,@AValue3=F1153,@CustName=F1155 FROM KINNEY_AR_ACC WHERE F1148 = @PayTrack AND F1034 = @TlzBalance

			-- Validate account class
			IF @AValue3=6
				BEGIN
					SET @PayRCode = 'IT'
					SET @PayDisplay = 'Account class '+CAST(@AValue3 as VARCHAR)
				END
			ELSE 
			IF @AValue IS NULL
				SET @PayRCode = 'UA'
			ELSE
				BEGIN
					UPDATE KINNEY_AR_ACC SET @PayBalance = F65 = F65 - @TrsAmnt,F253=GetDate() WHERE F1148 = @PayTrack and F1034 = @TlzBalance
				END
		END

	IF @PayRCode = '00'
		BEGIN
			IF (@AuthID = '' OR @AuthID is null)
				SET @AuthID = CAST(BINARY_CHECKSUM(@PayTrack,@PayStoreID,@PayTermID,@PayDate,@PayInvoice,@PayInvLine) + 2147483648 AS CHAR)

			INSERT INTO KINNEY_AR_TRS (F254,F1056,F1057,F1148,F1032,F1034,F1101,F64,F65,F67,F253,F1036,F1079,F1100,F1765) SELECT
				@PayDate AS F254,
				@PayStoreID AS F1056,
				@PayTermID AS F1057,
				@PayTrack AS F1148,
				@PayInvoice AS F1032,
				@TlzTrans AS F1034,
				@PayInvLine AS F1101,
				1 AS F64,
				@TrsAmnt AS F65,
				0 AS F67,
				GETDATE() AS F253,
				@PayTime AS F1036,
				@AuthID AS F1079,
				0 AS F1100,
				NULL AS F1765
		END
	END
ELSE

------ CHARGE ------------

IF (@PayTranCode = '0' AND @PayRCode = '00')
	BEGIN

 -- Refund mode
	IF (PATINDEX('%R%',@PayTranMode) <> 0)
		BEGIN
			SET @AValue = (SELECT ISNULL(SUM(F65),0) FROM KINNEY_AR_TRS WHERE F1148 = @PayTrack AND F1034 = @TlzTrans AND F1079 = @AuthID AND F1056 = @PayStoreID)
			IF (@AValue <> -@TrsAmnt)
				BEGIN
					SET @PayRCode = 'NF'
					SET @PayDisplay = 'Transaction not found'
				END
		END

	IF @PayRCode = '00'
		BEGIN
			-- Get balance
			SELECT TOP 1 @AValue=F65,@AValue2=F1165,@AString=ISNULL(F1160,''),@AValue3=F1153,@CustName=F1155 FROM KINNEY_AR_ACC WHERE F1148 = @PayTrack AND F1034 = @TlzBalance

			-- Validate account class
			IF (@AValue3=3 OR @AValue3=6)
				BEGIN
					SET @PayRCode = 'IT'
					SET @PayDisplay = 'Account class '+CAST(@AValue3 as VARCHAR)
				END
			ELSE
			IF (@AValue IS NULL)
				BEGIN
					IF @PayGenericIPOver=1
						INSERT INTO KINNEY_AR_ACC (F1148,F1034,F64,F65,F67,F253) VALUES (@PayTrack,@TlzBalance,0,0,0,GetDate())
					ELSE
						SET @PayRCode = 'UA'
				END
			ELSE
				BEGIN
					IF NOT (@AString='')
						BEGIN
							SET @TrsAmnt=@TrsAmnt-@PayGenericIPTaxTL
							SET @PayAmnt = abs(@TrsAmnt)
						END

					IF (@AValue2 IS NOT NULL) AND (@AValue+@TrsAmnt>@AValue2) AND (isnull(@PayGenericIPOver,0)=0)
						BEGIN
							IF (@PayPartial = '1') AND (@AValue<@AValue2)
								BEGIN
									SET @TrsAmnt=@AValue2-@AValue
									SET @PayAmnt = abs(@TrsAmnt)
								END
							ELSE
								BEGIN
									SET @PayRCode = 'OL'
									SET @PayBalance = @AValue
								END
						END
				END
		END

	IF @PayRCode = '00'
		BEGIN
			UPDATE KINNEY_AR_ACC SET @PayBalance = F65 = F65 + @TrsAmnt,F253=GetDate() WHERE F1148 = @PayTrack and F1034 = @TlzBalance

			IF (@AuthID = '' OR @AuthID is null)
				SET @AuthID = CAST(BINARY_CHECKSUM(@PayTrack,@PayStoreID,@PayTermID,@PayDate,@PayInvoice,@PayInvLine) + 2147483648 AS CHAR)

			INSERT INTO KINNEY_AR_TRS (F254,F1056,F1057,F1148,F1032,F1034,F1101,F64,F65,F67,F253,F1036,F1079,F1100,F1765) SELECT
				@PayDate AS F254,
				@PayStoreID AS F1056,
				@PayTermID AS F1057,
				@PayTrack AS F1148,
				@PayInvoice AS F1032,
				@TlzTrans AS F1034,
				@PayInvLine AS F1101,
				1 AS F64,
				@TrsAmnt AS F65,
				0 AS F67,
				GETDATE() AS F253,
				@PayTime AS F1036,
				@AuthID AS F1079,
				0 AS F1100,
				NULL AS F1765
		END
	END
ELSE

------ PRE-AUTH ------------

IF (@PayTranCode = '1' AND @PayRCode = '00')
	BEGIN
	-- Get balance
	SELECT TOP 1 @AValue=F65,@AValue2=F1165 FROM KINNEY_AR_ACC WHERE F1148 = @PayTrack AND F1034 = @TlzBalance

	IF @AValue IS NULL
		SET @PayRCode='UA'
	ELSE

	IF @AValue = 0
		SET @PayRCode='ZB'
	ELSE

	IF (@AValue2 IS NOT NULL) AND (@AValue+@TrsAmnt>@AValue2) AND (isnull(@PayGenericIPOver,0)=0)
		BEGIN
			IF (@PayPartial = '1') AND (@AValue<@AValue2)
				BEGIN
					SET @TrsAmnt=@AValue2-@AValue
					SET @PayAmnt = Abs(@TrsAmnt)
				END
			ELSE
				BEGIN
					SET @PayBalance=-@AValue
					SET @PayRCode = 'OL'
				END
		END

	IF @PayRCode='00'
		BEGIN
			UPDATE KINNEY_AR_ACC SET @PayBalance=F65=F65+@TrsAmnt,F253=GetDate() WHERE F1148=@PayTrack and F1034=@TlzBalance

			IF (@AuthID='' OR @AuthID is null)
				SET @AuthID=CAST(BINARY_CHECKSUM(@PayTrack,@PayStoreID,@PayTermID,@PayDate,@PayTime,@PayInvoice,@PayInvLine)+2147483648 AS CHAR)

			INSERT INTO KINNEY_AR_TRS (F254,F1056,F1057,F1148,F1032,F1034,F1101,F64,F65,F67,F253,F1036,F1079,F1100,F1765) SELECT
				@PayDate AS F254,
				@PayStoreID AS F1056,
				@PayTermID AS F1057,
				@PayTrack AS F1148,
				0 AS F1032,
				@TlzTrans AS F1034,
				0 AS F1101,
				1 AS F64,
				@TrsAmnt AS F65,
				0 AS F67,
				GETDATE() AS F253,
				@PayTime AS F1036,
				@AuthID AS F1079,
				0 AS F1100,
				0 AS F1765
		END
	END
ELSE

------ COMPLETION ------------

IF (@PayTranCode = '2' AND @PayRCode = '00')
	BEGIN

		-- Find transaction
		SET @AValue = (SELECT F65 FROM KINNEY_AR_TRS WHERE F1148=@PayTrack AND F1034=@TlzTrans AND F1079=@AuthID AND F1765=0)

		IF @AValue IS NULL
			SET @PayRCode = 'PN'
		ELSE

		-- Not enough pre-auth
		IF @AValue<@TrsAmnt
			BEGIN
				SET @AValue2=(SELECT F65 FROM KINNEY_AR_ACC WHERE F1148 = @PayTrack AND F1034 = @TlzBalance)

				IF @AValue2-@AValue+@TrsAmnt>0
					BEGIN
						SET @PayBalance = -@AValue2+@AValue
						SET @PayRCode = 'OL'
					END
				ELSE
					BEGIN
						UPDATE KINNEY_AR_ACC SET @PayBalance=F65=F65-@AValue+@TrsAmnt,F253=GetDate() WHERE F1148=@PayTrack and F1034=@TlzBalance
						UPDATE KINNEY_AR_TRS SET F65=@TrsAmnt,F1032=@PayInvoice,F1101=@PayInvLine,F1765=null WHERE F1148=@PayTrack AND F1034=@TlzTrans AND F1079=@AuthID AND F1765=0
					END
			END
		ELSE
			BEGIN
				UPDATE KINNEY_AR_ACC SET @PayBalance=F65=F65-@AValue+@TrsAmnt,F253=GetDate() WHERE F1148=@PayTrack and F1034=@TlzBalance
				UPDATE KINNEY_AR_TRS SET F65=@TrsAmnt,F1032=@PayInvoice,F1101=@PayInvLine,F1765=null WHERE F1148=@PayTrack AND F1034=@TlzTrans AND F1079=@AuthID AND F1765=0
			END

	END
ELSE

------ PRE-AUTH CANCEL ------------

IF (@PayTranCode = '103' AND @PayRCode = '00')
	BEGIN
		-- Find pre-auth
		SET @AValue=(SELECT F65 FROM KINNEY_AR_TRS WHERE F1148=@PayTrack AND F1034=@TlzTrans AND F1765=0)
		IF @AValue IS NULL
			SET @PayRCode='UA'
		ELSE
			BEGIN
				-- Reverse transaction
				UPDATE KINNEY_AR_ACC SET @PayBalance=F65=F65-@AValue,F253=GetDate() WHERE F1148=@PayTrack and F1034=@TlzBalance
				DELETE FROM KINNEY_AR_TRS WHERE F1148=@PayTrack AND F1034=@TlzTrans AND F1765=0
			END
	END

IF (@PayDisplay IS NULL)
	BEGIN
		IF @PayRCode = '00' SET @PayDisplay = 'Success'
		IF @PayRCode = 'DP' SET @PayDisplay = 'Duplicate'
		IF @PayRCode = 'OL' SET @PayDisplay = 'OverLimit'
		IF @PayRCode = 'UA' SET @PayDisplay = 'Unkown Account'
		IF @PayRCode = 'ZB' SET @PayDisplay = 'Zero balance'
		IF @PayRCode = 'IP' SET @PayDisplay = 'Invalid Program'
		IF @PayRCode = 'IT' SET @PayDisplay = 'Invalid TranCode'
		IF @PayRCode = 'PE' SET @PayDisplay = 'ProcessingError'
		IF @PayRCode = 'PN' SET @PayDisplay = 'Pre-auth not found'
	END

END TRY

BEGIN CATCH
	SET @PayRCode = 'PE'	-- Set response code to "Processing Error"
	SET @PayDisplay = ERROR_MESSAGE()
END CATCH

END
GO

------- CANCEL PRE_AUTH ----------------------------------

IF ((SELECT OBJECT_ID('dbo.usp_PayGiftCancelPreAuth')) IS NOT NULL)
	DROP PROCEDURE [dbo].[usp_PayGiftCancelPreAuth]
GO

CREATE PROCEDURE [dbo].[usp_PayGiftCancelPreAuth]
 -- Variable list
	@CancelDate dateTime OUTPUT,	 -- Cancel older then
	@PayRCode varchar(2) OUTPUT,	-- Reponse Code
	@PayDisplay varchar(200) OUTPUT
AS

BEGIN
	DECLARE @PayStoreID varchar(5)
	DECLARE @PayTermID varchar(5)
	DECLARE @PayTrack varchar(20)
	DECLARE @PayAmnt money
	DECLARE @PayInvoice varchar(30)
	DECLARE @PayDate datetime
	DECLARE @PayInvLine int
	DECLARE @TrsTlz int
	DECLARE @TrsAmt money
	DECLARE @TrsCount int
	SET @TrsCount = 0

	BEGIN TRY

	Select TOP 1 @PayTrack = F1148, @PayDate = F254, @PayStoreID = F1056,
		@PayTermID=F1057, @PayInvoice=F1032, @PayInvLine=F1101, @TrsTlz=F1034,
		@TrsAmt=F65 From KINNEY_AR_TRS WHERE F1765=0 AND F253<@CancelDate

	WHILE (@@ROWCOUNT <> 0 and @PayTrack IS NOT NULL)
		BEGIN
			BEGIN TRAN T1
			SET @TrsCount = @TrsCount + 1

			UPDATE KINNEY_AR_ACC SET F65=F65-@TrsAmt WHERE F1148=@PayTrack AND F1034=7541

			DELETE FROM KINNEY_AR_TRS WHERE F1148=@PayTrack AND F254=@PayDate AND F1034=@TrsTlz AND
				F1056=@PayStoreID AND F1057=@PayTermID AND F1032=@PayInvoice AND F1101=@PayInvLine

			COMMIT TRAN T1

			SELECT TOP 1 @PayTrack = F1148, @PayDate = F254, @PayStoreID = F1056,
				@PayTermID=F1057, @PayInvoice=F1032, @PayInvLine=F1101, @TrsTlz=F1034,
				@TrsAmt=F65 From KINNEY_AR_TRS WHERE F1765=0 AND F253<@CancelDate
		END

	SET @PayRCode = '00'
	SET @PayDisplay = 'Row Affected '+CAST(@TrsCount as VARCHAR)

	END TRY

	BEGIN CATCH
		SET @PayRCode = 'PE'	-- Set response code to "Processing Error"
		SET @PayDisplay = ERROR_MESSAGE()
	END CATCH

END
GO

------- CANCEL PRE_AUTH FOR CHARGE ----------------------------------

IF ((SELECT OBJECT_ID('dbo.usp_PayChargeCancelPreAuth')) IS NOT NULL)
	DROP PROCEDURE [dbo].[usp_PayChargeCancelPreAuth]
GO

CREATE PROCEDURE [dbo].[usp_PayChargeCancelPreAuth]
-- Variable list
	@CancelDate dateTime OUTPUT,	-- Cancel older then
	@PayRCode varchar(2) OUTPUT,	-- Reponse Code
	@PayLanguage varchar(2) OUTPUT, -- Message language
	@PayDisplay varchar(200) OUTPUT	-- Response message
AS

BEGIN
	SET @PayRCode = '00'
END
GO
