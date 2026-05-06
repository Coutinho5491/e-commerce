const express = require('express');   /*criar um sistema que escuta requisições*/
const cors = require('cors');         

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();                  /*criar um sistema que escuta requisições*/  

app.use(cors());            /*Front (HTML) converse com o backend*/
app.use(express.json());    /*Permite receber dados em formato JSON*/

/*----------------------------------*/

app.post('/auth/login', async (req, res) => {           /*Sistema de login, 'cria uma rota'*/
  const { email, password } = req.body;                  /*pega o que o usuário digitou no front*/

  const user = users.find(u => u.email === email);                        /*Verifica se o e-mail existe*/

  if (!user) {
    return res.status(400).json({ error: 'Usuário não encontrado' });
  }

  const validPassword = await bcrypt.compare(password, user.password);            /*senha é criptografada*/

  if (!validPassword) {
    return res.status(400).json({ error: 'Senha inválida' });
  }

  const token = jwt.sign({ id: user.id }, 'segredo');            /* usuário está autenticado */

  res.json({ token });                           /* manda o token de volta */
});

/*----------------------------------*/

/*---------------------------------SCRIPT PARA CADASTRO----------------------------*/

app.post('/auth/register', async (req, res) => {        /*Quando alguém fizer um POST em /auth/register, execute*/

  const { name, email, password, cpf } = req.body;          /*pega o que o usuário digitou*/

  // Verificar se o email já existe

  const userExists = users.find(u => u.email === email);    /*Procura no array “banco”*/

  if (userExists) {                                             /*Se já existir, para e retorna erro*/
    return res.status(400).json({ error: 'Usuário já existe' });   
  }

  // Verifica se o CPF ja existe
const cpfExists = users.find(u => u.cpf === cpf);            // procura se cpf já existe cadastrado

  if (cpfExists) {                                              // Se existir é bloqueado
    return res.status(400).json({ error: 'CPF já cadastrado' });
  }  

  /*----------------------------------*/

  const hashedPassword = await bcrypt.hash(password, 10);         /*Criptografa a senha*/

  const newUser = {                                   /*criando o usuario*/
    id: users.length + 1,
    name,
    email,
    cpf,
    password: hashedPassword
  };

  users.push(newUser);          /*Adiciona no array "BANCO")*/

  res.status(201).json({ message: 'Usuário criado com sucesso' });      /*resposta para o front*/

});

/*---------------------------------FIM SCRIPT PARA CADASTRO----------------------------*/

/*---------------------------------------*/

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000'); /*Sistema irá rodar na porta 3000 'http://localhost:3000'*/
});

/*----------------------------------*/

const users = [
  {
    id: 1,
    email: "teste@email.com",
    password: "$2b$10$Q.1xjrQbi1kTqIfKyLVALeBQHPgEvX0afTHuk4T1wyrnKYYX7S/1u"
  }
];

/*----------------------------------*/
