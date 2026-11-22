-- Test-only data loaded into the throwaway CI database (never production).
USE COP4331;

INSERT INTO Users (FirstName, LastName, Login, Password)
VALUES ('Test', 'User', 'testuser', 'testpass');
