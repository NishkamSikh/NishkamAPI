const { Pool } = require('pg')
const sql = require('mssql');
 
const config =({
  // connectionString:process.env.DATABASE_URL,
  // ssl:{ rejectUnauthorized: false }


  // server: 'nishkam.database.windows.net',
  // database: 'Nishkam',
  // user: 'nishkamadmin84',
  // password: 'L6RDe#Lsw41d',
  server:'nishkam84.database.windows.net',
  database:'Sikligar',
  user:'nishkam2025',
  password:'kQWvUC#wjjAJe3K',
  options: {
    encrypt: true // For secure connection
  }
});

sql.connect(config)
  .then(() => {
    console.log('Connected to the Azure SQL Database Sikligar');

    // Execute a query
    return sql.query`SELECT * FROM StudentData`;
  })
  .then(result => {
    // console.log('Query result:', result.recordset);

    // Close the connection
    sql.close();
  })
  .catch(err => {
    console.error('Error:', err);
    sql.close();
  });
module.exports = {
  query: (text, params) => config.query(text, params),
}