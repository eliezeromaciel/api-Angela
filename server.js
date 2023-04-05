import express from 'express'
import bodyParser from 'body-parser'
import con from './connect-db.js'
// import listarDepartamentosMOCK from './mock/listarDepartamentoMOCK.json' assert {type: 'json'}

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// configuração mínima para uso do SWAGGER
const options = {
  definition: {
    info: {
      title: 'API NODE JS',
      version: '1.0.0'
    }
  },
  apis: ['server.js']
}
// especificacoes , chamando 
const swaggerSpec = swaggerJSDoc(options)
// criar rota para swagger ler nossa interface
// configurar minha api para usar o middwaler swagger pq tudo q for requisicao , todas as interpretacoes de rotas deverao passar também pelo swagger. 
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

const useMock = false


/**LISTA TODOS CLIENTES
 * @swagger
 * 
 * /clientes:
 *  get:
 *    description: lista todos os clientes, ordenados pelo ID.
 *    produces: 
 *      - application/json
 *    responses: 
 *      200:
 *        description: exibe todos os clientes, em um vetor.
 */
app.get('/clientes', (req, res) => {
  if (useMock) {
    res.send('usar o mock')
    return  
  }
  con.query('SELECT * FROM CLIENTE', (err, result) => {
    if (err) {
      res.status(500)
      res.send(err)
    }
    res.send(result)
  })
})

/**LISTA TODOS FUNCIONARIOS
 * @swagger
 * 
 * /funcionarios:
 *  get:
 *    description: lista todos os funcionarios, ordenados pelo ID.
 *    produces: 
 *      - application/json
 *    responses: 
 *      200:
 *        description: exibe todos os funcionarios, em um vetor.
 */
app.get('/funcionarios', (req, res) => {
  if (useMock) {
    res.send('usar o mock')
    return  
  }
  con.query('SELECT * FROM FUNCIONARIO', (err, result) => {
    if (err) {
      res.status(500)
      res.send(err)
    }
    res.send(result)
  })
})

/** ADICIONA NOVO CLIENTE 
 * @swagger
 * 
 * /clientes:
 *  post:
 *    description: Insere um cliente na base
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: formData
 *        name: nome
 *        description: nome do cliente 
 *        required: true
 *        type: string
 *      - in: formData
 *        name: telefone
 *        description: telefone do cliente (unique)
 *        required: true
 *        type: string
 *      - in: formData
 *        name: dataNascimento
 *        description: nascimento do cliente 
 *        required: true
 *        type: string
 *      - in: formData
 *        name: instagram
 *        description: instagram do cliente
 *        required: false
 *        type: string
 *    responses:
 *      200:
 *        description: registro inserido com sucesso
 *      500:
 *        description: erro do banco de dados
 */
app.post('/clientes', (req, res) => {
  if (useMock) {
    res.send('usar o mock')
    return  
  }

  const { nome, telefone, dataNascimento, instagram } = req.body

  // FAZ REQUEST SE TEM TODOS CAMPOS
  if (nome && telefone && dataNascimento && instagram){  
    con.query(`INSERT INTO Cliente (nome, telefone, dataNascimento, instagram) VALUES ('${nome}','${telefone}','${dataNascimento}', '${instagram}')`, (err, result) => {
      if (err) {
        res.status(500)
        res.send(err)
        return   
      }
  
      if (result.insertId) {
        res.send({
          message: 'Register inserted with success',
          insertId: result.insertId
        })  
        return
      }

      res.send(result)
    })
  }

  // FAZ REQUEST SEM CAMPO INSTAGRAM
  if (nome && telefone && dataNascimento && instagram === undefined){  
    con.query(`INSERT INTO Cliente (nome, telefone, dataNascimento) VALUES ('${nome}','${telefone}','${dataNascimento}')`, (err, result) => {
      if (err) {
        res.status(500)
        res.send(err)
        return   
      }
  
      if (result.insertId) {
        res.send({
          message: 'Register inserted with success',
          insertId: result.insertId
        })  
        return
      }

      res.send(result)
    })
  }

})

/** ADICIONA NOVO FUNCIONARIO 
 * @swagger
 * 
 * /funcionarios:
 *  post:
 *    description: Insere um funcionario na base
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: formData
 *        name: nome
 *        description: nome do funcionario 
 *        required: true
 *        type: string
 *      - in: formData
 *        name: telefone
 *        description: telefone do funcionario (unique)
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: registro inserido com sucesso
 *      500:
 *        description: erro do banco de dados
 */
app.post('/funcionarios', (req, res) => {
  if (useMock) {
    res.send('usar o mock')
    return  
  }
  const {nome, telefone} = req.body
  if (nome && telefone){  
    con.query(`INSERT INTO Funcionario (nome, telefone) VALUES ('${nome}','${telefone}')`, (err, result) => {
      if (err) {
        res.status(500)
        res.send(err)
        return   
      }
      if (result.insertId) {
        res.send({
          message: 'Register inserted with success',
          insertId: result.insertId
        })  
        return
      }
      res.send(result)
    })
  }
})

/** MODIFICA FUNCIONARIO
 * @swagger
 * /funcionario/{funcionarioId}:
 *  put:
 *    description: Atualiza um funcionario na base de dados com base no ID do funcionario especificado na URL.
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: funcionarioId
 *        description: ID do funcionario que será atualizado.
 *        required: true
 *        type: integer
 *      - in: body
 *        name: body
 *        description: Objeto JSON com as informações do funcionario a serem atualizadas.
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            nome:
 *              type: string
 *              description: Nome do funcionario
 *            telefone:
 *              type: string
 *              description: Telefone do funcionario.
 *    responses:
 *      200:
 *        description: Funcionario atualizado com sucesso.
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Funcionario atualizado com sucesso.
 *      400:
 *        description: Requisição inválida.
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: register not modified.
 *      500:
 *        description: Erro de banco de dados.
 */
app.put('/funcionario/:funcionarioId', (req, res) => {
  const {funcionarioId} = req.params
  const {nome, telefone} = req.body

  if (nome && telefone) {
    con.query(`UPDATE Funcionario SET nome='${nome}', telefone='${telefone}' WHERE funcionarioId='${funcionarioId}'`, (err, result) => {
      if(err) {
        res.status(500)
        res.send(err)
        return
      }
      if (result.changedRows ==! 0) {
        res.send({
          message: 'nome e telefone modified with success',
        })
      } else
      {res.send({
        message: 'register not modified'
      })
      }    })
    return
  }

  if (nome) {
    con.query(`UPDATE Funcionario SET nome='${nome}' WHERE funcionarioId='${funcionarioId}'`, (err, result) => {
      if(err) {
        res.status(500)
        res.send(err)
        return
      }
      if (result.changedRows ==! 0) {
        res.send({
          message: 'nome modified with success',
        })
      } else
      {res.send({
        message: 'register not modified'
      })
      }    })
    return
  }

  if (telefone) {
    con.query(`UPDATE Funcionario SET telefone='${telefone}' WHERE funcionarioId='${funcionarioId}'`, (err, result) => {
      if(err) {
        res.status(500)
        res.send(err)
        return
      }
      if (result.changedRows ==! 0) {
        res.send({
          message: 'telefone modified with success',
        })
      } else
      {res.send({
        message: 'register not modified'
      })
      }    })
    return
  }
} )

 






app.listen(3033, () => {
  console.log('Server is running!')
})