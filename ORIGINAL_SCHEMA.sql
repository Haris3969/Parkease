-- ParkEaseDB_Simple - Revised Schema (SQL Server) 
-- Group Members: 23L-2642, 23L-2547, 23L-6008
-- Names: Haris Hassaan, Zuraiz Anjum, Zoraiz Rizwan
CREATE DATABASE ParkEaseDB_Simple;
GO
USE ParkEaseDB_Simple;
GO


CREATE TABLE Roles (
    RoleID      INT IDENTITY(1,1) PRIMARY KEY,
    RoleName    VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE VehicleTypes (
    VehicleTypeID   INT IDENTITY(1,1) PRIMARY KEY,
    TypeName        VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE SlotTypes (
    SlotTypeID  INT IDENTITY(1,1) PRIMARY KEY,
    TypeName    VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE BookingStatuses (
    BookingStatusID INT IDENTITY(1,1) PRIMARY KEY,
    StatusName      VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE PaymentMethods (
    PaymentMethodID INT IDENTITY(1,1) PRIMARY KEY,
    MethodName      VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Facilities (
    FacilityID   INT IDENTITY(1,1) PRIMARY KEY,
    FacilityName VARCHAR(100) NOT NULL UNIQUE
);

GO


CREATE TABLE Users (
    UserID      INT IDENTITY(1,1) PRIMARY KEY,
    FullName    VARCHAR(100) NOT NULL,
    Email       VARCHAR(150) NOT NULL UNIQUE,
    Phone       VARCHAR(20)  NULL,
    -- Password should be stored hashed in real production systems.
    PasswordHash VARCHAR(256) NOT NULL,
    CreatedAt   DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE UserRoles (
    UserRoleID  INT IDENTITY(1,1) PRIMARY KEY,
    UserID      INT NOT NULL,
    RoleID      INT NOT NULL,
    CONSTRAINT UQ_UserRoles UNIQUE (UserID, RoleID),
    CONSTRAINT FK_UserRoles_User  FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Role  FOREIGN KEY (RoleID) REFERENCES Roles(RoleID) ON DELETE NO ACTION
);

CREATE TABLE ParkingLots (
    LotID       INT IDENTITY(1,1) PRIMARY KEY,
    LotName     VARCHAR(120) NOT NULL UNIQUE,
    AddressLine VARCHAR(200) NULL,
    City        VARCHAR(60)  NULL,
    TotalLevels INT NOT NULL CHECK (TotalLevels >= 0)
);

CREATE TABLE LotFacilities (
    LotFacilityID INT IDENTITY(1,1) PRIMARY KEY,
    LotID         INT NOT NULL,
    FacilityID    INT NOT NULL,
    CONSTRAINT UQ_LotFacilities UNIQUE (LotID, FacilityID),
    CONSTRAINT FK_LotFacilities_Lot      FOREIGN KEY (LotID)      REFERENCES ParkingLots(LotID) ON DELETE CASCADE,
    CONSTRAINT FK_LotFacilities_Facility FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID) 
);

CREATE TABLE Levels (
    LevelID     INT IDENTITY(1,1) PRIMARY KEY,
    LotID       INT NOT NULL,
    LevelNumber INT NOT NULL,
    CONSTRAINT UQ_Levels UNIQUE (LotID, LevelNumber),
    CONSTRAINT FK_Levels_Lot FOREIGN KEY (LotID) REFERENCES ParkingLots(LotID) ON DELETE CASCADE
);

CREATE TABLE Slots (
    SlotID      INT IDENTITY(1,1) PRIMARY KEY,
    LevelID     INT NOT NULL,
    SlotTypeID  INT NOT NULL,
    SlotCode    VARCHAR(20) NOT NULL,
    IsActive    BIT NOT NULL DEFAULT 1,
    CONSTRAINT UQ_Slots UNIQUE (LevelID, SlotCode),
    CONSTRAINT FK_Slots_Level    FOREIGN KEY (LevelID)    REFERENCES Levels(LevelID) ON DELETE CASCADE,
    CONSTRAINT FK_Slots_SlotType FOREIGN KEY (SlotTypeID) REFERENCES SlotTypes(SlotTypeID),
    CONSTRAINT CHK_SlotCode_NOT_EMPTY CHECK (LEN(RTRIM(SlotCode)) > 0)
);

CREATE TABLE Sensors (
    SensorID    INT IDENTITY(1,1) PRIMARY KEY,
    SlotID      INT NOT NULL,
    DeviceCode  VARCHAR(50) NOT NULL UNIQUE,
    InstalledAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Sensors_Slot FOREIGN KEY (SlotID) REFERENCES Slots(SlotID) ON DELETE CASCADE
);

CREATE TABLE SensorEvents (
    EventID     BIGINT IDENTITY(1,1) PRIMARY KEY,
    SensorID    INT NOT NULL,
    EventTime   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    StatusText  VARCHAR(50) NOT NULL,
    CONSTRAINT FK_SensorEvents_Sensor FOREIGN KEY (SensorID) REFERENCES Sensors(SensorID) ON DELETE CASCADE
);

-- Pricing rules: rates can change over time (StartDate, EndDate)
CREATE TABLE PricingRules (
    PricingRuleID   INT IDENTITY(1,1) PRIMARY KEY,
    LotID           INT NOT NULL,
    SlotTypeID      INT NOT NULL,
    RatePerHour     DECIMAL(10,2) NOT NULL CHECK (RatePerHour >= 0),
    StartDate       DATE NOT NULL,
    EndDate         DATE NULL,
    CONSTRAINT UQ_PricingRules UNIQUE (LotID, SlotTypeID, StartDate),
    CONSTRAINT FK_PricingRules_Lot      FOREIGN KEY (LotID)      REFERENCES ParkingLots(LotID) ON DELETE CASCADE,
    CONSTRAINT FK_PricingRules_SlotType FOREIGN KEY (SlotTypeID) REFERENCES SlotTypes(SlotTypeID),
    CONSTRAINT CHK_PricingDates CHECK (EndDate IS NULL OR EndDate >= StartDate)
);

CREATE TABLE Vehicles (
    VehicleID       INT IDENTITY(1,1) PRIMARY KEY,
    UserID          INT NOT NULL,
    VehicleTypeID   INT NOT NULL,
    PlateNumber     VARCHAR(20) NOT NULL UNIQUE,
    Make            VARCHAR(50) NULL,
    Model           VARCHAR(50) NULL,
    Color           VARCHAR(30) NULL,
    CONSTRAINT FK_Vehicles_User        FOREIGN KEY (UserID)        REFERENCES Users(UserID) ON DELETE CASCADE,
    CONSTRAINT FK_Vehicles_VehicleType FOREIGN KEY (VehicleTypeID) REFERENCES VehicleTypes(VehicleTypeID)
);

CREATE TABLE Bookings (
    BookingID       INT IDENTITY(1,1) PRIMARY KEY,
    UserID          INT NOT NULL,
    VehicleID       INT NOT NULL,
    SlotID          INT NOT NULL,
    BookingStatusID INT NOT NULL,
    StartTime       DATETIME2 NOT NULL,
    EndTime         DATETIME2 NOT NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Bookings_User          FOREIGN KEY (UserID)          REFERENCES Users(UserID) ON DELETE NO ACTION,
    CONSTRAINT FK_Bookings_Vehicle       FOREIGN KEY (VehicleID)       REFERENCES Vehicles(VehicleID) ON DELETE NO ACTION,
    CONSTRAINT FK_Bookings_Slot          FOREIGN KEY (SlotID)          REFERENCES Slots(SlotID) ON DELETE NO ACTION,
    CONSTRAINT FK_Bookings_Status        FOREIGN KEY (BookingStatusID) REFERENCES BookingStatuses(BookingStatusID) ON DELETE NO ACTION,
    CONSTRAINT CHK_BookingTimes CHECK (EndTime > StartTime)
);
CREATE INDEX IX_Bookings_SlotTime ON Bookings (SlotID, StartTime, EndTime);
CREATE INDEX IX_Bookings_UserTime ON Bookings (UserID, StartTime);

CREATE TABLE Payments (
    PaymentID       INT IDENTITY(1,1) PRIMARY KEY,
    BookingID       INT NOT NULL UNIQUE,
    PaymentMethodID INT NOT NULL,
    Amount          DECIMAL(10,2) NOT NULL CHECK (Amount >= 0),
    PaidAt          DATETIME2 NULL,
    StatusText      VARCHAR(50) NOT NULL,
    CONSTRAINT FK_Payments_Booking       FOREIGN KEY (BookingID)       REFERENCES Bookings(BookingID) ON DELETE CASCADE,
    CONSTRAINT FK_Payments_PaymentMethod FOREIGN KEY (PaymentMethodID) REFERENCES PaymentMethods(PaymentMethodID) 
);

GO


INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Manager'), ('Attendant'), ('Customer');
INSERT INTO VehicleTypes (TypeName) VALUES ('Car'), ('Bike'), ('Van');
INSERT INTO SlotTypes (TypeName) VALUES ('Compact'), ('Large'), ('EV'), ('Handicap');
INSERT INTO BookingStatuses (StatusName) VALUES ('Reserved'), ('Active'), ('Completed'), ('Cancelled');
INSERT INTO PaymentMethods (MethodName) VALUES ('Cash'), ('Card'), ('Wallet');
INSERT INTO Facilities (FacilityName) VALUES ('CCTV'), ('EV Charger'), ('Elevator'), ('Restroom');

GO


INSERT INTO Users (FullName, Email, Phone, PasswordHash)
VALUES
('Haris Hassaan', 'haris@example.com', '+92-300-0000001', 'HASH_pass1'),
('Zuraiz Anjum',  'zuraiz@example.com', '+92-300-0000002', 'HASH_pass2'),
('Lot Manager',   'manager@parkease.pk', '+92-300-0000003', 'HASH_pass3');


INSERT INTO UserRoles (UserID, RoleID)
SELECT u.UserID, r.RoleID FROM Users u JOIN Roles r ON r.RoleName='Manager' WHERE u.Email='manager@parkease.pk';

INSERT INTO ParkingLots (LotName, AddressLine, City, TotalLevels)
VALUES ('FAST-NU Main Lot', 'B-Block, Faisal Town', 'Lahore', 2);

INSERT INTO LotFacilities (LotID, FacilityID)
SELECT p.LotID, f.FacilityID FROM ParkingLots p JOIN Facilities f ON f.FacilityName IN ('CCTV','EV Charger') WHERE p.LotName='FAST-NU Main Lot';

INSERT INTO Levels (LotID, LevelNumber)
SELECT LotID, 0 FROM ParkingLots WHERE LotName='FAST-NU Main Lot';
INSERT INTO Levels (LotID, LevelNumber)
SELECT LotID, 1 FROM ParkingLots WHERE LotName='FAST-NU Main Lot';

INSERT INTO Slots (LevelID, SlotTypeID, SlotCode)
SELECT L.LevelID, ST.SlotTypeID, 'A-01' FROM Levels L JOIN SlotTypes ST ON ST.TypeName='Compact' WHERE L.LevelNumber=0 AND L.LotID = (SELECT LotID FROM ParkingLots WHERE LotName='FAST-NU Main Lot');

INSERT INTO Slots (LevelID, SlotTypeID, SlotCode)
SELECT L.LevelID, ST.SlotTypeID, 'A-02' FROM Levels L JOIN SlotTypes ST ON ST.TypeName='Large' WHERE L.LevelNumber=0 AND L.LotID = (SELECT LotID FROM ParkingLots WHERE LotName='FAST-NU Main Lot');

INSERT INTO Slots (LevelID, SlotTypeID, SlotCode)
SELECT L.LevelID, ST.SlotTypeID, 'B-01' FROM Levels L JOIN SlotTypes ST ON ST.TypeName='EV' WHERE L.LevelNumber=1 AND L.LotID = (SELECT LotID FROM ParkingLots WHERE LotName='FAST-NU Main Lot');

INSERT INTO Sensors (SlotID, DeviceCode)
SELECT SlotID, 'DEV-001' FROM Slots WHERE SlotCode='A-01';
INSERT INTO Sensors (SlotID, DeviceCode)
SELECT SlotID, 'DEV-002' FROM Slots WHERE SlotCode='A-02';
INSERT INTO Sensors (SlotID, DeviceCode)
SELECT SlotID, 'DEV-003' FROM Slots WHERE SlotCode='B-01';

INSERT INTO Vehicles (UserID, VehicleTypeID, PlateNumber, Make, Model, Color)
SELECT u.UserID, vt.VehicleTypeID, 'LEB-1234', 'Toyota', 'Corolla', 'White'
FROM Users u JOIN VehicleTypes vt ON vt.TypeName='Car' WHERE u.Email='haris@example.com';

INSERT INTO Vehicles (UserID, VehicleTypeID, PlateNumber, Make, Model, Color)
SELECT u.UserID, vt.VehicleTypeID, 'LEB-2234', 'Toyota', 'Corola', 'Grey'
FROM Users u JOIN VehicleTypes vt ON vt.TypeName='Car' WHERE u.Email='w123456@gmail.com';

INSERT INTO Vehicles (UserID, VehicleTypeID, PlateNumber, Make, Model, Color)
SELECT u.UserID, vt.VehicleTypeID, 'LEC-9876', 'Honda', 'Civic', 'Blue'
FROM Users u JOIN VehicleTypes vt ON vt.TypeName='Car' WHERE u.Email='zuraiz@example.com';

INSERT INTO PricingRules (LotID, SlotTypeID, RatePerHour, StartDate, EndDate)
SELECT p.LotID, s.SlotTypeID, 120.00, '2025-09-01', NULL
FROM ParkingLots p JOIN SlotTypes s ON s.TypeName='Compact' WHERE p.LotName='FAST-NU Main Lot';

INSERT INTO PricingRules (LotID, SlotTypeID, RatePerHour, StartDate, EndDate)
SELECT p.LotID, s.SlotTypeID, 150.00, '2025-09-01', NULL
FROM ParkingLots p JOIN SlotTypes s ON s.TypeName='Large' WHERE p.LotName='FAST-NU Main Lot';

INSERT INTO PricingRules (LotID, SlotTypeID, RatePerHour, StartDate, EndDate)
SELECT p.LotID, s.SlotTypeID, 180.00, '2025-09-01', NULL
FROM ParkingLots p JOIN SlotTypes s ON s.TypeName='EV' WHERE p.LotName='FAST-NU Main Lot';

INSERT INTO SensorEvents (SensorID, StatusText)
SELECT SensorID, 'Vacant' FROM Sensors;
GO

CREATE VIEW vw_BookingDetails AS
SELECT 
    b.BookingID,
    b.UserID,
    u.FullName AS UserFullName,
    u.Email AS UserEmail,
    b.VehicleID,
    v.PlateNumber,
    b.SlotID,
    s.SlotCode,
    st.TypeName AS SlotType,
    l.LevelNumber,
    p.LotID,
    p.LotName,
    b.StartTime,
    b.EndTime,
    DATEDIFF(MINUTE, b.StartTime, b.EndTime) AS DurationMinutes,
    b.BookingStatusID,
    bs.StatusName AS BookingStatus,
    b.CreatedAt
FROM Bookings b
JOIN Users u ON b.UserID = u.UserID
JOIN Vehicles v ON b.VehicleID = v.VehicleID
JOIN Slots s ON b.SlotID = s.SlotID
JOIN SlotTypes st ON s.SlotTypeID = st.SlotTypeID
JOIN Levels l ON s.LevelID = l.LevelID
JOIN ParkingLots p ON l.LotID = p.LotID
JOIN BookingStatuses bs ON b.BookingStatusID = bs.BookingStatusID;
GO

CREATE VIEW vw_RevenueByLot AS
SELECT 
    p.LotID,
    p.LotName,
    COUNT(pay.PaymentID) AS PaymentsCount,
    SUM(pay.Amount) AS TotalAmount,
    MIN(pay.PaidAt) AS FirstPaymentAt,
    MAX(pay.PaidAt) AS LastPaymentAt
FROM Payments pay
JOIN Bookings b ON pay.BookingID = b.BookingID
JOIN Slots s ON b.SlotID = s.SlotID
JOIN Levels l ON s.LevelID = l.LevelID
JOIN ParkingLots p ON l.LotID = p.LotID
GROUP BY p.LotID, p.LotName;
GO

GO
CREATE PROCEDURE dbo.usp_CreateBooking
    @UserID INT,
    @VehicleID INT,
    @SlotID INT,
    @StartTime DATETIME2,
    @EndTime DATETIME2,
    @BookingStatusName VARCHAR(50) = 'Reserved',
    @CreatePayment BIT = 0,
    @PaymentMethodName VARCHAR(50) = NULL,
    @Amount DECIMAL(10,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @EndTime <= @StartTime
        BEGIN
            THROW 50001, 'EndTime must be greater than StartTime.', 1;
        END

        -- check slot active
        IF NOT EXISTS (SELECT 1 FROM Slots WHERE SlotID = @SlotID AND IsActive = 1)
        BEGIN
            THROW 50002, 'Slot not found or not active.', 1;
        END

        DECLARE @BookingStatusID INT;
        SELECT @BookingStatusID = BookingStatusID FROM BookingStatuses WHERE StatusName = @BookingStatusName;
        IF @BookingStatusID IS NULL
            THROW 50003, 'Invalid booking status name provided.', 1;

        DECLARE @ReservedID INT = (SELECT BookingStatusID FROM BookingStatuses WHERE StatusName = 'Reserved');
        DECLARE @ActiveID   INT = (SELECT BookingStatusID FROM BookingStatuses WHERE StatusName = 'Active');

        IF EXISTS (
            SELECT 1 FROM Bookings b
            WHERE b.SlotID = @SlotID
              AND b.BookingStatusID IN (COALESCE(@ReservedID, -1), COALESCE(@ActiveID, -1))
              AND NOT (b.EndTime <= @StartTime OR b.StartTime >= @EndTime)
        )
        BEGIN
            THROW 50004, 'Slot is already booked for the requested time range.', 1;
        END

        BEGIN TRANSACTION;

        INSERT INTO Bookings (UserID, VehicleID, SlotID, BookingStatusID, StartTime, EndTime)
        VALUES (@UserID, @VehicleID, @SlotID, @BookingStatusID, @StartTime, @EndTime);

        DECLARE @NewBookingID INT = SCOPE_IDENTITY();

        IF @CreatePayment = 1
        BEGIN
            IF @PaymentMethodName IS NULL OR @Amount IS NULL
            BEGIN
                ROLLBACK TRANSACTION;
                THROW 50005, 'PaymentMethodName and Amount are required when CreatePayment = 1.', 1;
            END

            DECLARE @PaymentMethodID INT = (SELECT PaymentMethodID FROM PaymentMethods WHERE MethodName = @PaymentMethodName);
            IF @PaymentMethodID IS NULL
            BEGIN
                ROLLBACK TRANSACTION;
                THROW 50006, 'Invalid payment method name.', 1;
            END

            INSERT INTO Payments (BookingID, PaymentMethodID, Amount, PaidAt, StatusText)
            VALUES (@NewBookingID, @PaymentMethodID, @Amount, SYSUTCDATETIME(), 'Paid');
        END

        COMMIT TRANSACTION;

        SELECT @NewBookingID AS BookingID;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrNum INT = ERROR_NUMBER();
        RAISERROR('usp_CreateBooking failed: %s', 16, 1, @ErrMsg);
        RETURN;
    END CATCH
END
GO

CREATE PROCEDURE dbo.usp_GetAvailableSlots
    @LotID INT = NULL, 
    @SlotTypeName VARCHAR(50) = NULL,
    @StartTime DATETIME2,
    @EndTime DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    IF @EndTime <= @StartTime
    BEGIN
        THROW 51001, 'EndTime must be > StartTime', 1;
    END

    SELECT 
        s.SlotID,
        s.SlotCode,
        st.TypeName AS SlotType,
        l.LevelNumber,
        p.LotID,
        p.LotName
    FROM Slots s
    JOIN SlotTypes st ON s.SlotTypeID = st.SlotTypeID
    JOIN Levels l ON s.LevelID = l.LevelID
    JOIN ParkingLots p ON l.LotID = p.LotID
    WHERE s.IsActive = 1
      AND (@LotID IS NULL OR p.LotID = @LotID)
      AND (@SlotTypeName IS NULL OR st.TypeName = @SlotTypeName)
      AND NOT EXISTS (
            SELECT 1 FROM Bookings b
            WHERE b.SlotID = s.SlotID
              AND b.BookingStatusID IN (
                    SELECT BookingStatusID FROM BookingStatuses WHERE StatusName IN ('Reserved','Active')
                  )
              AND NOT (b.EndTime <= @StartTime OR b.StartTime >= @EndTime)
      )
    ORDER BY p.LotName, l.LevelNumber, s.SlotCode;
END
GO


CREATE VIEW vw_SensorLatestStatus AS
SELECT se.SensorID, se.EventID, se.EventTime, se.StatusText
FROM SensorEvents se
JOIN (
    SELECT SensorID, MAX(EventTime) AS MaxEventTime FROM SensorEvents GROUP BY SensorID
) mx ON se.SensorID = mx.SensorID AND se.EventTime = mx.MaxEventTime;
GO

SELECT COUNT(*) AS UsersCount FROM Users;
SELECT p.LotName, COUNT(l.LevelID) AS LevelsCount
FROM ParkingLots p LEFT JOIN Levels l ON p.LotID = l.LotID
GROUP BY p.LotName;

SELECT s.SlotCode, st.TypeName AS SlotType, l.LevelNumber, p.LotName
FROM Slots s
JOIN SlotTypes st ON s.SlotTypeID = st.SlotTypeID
JOIN Levels l ON s.LevelID = l.LevelID
JOIN ParkingLots p ON l.LotID = p.LotID;

SELECT TOP 10 * FROM vw_BookingDetails ORDER BY CreatedAt DESC;
GO

UPDATE Users
SET PasswordHash = '123456'
WHERE Email = 'haris@test.com';
