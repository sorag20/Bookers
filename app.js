const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'mysqlpass',
  database: 'Pile_up'
});

  app.get('/', (req, res) => {
        res.render('top.ejs');
      });

  app.get('/list', (req, res) => {
        connection.query(
          'SELECT * FROM users',
          (error, results) => {
            res.render('list.ejs', { users: results });
          }
        );
      });

app.get('/register',(req,res)=>{
        res.render('register.ejs',{errors:[]});
      }
    );

app.post('/register', 
  (req, res, next) => {
    const Name = req.body.name;
    const total= req.body.total_pages;
    const errors = [];
    if (Name === '') {
      errors.push('本の題名が空です');
    }
    if (total=== '') {
      errors.push('総ページ数が空です');
    }
    if (errors.length > 0) {
      res.render('register.ejs', { errors: errors });
    } else {
      next();
    }
  },
  (req, res, next) => {
    const Name = req.body.name;
    const errors = [];
    connection.query(
      'SELECT * FROM users WHERE name = ?',
      [Name],
      (error, results) => {
        if (results.length > 0) {
          errors.push('すでに登録されています');
          res.render('register.ejs', { errors: errors });
        } else {
          next();
        }
      }
    );
  },
  (req, res) => {
    const Name = req.body.name;
    const total = req.body.total_pages;
    const finished = req.body.finished_pages;
    connection.query(
      'INSERT INTO users (name, total_pages, finished_pages) VALUES (?, ?, ?)',
      [Name, total, finished],
      (error, results) => {
          res.redirect('/list');
        }
      );
    });

    app.post('/delete/:id', (req, res) => {
      connection.query(
        'DELETE FROM users WHERE id = ?',
        [req.params.id],
        (error, results) => {
          res.redirect('/list');
        }
      );
    });
   
    app.get('/edit/:id', (req, res) => {
      connection.query(
        'SELECT * FROM users WHERE id = ?',
        [req.params.id],
        (error, results) => {
          res.render('edit.ejs', {book: results[0]});
        }
      );
    });

    app.post('/update/:id', (req, res) => {
      connection.query('update users set name=?,total_pages=?,finished_pages=?where id=?',
           [req.body.name,req.body.total_pages,req.body.finished_pages,req.params.id],
           (error,results)=>{
             res.redirect('/list');
           }
        );
    });
    
    





  app.listen(3000);
