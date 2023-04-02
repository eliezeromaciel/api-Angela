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



app.put('/departamento/:idDepartamento', (req, res) => {
  const { idDepartamento } = req.params
  const { nome, sigla } = req.body
    
  if (nome && sigla) {
    con.query(`UPDATE DEPARTAMENTOS SET nome='${nome}', sigla='${sigla}' WHERE id_departamento='${idDepartamento}'`, (err, result) => {
      if (err) {
        res.status(500)
        res.send(err)
        return  // sem esse retorno, quebra a aplica;çao. pois ela vai tentar continuar executando os código abaixo. 
      }
          
      if (result.changedRows ==! 0) {
        res.send({
          message: 'NOME e SIGLA modified with success',
        })
      }
      else {res.send({
        message: 'register not modified'
      })}
    })
    return
  }

  if (nome){
    con.query(`UPDATE DEPARTAMENTOS SET nome='${nome}' WHERE id_departamento='${idDepartamento}'`, (err, result) => {
      if (err) {
        res.status(500)
        res.send(err)
        return  // sem esse retorno, quebra a aplica;çao. pois ela vai tentar continuar executando os código abaixo. 

      }
    
      if (result.changedRows ==! 0) {
        res.status(200)
        res.send({
          message: 'NOME modified with success',
        })
      }
      else {
        res.status(400)
        res.send({
          message: 'register not modified'
        })}
    })
    return
  }

  if (sigla){
    con.query(`UPDATE DEPARTAMENTOS SET sigla='${sigla}' WHERE id_departamento='${idDepartamento}'`, (err, result) => {
      if (err) {
        res.status(500)
        res.send(err)
        return  // sem esse retorno, quebra a aplica;çao. pois ela vai tentar continuar executando os código abaixo. 

      }
      
      if (result.changedRows ==! 0) {
        res.send({
          message: 'SIGLA modified with success',
        })
      }
      else {res.send({
        message: 'register not modified'
      })}
    })
    return
  }
})
  
app.delete('/departamento/:idDepartamento',  (req, res) => {
  const { idDepartamento } = req.params


  con.query(`DELETE FROM DEPARTAMENTOS WHERE id_departamento='${idDepartamento}'`, (err, result) => {
    if (err) {
      res.status(500)
      res.send(err)
      return  // sem esse retorno, quebra a aplica;çao. pois ela vai tentar continuar executando os código abaixo. 
    }
    
    if (result.affectedRows ==! 0) {
      res.status(200)
      res.send({
        message: 'DEPTO deleted with success',
      })
    }
    else {
      res.status(400)
      res.send({      
        message: 'Deleted not executed'
      })
    }
  })
  return
})




// exemplo utilizando diversos formatos de parametros (feitos por mim)
// app.get('/funcionarios:busca', (req, res) => {
//   const {busca} = req.params
  
//   con.query(`SELECT * FROM FUNCIONARIOS WHERE nome LIKE '%${busca}%' `, (err, result) => {
//     if (err) {
//       res.send(err)
//     }
//     res.send(result)
//   })
// })



app.get('/funcionarios/:busca', (req, res) => {
  const { busca } = req.params
  const { exact, searchField } = req.body
  const strLike = exact ? `= '${busca}'` : `LIKE '%${busca}%'`
  const query = `SELECT * FROM FUNCIONARIOS WHERE ${searchField} ${strLike}`


  con.query(query, (err, result) => {
    if (err) {
      res.send(err)
    }
    res.send(result)
  })
})



// // LISTA TODOS CLIENTES e SEUS TELEFONES

// app.get('/clientesetelefones', (req, res) => {
//   if (useMock) {
//     res.send('listarDepartamentosMOCK')
//     return  
//   }

//   con.query(`SELECT clientes.nome, clientes.id_cliente, telefones.numero
//     FROM 
// 		  CLIENTES
// 	  INNER JOIN TELEFONES
//     ON clientes.id_cliente = telefones.id_cliente;`, (err, result) => {
//     if (err) {
//       res.status(500)
//       res.send(err)
//     }
//     res.send(result)
//   })
// })
app.listen(3033, () => {
  console.log('Server is running!')
})