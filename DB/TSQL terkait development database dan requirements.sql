CREATE DATABASE myAppHaritzDB;
GO
USE myAppHaritzDB;
GO

-- CREATE TABLE USER TSQL
CREATE TABLE [dbo].[User] (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20) NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Status NVARCHAR(50) NOT NULL,  -- Contoh: 'Active' atau 'Inactive'
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL
);
GO

-- CREATE TABLE EVENTLOG TSQL
CREATE TABLE [dbo].[EventLog] (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    EventType NVARCHAR(50),           -- Misalnya: 'CREATE', 'UPDATE', 'DELETE'
    Description NVARCHAR(500),
    LogDate DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- StoredProcedure for create new user TSQL
CREATE PROCEDURE [dbo].[usp_CreateUser]
    @Name NVARCHAR(255),
    @Email NVARCHAR(255),
    @PhoneNumber NVARCHAR(20) = NULL,
    @PasswordHash NVARCHAR(255),
    @Status NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO [dbo].[User] (Id, Name, Email, PhoneNumber, PasswordHash, Status, CreatedAt)
        VALUES (NEWID(), @Name, @Email, @PhoneNumber, @PasswordHash, @Status, GETDATE());
    
        -- Log event
        INSERT INTO [dbo].[EventLog] (EventType, Description)
        VALUES ('CREATE', CONCAT('User dibuat untuk ', @Email));
    
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Storedprocedure for Update data current user TSQL
CREATE PROCEDURE [dbo].[usp_UpdateUser]
    @Id UNIQUEIDENTIFIER,
    @Name NVARCHAR(255),
    @Email NVARCHAR(255),
    @PhoneNumber NVARCHAR(20) = NULL,
    @PasswordHash NVARCHAR(255) = NULL, -- Bila NULL, maka tidak mengubah password
    @Status NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE [dbo].[User]
        SET Name = @Name,
            Email = @Email,
            PhoneNumber = @PhoneNumber,
            PasswordHash = COALESCE(@PasswordHash, PasswordHash),
            Status = @Status,
            UpdatedAt = GETDATE()
        WHERE Id = @Id;
    
        -- Log event
        INSERT INTO [dbo].[EventLog] (EventType, Description)
        VALUES ('UPDATE', CONCAT('User diperbarui: ', @Email));
    
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Storedprocedure for erasing data current user TSQL
CREATE PROCEDURE [dbo].[usp_DeleteUser]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @Email NVARCHAR(255);
        SELECT @Email = Email FROM [dbo].[User] WHERE Id = @Id;
    
        DELETE FROM [dbo].[User] WHERE Id = @Id;
    
        -- Log event
        INSERT INTO [dbo].[EventLog] (EventType, Description)
        VALUES ('DELETE', CONCAT('User dihapus: ', @Email));
    
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- View to show data current user has been add
CREATE VIEW [dbo].[vw_User]
AS
SELECT Id, Name, Email, PhoneNumber, Status, CreatedAt, UpdatedAt
FROM [dbo].[User];
GO