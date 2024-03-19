// JavaScript source code
const sql = require('mssql');

// Configuration for Azure SQL Database connection
const config = {
    user: 'kennie.jones@gmail.com',
    password: '*Kdj1121608520',
    server: 'novorecovery.database.windows.net',
    database: 'novo_resource_group',
    options: {
        encrypt: true, // For secure connection
        trustServerCertificate: false // Change to true for local dev / self-signed certs
    }
};

// Function to verify login information
async function verifyLogin(usernameOrEmailOrPhoneNumber, password) {
    try {
        // Connect to the database
        await sql.connect(config);

        // Prepare SQL query to retrieve user information based on username/email/phone number
        const query = `
            SELECT *
            FROM Users
            WHERE Username = @usernameOrEmailOrPhoneNumber
               OR Email = @usernameOrEmailOrPhoneNumber
               OR PhoneNumber = @usernameOrEmailOrPhoneNumber
        `;

        // Execute the query with provided parameters
        const result = await sql.query(query, {
            usernameOrEmailOrPhoneNumber: usernameOrEmailOrPhoneNumber
        });

        // Check if a user with the provided username/email/phone number exists
        if (result.recordset.length === 0) {
            return { success: false, message: 'User not found' };
        }

        // Verify password
        const user = result.recordset[0];
        if (password !== user.Password) {
            return { success: false, message: 'Incorrect password' };
        }

        // Login successful
        return { success: true, message: 'Login successful', user: user };
    } catch (error) {
        console.error('Error verifying login:', error.message);
        return { success: false, message: 'Internal server error' };
    } finally {
        // Close the database connection
        await sql.close();
    }
}

// Example usage:
const usernameOrEmailOrPhoneNumber = 'example_username';
const password = 'example_password';
verifyLogin(usernameOrEmailOrPhoneNumber, password)
    .then(result => console.log(result))
    .catch(error => console.error(error));

