/*--------------IMPORTS--------------------*/

const { Pool } = require('pg');
const express = require('express');   /*criar um sistema que escuta requisições*/
const cors = require('cors');         

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();                  /*criar um sistema que escuta requisições*/  

app.use(cors());            /*Front (HTML) conversa com o backend*/
app.use(express.json());    /*Permite receber dados em formato JSON*/

/*-------------CONEXÃO POSTGRESQL---------------------*/

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: '947t#eE@65',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Conectado ao PostgreSQL'))
  .catch(err => console.error('Erro ao conectar', err));

/*----------------------------------*/

app.post('/auth/login', async (req, res) => {           /*Sistema de login, 'cria uma rota'*/

  try {

    const { email, password } = req.body;           /*pega o que o usuário digitou no front*/

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',            
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        error: 'Usuário não encontrado'
      });
    }

    const validPassword = await bcrypt.compare(
      password,                                                  /*senha é criptografada*/
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        error: 'Senha inválida'
      });
    }

    const token = jwt.sign(
      { id: user.id },                            /* usuário está autenticado */
      'segredo'
    );

    res.json({ token });                         /* manda o token de volta */

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Erro no servidor'
    });
  }
});

/*----------------------------------*/

/*---------------------------------SCRIPT PARA CADASTRO----------------------------*/



app.post('/auth/register', async (req, res) => {

  const { name, email, password, cpf } = req.body;

  try {

    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR cpf = $2',
      [email, cpf]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        error: 'E-mail ou CPF já cadastrado'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, cpf, password) VALUES ($1, $2, $3, $4)',
      [name, email, cpf, hashedPassword]
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Erro no servidor'
    });
  }
});



/*---------------------------------FIM SCRIPT PARA CADASTRO----------------------------*/

/*---------------------------------------*/

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000'); /*Sistema irá rodar na porta 3000 'http://localhost:3000'*/
});

/*------------ROTA API PRODUTOS----------------------*/

app.get('/products', async (req, res) => {

  try {

    const result = await pool.query(
      'SELECT * FROM products'
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Erro ao buscar produtos'
    });
  }
});

/*----------------------------------*/
