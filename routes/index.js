var cors = require('cors');
var express = require('express');
const fetch = require('node-fetch');
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const app = require('../app');
const db = require('../db');
const { Pool } = require('pg')
const axios = require('axios');
const { response } = require('express');
const ics = require('ics');
const { writeFileSync } = require('fs');
var nodemailer = require('nodemailer');
const ical = require('ical-generator');
const bcrypt = require('bcrypt'); //for hashing passwords
// const flash = require('express-flash');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../db/middleware/validInfo');
const authorization = require('../db/middleware/authorization');
const passport = require('passport');
const { json } = require('body-parser');
const sql = require('mssql');
var path = require('path');
const jwt = require('jsonwebtoken');
const jwrsecret = "MYNameisJashandeepSInghjoharmukts"
// import {v2 as cloudinary} from 'cloudinary'


// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

const config = ({
  // connectionString:process.env.DATABASE_URL,


  server: 'nishkam84.database.windows.net',
  database: 'Sikligar',
  user: 'nishkam2025',
  password: 'kQWvUC#wjjAJe3K',
  options: {
    encrypt: true
  }
});
var router = express.Router();
router.all(cors());

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { page: 'Home', menuId: 'home' });
});

/* GET About page. */
router.get('/about', function (req, res, next) {
  // console.log("", req.query.name)
  console.log(req);
  res.render('about', { page: 'About Us', menuId: 'about', gud: req });
});

/* GET Contact page. */
router.get('/contact', function (req, res, next) {
  res.render('contact', { page: 'Contact Us', menuId: 'contact' });
});

/* GET Contact page. */
router.get('/privacy', function (req, res, next) {
  res.render('privacy', { page: 'Privacy', menuId: 'privacy' });
});


/* GET Time page. */
router.get('/next', function (req, res, next) {
  res.render('next', { page: 'Second ', menuId: 'second' });
});


/* GET Services page. */
router.get('/service', function (req, res, next) {
  res.render('service', { page: 'service ', menuId: 'second' });
});

router.get("/ics.js", (req, res) => {

  console.log("jashan");

});

router.get("/api/v1/testapi", async (req, res) => {


  const name = "Test API - Success";
  res.status(200).json({
    status: "succes",
    message: `Call From Test Api ${name}`
  })

});

router.get("/api/v1/skmtutor", async (req, res) => {

  sql.connect(config)
    .then(async () => {
      console.log('Connected to the Azure SQL Database');
      const querylist = await sql.query('SELECT * FROM SKM_Tutor');
      console.log(querylist.recordset, "Jashan");

      res.status(200).json({
        status: "succes",
        data: querylist.recordset
      })

      // Execute a query
      // return sql.query`SELECT * FROM IPB_students`;
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
});


//=========================
// 1. Add Data in Student Data table
//===========================

router.post("/api/v1/addStudentData", async (req, res) => {
  try {
    await sql.connect(config);

    const request = new sql.Request();
    const { UserId, StudentCode, AcademicYear, CatgCode, data } = req.body;
    // const photoUrl = await cloudinary.uploader.upload(photo);

    // Modify the query to include the new column
    const query = 'INSERT INTO StudentData (UserId,StudentCode,AcademicYear,CatgCode, json) VALUES (@userId,@StudentCode,@AcademicYear,@CatgCode, @data)';

    // Set the values for the new column and other parameters
    request.input('UserId', sql.NVarChar, UserId);
    request.input('StudentCode', sql.NVarChar, StudentCode);
    request.input('AcademicYear', sql.NVarChar, AcademicYear);
    request.input('CatgCode', sql.NVarChar, CatgCode);
    request.input('data', sql.NVarChar, data);

    // Execute the query
    await request.query(query);

    console.log('Data inserted successfully');

    res.status(200).json({
      status: "success",
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({
      status: "failed",
    });
  } finally {
    sql.close();
  }
});


router.post("/api/v1/addTutorRecord", async (req, res) => {
  try {
    await sql.connect(config);

    const request = new sql.Request();
    const { UserId, StudentCode, TutorId, isActive } = req.body;
    // const photoUrl = await cloudinary.uploader.upload(photo);

    // Modify the query to include the new column
    const query = 'INSERT INTO StudentTutor (UserId,StudentCode,TutorId,isActive) VALUES (@userId,@StudentCode,@TutorId,@isActive)';

    // Set the values for the new column and other parameters
    request.input('UserId', sql.NVarChar, UserId);
    request.input('StudentCode', sql.NVarChar, StudentCode);
    request.input('TutorId', sql.NVarChar, TutorId);
    request.input('isActive', sql.NVarChar, isActive);

    // Execute the query
    await request.query(query);

    console.log('Tutor Data inserted successfully');

    res.status(200).json({
      status: "success",
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({
      status: "failed",
    });
  } finally {
    sql.close();
  }
});

router.post("/api/v1/addFileUpload", async (req, res) => {
  try {
    await sql.connect(config);

    const request = new sql.Request();
    const { UserId, StudentCode, AcademicYear, DocumentDesc, DocumentType, DocumentURL } = req.body;
    // const photoUrl = await cloudinary.uploader.upload(photo);

    // Modify the query to include the new column
    const query = 'INSERT INTO DocumentUpload (UserId,StudentCode,AcademicYear,DocumentDesc,DocumentType,DocumentURL) VALUES (@userId,@StudentCode,@AcademicYear,@DocumentDesc, @DocumentType,@DocumentURL)';

    // Set the values for the new column and other parameters
    request.input('UserId', sql.NVarChar, UserId);
    request.input('StudentCode', sql.NVarChar, StudentCode);
    request.input('AcademicYear', sql.NVarChar, AcademicYear);
    request.input('DocumentDesc', sql.NVarChar, DocumentDesc);
    request.input('DocumentType', sql.NVarChar, DocumentType);
    request.input('DocumentURL', sql.NVarChar, DocumentURL);

    // Execute the query
    await request.query(query);

    console.log('Data inserted successfully');

    res.status(200).json({
      status: "success",
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({
      status: "failed",
    });
  } finally {
    sql.close();
  }
});




//===========================
// 2. Get Student List according to User Id
//===========================
// API endpoint to fetch records by userId
router.post("/api/v1/fetchStudentDetails", async (req, res) => {
  try {
    // Connect to the SQL Server database
    await sql.connect(config);

    const request = new sql.Request();
    const { UserId } = req.body;

    // Modify the query to match your table structure
    const query = 'SELECT * FROM StudentData WHERE UserId = @UserId';

    // Set the parameter value for the query
    request.input('UserId', sql.NVarChar, UserId);

    // Execute the query
    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  } finally {
    sql.close();
  }
});

router.get("/api/v1/fetchAllStudentCode", async (req, res) => {
  try {
    // Connect to the SQL Server database
    const pool = await sql.connect(config);
    const request = new sql.Request();

    const query = 'SELECT StudentCode FROM v_StudentData';
    // Execute the query
    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: result.recordset,
    });

    // Close the SQL connection pool
    await pool.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.get("/api/v1/fetchAllDonorCode", async (req, res) => {
  try {
    // Connect to the SQL Server database
    const pool = await sql.connect(config);
    const request = new sql.Request();

    const query = 'SELECT DonorCode FROM Donor';
    // Execute the query
    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: result.recordset,
    });

    // Close the SQL connection pool
    await pool.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});


router.post("/api/v1/AddDonorBeneficiary", async (req, res) => {
  const { BeneficiaryCode, DonorCode, isActive, UserID } = req.body;

  try {
    // Connect to the database
    await sql.connect(config);

    // Insert a new record into the table
    const insertQuery = `
      INSERT INTO DonorBeneficiary (BeneficiaryCode, DonorCode, isActive,UserID)
      VALUES (@value1,@value2,@value3,@value4)
    `;
    const request = new sql.Request();
    request.input('value1', sql.VarChar, BeneficiaryCode);
    request.input('value2', sql.VarChar, DonorCode);
    request.input('value3', sql.Int, isActive);
    request.input('value4', sql.VarChar,UserID);

    const result = await request.query(insertQuery);
    console.log('Data inserted successfully');
    console.log(BeneficiaryCode, "BeneficiaryCode", "DonorCode", DonorCode, "isActive", isActive);
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the connection
    sql.close();
  }
});

router.get("/api/v1/fetchAllClassess", async (req, res) => {
  try {
    // Connect to the SQL Server database
    const pool = await sql.connect(config);
    const request = new sql.Request();
    const CatCo = 'CLAS'

    const query = `SELECT * FROM v_MasterClass`; // Parameterized query
    request.input('CatCo', sql.VarChar, CatCo); // Define the parameter

    // Execute the query
    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: result.recordset,
    });

    // Close the SQL connection pool
    await pool.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.get("/api/v1/fetchAllStream", async (req, res) => {
  try {
    // Connect to the SQL Server database
    const pool = await sql.connect(config);
    const request = new sql.Request();
    const CatCo = 'STRM'

    const query = `SELECT * FROM v_MasterStream`; // Parameterized query
    request.input('CatCo', sql.VarChar, CatCo); // Define the parameter

    // Execute the query
    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: result.recordset,
    });

    // Close the SQL connection pool
    await pool.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.get("/api/v1/fetchAllStudentDetails", async (req, res) => {
  try {
    // Connect to the SQL Server database
    const pool = await sql.connect(config);
    const request = new sql.Request();

    const query = 'SELECT * FROM v_StudentData';
    // Execute the query
    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: result.recordset,
    });

    // Close the SQL connection pool
    await pool.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.get("/api/v1/fetchSingleStudentDetail", async (req, res) => {
  try {
    // Connect to the SQL Server database
    await sql.connect(config);

    const request = new sql.Request();
    const { StudentId } = req.body;

    const query = 'SELECT * FROM v_StudentData where StudentId = @StudentId';
    // Execute the query
    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: result.recordset,
    });

    // Close the SQL connection pool
    await pool.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});


//===========================
// 9. All Data from all tables
//===========================

router.post("/api/v1/getAllData", async (req, res) => {
  const validCatgCodes = ['INST', 'FMLY', 'ADDR', 'ACAD', 'PROF', 'RPTC'];

  try {
    await sql.connect(config);

    const StudentCode = req.body.StudentCode;
    const AcademicYear = req.body.AcademicYear;

    const request = new sql.Request();

    const placeholders = validCatgCodes.map((catgCode, index) => `@catgCode${index}`).join(',');
    const values = validCatgCodes.map((catgCode, index) => ({ name: `catgCode${index}`, value: catgCode }));

    const query = `
      SELECT * 
      FROM StudentData 
      WHERE StudentCode = @StudentCode 
        AND AcademicYear = @AcademicYear 
        AND CatgCode IN (${placeholders})
    `;

    request.input('StudentCode', sql.NVarChar, StudentCode);
    request.input('AcademicYear', sql.NVarChar, AcademicYear);

    values.forEach(({ name, value }) => {
      request.input(name, sql.NVarChar, value);
    });

    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    sql.close();
  }
});

//==============================================
// 10. Get Data from student, year, table tables
//==============================================
router.get("/api/v1/getStudentById/:Id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const Id = req.params.Id;

    const request = new sql.Request();

    //const query = `SELECT * FROM StudentData WHERE StudentCode = @StudentCode AND AcademicYear = @AcademicYear AND CatgCode = @CatgCode`;
    const query = `SELECT * FROM v_StudentProfile WHERE StudentId = 216`;

    console.log(query);


    //request.input('Id', sql.NVarChar, Id);

    const result = await request.query(query);
    console.log(result);


    res.status(200).json({
      status: "success..",
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});


// fetch personal profile data
router.get("/api/v1/getSingleStudentById/:Id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const Id = req.params.Id;

    const request = new sql.Request();

    //const query = `SELECT * FROM StudentData WHERE StudentCode = @StudentCode AND AcademicYear = @AcademicYear AND CatgCode = @CatgCode`;
    const query = `SELECT * FROM v_StudentProfile WHERE StudentId = @Id`;
    request.input('Id', sql.NVarChar, Id);  // Corrected parameter name
    console.log(query);

    const result = await request.query(query);
    console.log(result);

    res.status(200).json({
      status: "success..",
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});

// fetch Address data
router.get("/api/v1/getSingleStudentAddress/:Id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const Id = req.params.Id;

    const request = new sql.Request();

    //const query = `SELECT * FROM StudentData WHERE StudentCode = @StudentCode AND AcademicYear = @AcademicYear AND CatgCode = @CatgCode`;
    const query = `SELECT * FROM v_StudentAddress WHERE StudentId = @Id`;
    request.input('Id', sql.NVarChar, Id);  // Corrected parameter name
    console.log(query);

    const result = await request.query(query);
    console.log(result);

    res.status(200).json({
      status: "success..",
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});


// fetch Address data
router.get("/api/v1/getSingleStudentFamily/:Id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const Id = req.params.Id;

    const request = new sql.Request();

    //const query = `SELECT * FROM StudentData WHERE StudentCode = @StudentCode AND AcademicYear = @AcademicYear AND CatgCode = @CatgCode`;
    const query = `SELECT * FROM v_StudentFamily WHERE StudentId = @Id`;
    request.input('Id', sql.NVarChar, Id);  // Corrected parameter name
    console.log(query);

    const result = await request.query(query);
    console.log(result);

    res.status(200).json({
      status: "success..",
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});


// fetch Inst  data
router.get("/api/v1/getSingleStudentInst/:Id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const Id = req.params.Id;

    const request = new sql.Request();

    //const query = `SELECT * FROM StudentData WHERE StudentCode = @StudentCode AND AcademicYear = @AcademicYear AND CatgCode = @CatgCode`;
    const query = `SELECT * FROM v_StudentInstitute WHERE StudentId = @Id`;
    request.input('Id', sql.NVarChar, Id);  // Corrected parameter name
    console.log(query);

    const result = await request.query(query);
    console.log(result);

    res.status(200).json({
      status: "success..",
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});




// fetch Student Docs  data
router.get("/api/v1/getSingleStudentDocs/:Id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const Id = req.params.Id;

    const request = new sql.Request();

    //const query = `SELECT * FROM StudentData WHERE StudentCode = @StudentCode AND AcademicYear = @AcademicYear AND CatgCode = @CatgCode`;
    const query = `SELECT * FROM v_DocumentUploaded WHERE StudentId = @Id`;
    request.input('Id', sql.NVarChar, Id);  // Corrected parameter name
    console.log(query);

    const result = await request.query(query);
    console.log(result);

    res.status(200).json({
      status: "success..",
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});



// fetch Academic data
router.get("/api/v1/getSingleStudentAcademic/:Id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const Id = req.params.Id;

    const request = new sql.Request();

    //const query = `SELECT * FROM StudentData WHERE StudentCode = @StudentCode AND AcademicYear = @AcademicYear AND CatgCode = @CatgCode`;
    const query = `SELECT * FROM v_StudentAcademic WHERE StudentId = @Id`;
    request.input('Id', sql.NVarChar, Id);  // Corrected parameter name
    console.log(query);

    const result = await request.query(query);
    console.log(result);

    res.status(200).json({
      status: "success..",
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});



// fetch ReportCard data
router.get("/api/v1/getSingleStudentReportCard/:Id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const Id = req.params.Id;

    const request = new sql.Request();

    //const query = `SELECT * FROM StudentData WHERE StudentCode = @StudentCode AND AcademicYear = @AcademicYear AND CatgCode = @CatgCode`;
    const query = `SELECT * FROM v_StudentReportCard WHERE StudentId = @Id`;
    request.input('Id', sql.NVarChar, Id);  // Corrected parameter name
    console.log(query);

    const result = await request.query(query);
    console.log(result);

    res.status(200).json({
      status: "success..",
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});



//==============================================
// 10. Get Data from student, year, table tables
//==============================================
router.get("/api/v1/getAllData/:studentCode/:year/:catgcode", async (req, res) => {
  const validCatgCodes = ['INST', 'FMLY', 'ADDR', 'ACAD', 'PROF', 'RPTC'];

  try {
    const pool = await sql.connect(config);

    const studentCode = req.params.studentCode;
    const year = req.params.year;
    const table = req.params.catgcode;

    if (!validCatgCodes.includes(table)) {
      return res.status(400).json({
        status: "failed",
        error: "Invalid table name"
      });
    }

    const request = new sql.Request();

    const query = `SELECT * FROM StudentData WHERE StudentCode = @StudentCode AND AcademicYear = @AcademicYear AND CatgCode = @CatgCode`;

    request.input('StudentCode', sql.NVarChar, studentCode);
    request.input('AcademicYear', sql.NVarChar, year);
    request.input('CatgCode', sql.NVarChar, table);

    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: {
        tableName: table,
        data: result.recordset
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});

//==============================================
// 11. Update Basic Detail
//==============================================
router.put("/api/v1/updateBasicDetail/:Id", async (req, res) => {
  try {
    await sql.connect(config);

    const request = new sql.Request();
    const { data } = req.body;
    const Id = req.params.Id;

    // Check if studentCode is not null or undefined
    // if (StudentCode === null || StudentCode === undefined) {
    //   console.log('Invalid studentCode:', StudentCode);
    //   return res.status(400).json({
    //     status: "failed",
    //     message: "Invalid studentCode",
    //   });
    // }

    // Modify the query to update the existing record
    // const query = 'UPDATE StudentData SET StudentCode = @StudentCode, AcademicYear = @AcademicYear, Json = @data WHERE Id = @Id';
    const query = 'UPDATE StudentData SET Json = @data WHERE Id = @Id';

    // Set the values for the parameters
    request.input('Id', sql.NVarChar, Id);
    // request.input('StudentCode', sql.NVarChar, StudentCode);
    // request.input('AcademicYear', sql.NVarChar, AcademicYear);
    request.input('data', sql.NVarChar, data);

    // Execute the query
    const result = await request.query(query);

    // Check if the record was updated successfully
    if (result.rowsAffected[0] > 0) {
      console.log('Data updated successfully');
      res.status(200).json({
        status: "success",
      });
    } else {
      console.log('User not found or data not updated');
      res.status(404).json({
        status: "failed",
        message: "User not found or data not updated",
      });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  } finally {
    try {
      // Close the connection
      await sql.close();
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});
//===========================
//12. List Basti API START
//===========================
router.get("/api/v1/bastilist", async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);
    console.log('Basti List Found');

    // const selectQuery  = `SELECT json FROM SKM_Basti`;
    const selectQuery = `SELECT * FROM MasterData WHERE CatgCode = \'BAST\'`;
    //const selectQuery = `SELECT * FROM v_MasterBasti';
    const request = new sql.Request();

    const result = await request.query(selectQuery);

    // Send the response to the client
    res.status(200).json({
      status: "success",
      data: result.recordset
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection
    try {
      // await sql.close(); 
    } catch (err) {
      console.error('Error closing connection:', err);
    }
  }
});

//===========================
// List School/ collage name API START
//===========================

router.get("/api/v1/instlist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {
      // Insert a new record into the table
      const selectQuery = `SELECT * FROM MasterData WHERE CatgCode = \'INST\'`;
      const request = new sql.Request();
      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      // sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});


router.post("/api/v1/schoolrecord", async (req, res) => {

  const { tutorjson, type } = req.body;

  // Connect to the database
  sql.connect(config)
    .then(() => {
      // console.log('Connected to the Azure SQL Database');
      // Insert a new record into the table
      const insertQuery = `
    INSERT INTO SKM_Institute (json,type)
    VALUES (@value1,@value2)
  `;
      const request = new sql.Request();
      request.input('value1', sql.Text, tutorjson);
      request.input('value2', sql.Text, type);

      return request.query(insertQuery);
    })
    .then(result => {
      console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: tutorjson,
        type: type
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});


//===========================
// School API END
//===========================

//===========================
// Data Update API END
//===========================
router.put("/api/v1/schoolrecord/:id", async (req, res) => {
  const { id } = req.params;
  const { tutorjson, type } = req.body;

  // Check if tutorjson is a valid non-empty object
  if (typeof tutorjson !== 'object' || tutorjson === null) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid or empty tutorjson object',
    });
  }

  // Convert the tutorjson object to a JSON string
  const tutorjsonString = JSON.stringify(tutorjson);

  // Connect to the database
  sql.connect(config)
    .then(() => {
      // Update the record in the table
      const updateQuery = `
        UPDATE SKM_Institute
        SET json = @value1, type = @value2
        WHERE id = @recordId
      `;
      const request = new sql.Request();
      request.input('value1', sql.Text, tutorjsonString);
      request.input('value2', sql.Text, type);
      request.input('recordId', sql.Int, id);

      return request.query(updateQuery);
    })
    .then(result => {
      if (result.rowsAffected[0] > 0) {
        console.log('Data updated successfully');
        res.status(200).json({
          status: "success",
          data: {
            id: parseInt(id),
            tutorjson: tutorjson,
            type: type
          }
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Record not found"
        });
      }
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
      res.status(500).json({
        status: "error",
        message: "Internal Server Error"
      });
    });
});




//===========================
// Family Deatil API START
//===========================


router.post("/api/v1/familyrecords", async (req, res) => {

  const { tutorjson } = req.body;

  // Connect to the database
  sql.connect(config)
    .then(() => {
      // console.log('Connected to the Azure SQL Database');

      // Insert a new record into the table
      const insertQuery = `
    INSERT INTO SKM_Family (json)
    VALUES (@value1)  
  `;
      const request = new sql.Request();
      request.input('value1', sql.Text, tutorjson);
      return request.query(insertQuery);
    })
    .then(result => {
      console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: tutorjson
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});


//===========================
// Family Deatil API END
//===========================


router.post('/testsearch', async (req, res) => {
  console.log("abc test")
  const inputValue = req.body.M_Aadhar_No;



  try {
    // Make a GET request to the second API
    const responseapi = await axios.get('https://nishkamsikligarback.onrender.com/api/v1/fetchfamily');

    // Process the response data as needed
    const responseData = responseapi.data;
    console.log(responseData, "responseData")

    // const jsonString = responseData.data[0].json.replace(/'/g, '"');
    // responseData.data[0].json = jsonString;
    const response = responseData;
    // res.json(response);
    // console.log(JSON.stringify(response),"response from api")

    // Array to store matched JSON entries
    const matchedEntries = [];

    // Iterate over each entry and search for a match
    for (const entry of response.data) {
      // Parse the JSON content
      const jsonContent = JSON.parse(entry.json);

      // Search for a match in the "F_Aadhar_No" or "M_Aadhar_No" fields
      for (const field of ['F_Aadhar_No', 'M_Aadhar_No']) {
        if (jsonContent[field] && jsonContent[field] === inputValue) {
          // Add the matched entry to the array
          matchedEntries.push(jsonContent);
          break;
        }
      }
    }

    // Return the matched entries or a message indicating no match was found
    if (matchedEntries.length > 0) {
      res.json({
        data: matchedEntries
      });
    } else {
      res.json({ message: 'No match found.' });
    }




  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }



});


//===========================
// Full user Deatil insert API START
//===========================


router.post("/api/v1/adduserdata", async (req, res) => {
  try {
    await sql.connect(config);

    const request = new sql.Request();
    const { Userid, data } = req.body;


    // Modify the query to include the new column
    const query = 'INSERT INTO SKM_Students (UserId, json) VALUES (@UserId, @data)';

    // Set the values for the new column and other parameters
    request.input('UserId', sql.NVarChar, JSON.stringify(Userid));
    request.input('data', sql.NVarChar, JSON.stringify(data));

    // Execute the query
    await request.query(query);

    console.log('Data inserted successfully');

    res.status(200).json({
      status: "success",

    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    sql.close();
  }


});



//===========================
// Students Details fetch
//===========================


router.get("/api/v1/fetchstudentdata", async (req, res) => {
  try {
    await sql.connect(config);
    // Execute the query
    const result = await sql.query('SELECT * FROM SKM_Students');

    // Close the database connection
    await sql.close();
    res.status(200).json({
      status: "success",
      data: result.recordset

    });


    return result.recordset;


  } catch (error) {
    console.error('Error:', error);
  }
});

//===========================
// Full user Deatil insert API END
//===========================


//===========================
// Fetch number of total students
//===========================


router.get('/api/v1/totalstudents/', async (req, res) => {
  console.log("ABC");
  try {
    // Connect to the database
    const pool = await sql.connect(config);

    // Execute the query with the provided ID
    const findtotalstudents = await pool.request().query('SELECT * FROM SKM_Students');
    console.log(findtotalstudents.recordset.length, "findtotalstudents");

    const findtotalschool = await pool.request().query(`SELECT * FROM SKM_Institute WHERE type = 'School'`);
    console.log(findtotalschool.recordset.length, "findtotalschool");

    const findtotalcollage = await pool.request().query(`SELECT * FROM SKM_Institute where type = 'Collage'`);
    console.log(findtotalcollage.recordset.length, "findtotalcollage");

    res.json({
      status: "success",
      studentlength: findtotalstudents.recordset.length,
      schoollength: findtotalschool.recordset.length,
      collagelength: findtotalcollage.recordset.length
    });

    // Close the database connection
    await sql.close();

  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).json({ message: 'An error occurred while fetching data.' });
  }
});

router.put("/api/v1/updateMasterData/:Id", async (req, res) => {
  console.log("Hello");
  try {
    await sql.connect(config);

    const request = new sql.Request();
    const { data } = req.body;
    const Id = req.params.Id;


    const query = 'UPDATE MasterData SET Json = @data WHERE Id = @Id';

    // Set the values for the parameters
    request.input('Id', sql.NVarChar, Id);

    request.input('data', sql.NVarChar, data);

    // Execute the query
    const result = await request.query(query);

    // Check if the record was updated successfully
    if (result.rowsAffected[0] > 0) {
      console.log('Data updated successfully');
      res.status(200).json({
        status: "success",
      });
    } else {
      console.log('User not found or data not updated');
      res.status(404).json({
        status: "failed",
        message: "User not found or data not updated",
      });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  } finally {
    try {
      // Close the connection
      await sql.close();
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});


router.get("/api/v1/MastergetFetchData/:id", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const id = req.params.id;
    const request = new sql.Request();
    const query = `SELECT * FROM MasterData WHERE Id = @id`;
    request.input('id', sql.NVarChar, id);
    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: {
        data: result.recordset
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  } finally {
    try {
      // Check if the pool is not already closed or in the process of connecting
      if (sql && sql._pool && sql._pool.connections.length > 0) {
        // Close the connection pool
        await sql.close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
});



router.get("/api/v1/volunteerlist2", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_MasterVolunteer`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});



//===========================
// Students Detail by ID fetch
//===========================


router.get('/api/v1/fetchstudentdetailbyid/:id', async (req, res) => {
  console.log("ABC")
  try {
    const id = req.params.id;

    // Connect to the database
    await sql.connect(config);

    // Execute the query with the provided ID
    const result = await sql.query(`SELECT * FROM SKM_Students WHERE id = ${id}`);

    // Close the database connection
    await sql.close();

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'No data found for the provided ID.' });
    }
  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).json({ message: 'An error occurred while fetching data.' });
  }
});


router.post('/search', async (req, res) => {
  // Get the input value from the query parameter
  const inputValue = req.body.M_Aadhar_No;

  const response = {
    status: 'success',
    data: [
      {
        "json": "{ \"Family_Code\": 123, \"Category\": \"Select any Category\", \"Father_Name\": \"asasd\", \"F_Aadhar_No\": \"4534534\", \"Grandfather_Name\": \"4353453d\", \"Mother_Name\": \"rgrg\", \"M_Aadhar_No\": \"45645645\" }"
      },
      {
        "json": "{ \"Family_Code\": 123, \"Category\": \"Select any Category\", \"Father_Name\": \"asasd\", \"F_Aadhar_No\": \"453453sd4\", \"Grandfather_Name\": \"4353453sdd\", \"Mother_Name\": \"rgrg\", \"M_Aadhar_No\": \"45645sd645\" }"
      }
    ]
  };

  // Array to store matched JSON entries
  const matchedEntries = [];

  // Iterate over each entry and search for a match
  for (const entry of response.data) {
    // Parse the JSON content
    const jsonContent = JSON.parse(entry.json);

    // Search for a match in the "F_Aadhar_No" or "M_Aadhar_No" fields
    for (const field of ['F_Aadhar_No', 'M_Aadhar_No']) {
      if (jsonContent[field] && jsonContent[field] === inputValue) {
        // Add the matched entry to the array
        matchedEntries.push(jsonContent);
        break;
      }
    }
  }

  // Return the matched entries or a message indicating no match was found
  if (matchedEntries.length > 0) {
    res.json(matchedEntries);
  } else {
    res.json({ message: 'No match found.' });
  }
});



//===========================
// List School API START
//===========================


router.get("/api/v1/fetchfamily", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {
      console.log('Lsit Function Start');

      // Insert a new record into the table
      const selectQuery = `
   SELECT json FROM SKM_Family`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});



//===========================
// List School API END
//===========================





//===========================
// List Studnets API START
//===========================


router.get("/api/v1/fetchstudentlist/:userid", async (req, res) => {
  try {
    const userId = req.params.userid;

    // Connect to the database
    await sql.connect(config);

    // Execute the query
    const result = await sql.query(`SELECT json FROM SKM_Students WHERE Userid = ${userId}`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});

//===========================
// List Studnets API END
//===========================

//===========================
// get school info API START
//===========================


router.get("/api/v1/getinstituteinfo/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Connect to the database
    await sql.connect(config);

    // Execute the query
    const result = await sql.query(`SELECT json FROM SKM_Institute WHERE id = ${userId}`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});


//===========================
// List Studnets API END
//===========================

//===========================
// List School API START
//===========================


router.get("/api/v1/schoolrecordlist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {
      console.log('List Function Start');

      // Insert a new record into the table
      const selectQuery = `
   SELECT id, Json,CatgCode FROM MasterData`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        ok: true,
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});



//===========================
// List School API END
//===========================



//===========================
// List User API START
//===========================


router.get("/api/v1/userlist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {
      console.log('Lsit Function Start');

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM User`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});



//===========================
// List User API END
//===========================





//===========================
// List volunteer API START
//===========================


router.get("/api/v1/volunteerlist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM SKM_Volunteer`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});



//===========================
// List User API END
//===========================







//===========================
// List Basti API END
//===========================










//===========================
// Volunteers API START
//===========================


router.post("/api/v1/volunteers", async (req, res) => {

  const { tutorjson } = req.body;

  // Connect to the database
  sql.connect(config)
    .then(() => {
      // console.log('Connected to the Azure SQL Database');

      // Insert a new record into the table
      const insertQuery = `
    INSERT INTO SKM_Volunteer (json)
    VALUES (@value1)
  `;
      const request = new sql.Request();
      request.input('value1', sql.Text, tutorjson);

      return request.query(insertQuery);
    })
    .then(result => {
      console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: tutorjson
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});



//===========================
// Vendor API START
//===========================



// Add new vendor 

router.post("/api/v1/addvendor", async (req, res) => {

  const { CatgCode, data } = req.body;

  // Connect to the database
  sql.connect(config)
    .then(() => {
      // console.log('Connected to the Azure SQL Database');

      // Insert a new record into the table
      const insertQuery = `
    INSERT INTO MasterData (CatgCode,Json)
    VALUES (@value1, @value2)
  `;
      const request = new sql.Request();
      request.input('value1', sql.Text, CatgCode);
      request.input('value2', sql.Text, data);
      return request.query(insertQuery);
    })
    .then(result => {
      console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: data
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});



// List Vendor List

router.get("/api/v1/vendorlist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `SELECT * FROM v_MasterVendor`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});

// Delete vendor

router.delete("/api/v1/vendordelete", async (req, res) => {
  const { id } = req.body;

  try {
    // Connect to the database
    await sql.connect(config);

    // Execute the DELETE query
    const deleteQuery = `
      DELETE FROM SKM_Vendor
      WHERE id = @id`;

    const request = new sql.Request();
    request.input('id', sql.Int, id);

    const result = await request.query(deleteQuery);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Entry deleted successfully' });
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the connection
    sql.close();
  }
});


// Update Vendor single


//===========================
// Data Update API END
//===========================
router.put("/api/v1/vendorrecord/:id", async (req, res) => {
  const { id } = req.params;
  const { tutorjson, type } = req.body;

  // Check if tutorjson is a valid non-empty object
  if (typeof tutorjson !== 'object' || tutorjson === null) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid or empty tutorjson object',
    });
  }

  // Convert the tutorjson object to a JSON string
  const tutorjsonString = JSON.stringify(tutorjson);

  // Connect to the database
  sql.connect(config)
    .then(() => {
      // Update the record in the table
      const updateQuery = `
        UPDATE SKM_Vendor
        SET json = @value1, type = @value2
        WHERE id = @recordId
      `;
      const request = new sql.Request();
      request.input('value1', sql.Text, tutorjsonString);
      request.input('value2', sql.Text, type);
      request.input('recordId', sql.Int, id);

      return request.query(updateQuery);
    })
    .then(result => {
      if (result.rowsAffected[0] > 0) {
        console.log('Data updated successfully');
        res.status(200).json({
          status: "success",
          data: {
            id: parseInt(id),
            tutorjson: tutorjson,
            type: type
          }
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Record not found"
        });
      }
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
      res.status(500).json({
        status: "error",
        message: "Internal Server Error"
      });
    });
});




// get vendor info API START

router.get("/api/v1/getvendor/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Connect to the database
    await sql.connect(config);

    // Execute the query
    const result = await sql.query(`SELECT json FROM v_MasterVendor WHERE id = ${userId}`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});





//===========================
// End Vendor List
//===========================




//===========================
// Inst ADD API START
//===========================


// Inst add api 


// List Vendor List

router.get("/api/v1/instlist2", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_MasterInstitute`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});




// List Vendor List

router.get("/api/v1/tutorlist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_MasterTutor`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});


router.get("/api/v1/studentprofilelist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_StudentProfile`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});


router.get("/api/v1/studentaddresslist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_StudentAddress`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});


router.get("/api/v1/studentinstitutionlist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_StudentInstitute`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});


router.get("/api/v1/studentDocsList", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `SELECT * FROM v_DocumentUpload`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});
router.get("/api/v1/studentreportcardlist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_StudentReportCard`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});



router.get("/api/v1/studentfamilylist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_StudentFamily`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});

router.get("/api/v1/studentacademiclist", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_StudentAcademic`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});


router.get("/api/v1/bastilist2", async (req, res) => {

  // Connect to the database
  sql.connect(config)
    .then(() => {

      // Insert a new record into the table
      const selectQuery = `
   SELECT * FROM v_MasterBasti`;
      const request = new sql.Request();

      return request.query(selectQuery);
    })
    .then(result => {
      // console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: result.recordset
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});




//===========================
// Inst ADD API End
//===========================




//===========================
// BASTI ADD API START
//===========================


router.post("/api/v1/basti", async (req, res) => {

  const { tutorjson } = req.body;

  // Connect to the database
  sql.connect(config)
    .then(() => {
      // console.log('Connected to the Azure SQL Database');

      // Insert a new record into the table
      const insertQuery = `
    INSERT INTO SKM_Basti (json)
    VALUES (@value1)
  `;
      const request = new sql.Request();
      request.input('value1', sql.Text, tutorjson);

      return request.query(insertQuery);
    })
    .then(result => {
      console.log('Data inserted successfully');
      res.status(200).json({
        status: "success",
        data: tutorjson
      });
      // Close the connection
      sql.close();
    })
    .catch(err => {
      console.error('Error:', err);
      sql.close();
    });
});


//===========================
// Volunteers API END
//===========================




// Image Uplaod API 

router.post("/api/v1/profileupload", async (req, res) => {
  console.log("upload start")
  try {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    console.log("upload start")
    const newpath = path.join(__dirname, '../public/img/');
    console.log(newpath, req.files, ' : path');
    const file = req.files.fileabc;
    const originalFilename = file.name;
    console.log("upload start after files")

    // Generate a unique ID (timestamp in this example) and append it to the filename
    const uniqueId = Date.now();
    const filename = `${uniqueId}_${originalFilename}`;

    file.mv(`${newpath}${filename}`, (err) => {
      if (err) {
        res.status(500).send({ message: "File upload failed", code: 200 });
      }
      const imageUrl = `https://nishkamsikligarback.onrender.com/img/${filename}`; // Relative URL to the uploaded image
      res.status(200).send({ message: "File Uploaded", code: 200, imageUrl })
    });


  } catch (err) {
    console.log(err);
  }
});


// Image Uplaod API 

router.post("/api/v1/documentverify", async (req, res) => {
  console.log("upload start doc")
  try {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    console.log("upload start")
    const newdocpath = path.join(__dirname, '../public/img/');
    console.log(newdocpath, req.files, ' : path');
    const filedoc = req.files.filexyz;
    const originaldocFilename = filedoc.name;
    console.log("upload start after files")

    // Generate a unique ID (timestamp in this example) and append it to the filename
    const uniquedocId = Date.now();
    const docfilename = `${uniquedocId}_${originaldocFilename}`;

    filedoc.mv(`${newdocpath}${docfilename}`, (err) => {
      if (err) {
        res.status(500).send({ message: "File upload failed", code: 200 });
      }
      const imageUrl = `https://nishkamsikligarback.onrender.com/img/${docfilename}`; // Relative URL to the uploaded image
      res.status(200).send({ message: "File Uploaded", code: 200, imageUrl })
    });


  } catch (err) {
    console.log(err);
  }
});




//========================
// Delete SKM_Institute API 
//========================
router.delete("/api/v1/delete-entry", async (req, res) => {
  const { id } = req.body;

  try {
    // Connect to the database
    await sql.connect(config);

    // Execute the DELETE query
    const deleteQuery = `
      DELETE FROM SKM_Institute
      WHERE id = @id`;

    const request = new sql.Request();
    request.input('id', sql.Int, id);

    const result = await request.query(deleteQuery);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Entry deleted successfully' });
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the connection
    sql.close();
  }
});


//========================
// Delete User API 
//========================
router.delete("/api/v1/userdelete", async (req, res) => {
  const { id } = req.body;

  try {
    // Connect to the database
    await sql.connect(config);

    // Execute the DELETE query
    const deleteQuery = `
      DELETE FROM User
      WHERE id = @id`;

    const request = new sql.Request();
    request.input('id', sql.Int, id);

    const result = await request.query(deleteQuery);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Entry deleted successfully' });
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the connection
    sql.close();
  }
});





//===========================
// register root
//===========================
router.post("/api/v1/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  let hashedpassword = await bcrypt.hash(password, 10);
  sql.connect(config)
    .then((pool) => {
      // Check if email already exists
      const emailExistsQuery = `
        SELECT COUNT(*) AS count
        FROM User
        WHERE Email = @email;
      `;

      const emailExistsRequest = pool.request();
      emailExistsRequest.input('email', sql.NVarChar(50), email);

      emailExistsRequest.query(emailExistsQuery, (emailExistsErr, emailExistsResult) => {
        if (emailExistsErr) {
          console.error('Error while checking email existence:', emailExistsErr);
          res.status(500).send('Error while checking email existence');
          sql.close();
          return;
        }

        const emailExists = emailExistsResult.recordset[0].count > 0;

        if (emailExists) {
          res.status(400).json({
            status: "success",
            message: "Email already exists"
          });
          // res.status(400).send('Email already exists');
          sql.close();
          return;
        }

        // Insert user into the database
        const insertQuery = `
          INSERT INTO User (name, email, password, role)
          VALUES (@name, @email, @password, @role);
        `;

        const insertRequest = pool.request();
        insertRequest.input('name', sql.NVarChar(50), name);
        insertRequest.input('email', sql.NVarChar(50), email);
        insertRequest.input('password', sql.NVarChar(255), hashedpassword);
        insertRequest.input('role', sql.NVarChar(100), role);

        insertRequest.query(insertQuery, (insertErr) => {
          if (insertErr) {
            console.error('Error while inserting user:', insertErr);
            res.status(500).json({
              status: "success",
              message: "Error while inserting user"
            });
            // res.status(500).send('Error while inserting user');
          } else {
            res.status(200).json({
              status: "success",
              message: "User created successfully"
            });
            // res.status(200).send('User created successfully');
          }

          sql.close();
        });
      });
    })
    .catch((err) => {
      console.error('Error connecting to the database:', err);
      res.status(500).send('Error connecting to the database');
    });
});



//===========================
// Email Logi
//===========================
router.post("/api/v1/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const pool = await sql.connect(config);

    const query = `
      SELECT Id, Role, Password
      FROM Users
      WHERE Email = @email;
    `;

    const request = pool.request();
    request.input('Email', sql.NVarChar(50), Email);

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }

    const hashedPassword = result.recordset[0].Password;
    const passwordMatch = await bcrypt.compare(Password, hashedPassword);

    if (passwordMatch) {
      const dataabc = {
        user: {
          id: result.recordset[0].Id,
        }
      };

      const authToken = jwt.sign(dataabc, jwrsecret);

      return res.status(200).json({
        status: true,
        authToken: authToken,
        UserId: result.recordset[0].Id,
        Userrole: result.recordset[0].Role,
        message: "Login successful"
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({
      status: false,
      message: "Error during login"
    });
  } finally {
    sql.close();
  }
});


// Normal login
router.post("/api/v1/business/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        status: "failure",
        redirect: "/login"
      });
    }
    return res.status(200).json({
      status: "success",
      data: user,
      redirect: "/"
    });
  })(req, res, next);
}
);


router.get("/api/v1/fetchAllStudentSummary", async (req, res) => {
  try {
    // Connect to the SQL Server database
    const pool = await sql.connect(config);
    const request = new sql.Request();

    const query = 'SELECT * FROM v_StudentDataSummary';
    // Execute the query
    const result = await request.query(query);

    res.status(200).json({
      status: "success",
      data: result.recordset,
    });

    // Close the SQL connection pool
    await pool.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// get Single Student Details

router.get("/api/v1/fetchSingleStudentDetail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Connect to the database
    await sql.connect(config);

    // Execute the query
//    const result = await sql.query(`SELECT * FROM v_StudentData WHERE profileid = 276`);
    const result = await sql.query(`SELECT * FROM v_StudentData WHERE profileid = ${id}`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});

// get Progress Summary

router.get("/api/v1/fetchProgressReport", async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Execute the query
    const result = await sql.query(`SELECT * FROM v_ProgressReport`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});

// get Dashboard summary

router.get("/api/v1/fetchDashboardSummary", async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Execute the query
    const result = await sql.query(`SELECT * FROM v_ReportDB_WithTotal order by state`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});

router.get("/api/v1/fetchDonorData", async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Execute the query
    const result = await sql.query(`SELECT * FROM v_Donor`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});


router.get("/api/v1/fetchDonorBeneficiaryData_All", async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Execute the query
    const result = await sql.query(`SELECT * FROM v_DonorBeneficiaryData_All`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});

router.get("/api/v1/fetchDonorBeneficiaryData_Sponsored", async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Execute the query
    const result = await sql.query(`SELECT * FROM v_DonorBeneficiaryData_Sponsored`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});

router.get("/api/v1/fetchDonorBeneficiaryData_UnSponsored", async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Execute the query
    const result = await sql.query(`SELECT * FROM v_DonorBeneficiaryData_UnSponsored`);

    // Close the database connection
    await sql.close();

    // Send the JSON data as the response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving data from the database.');
  }
});


module.exports = router;