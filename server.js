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


// LISTA TODOS CLIENTES
app.get('/clientes', (req, res) => {
  if (useMock) {
    res.send('usar o mock')
    return  
  }

  con.query('SELECT * FROM CLIENTES', (err, result) => {
    if (err) {
      res.status(500)
      res.send(err)
    }
    res.send(result)
  })
})

// LISTA TODOS CLIENTES e SEUS TELEFONES
app.get('/clientesetelefones', (req, res) => {
  if (useMock) {
    res.send('listarDepartamentosMOCK')
    return  
  }

  con.query(`SELECT clientes.nome, clientes.id_cliente, telefones.numero
    FROM 
		  CLIENTES
	  INNER JOIN TELEFONES
    ON clientes.id_cliente = telefones.id_cliente;`, (err, result) => {
    if (err) {
      res.status(500)
      res.send(err)
    }
    res.send(result)
  })
})

// ADICIONA NOVA CLIENTE
app.post('/clientes', (req, res) => {
  if (useMock) {
    res.send('listarDepartamentoMOCK sei la lkalj;lkjaohaiu')
    return  
  }

  const { nome } = req.body
  
  if (nome){  
    con.query(`INSERT INTO CLIENTES (nome) VALUES ('${nome}')`, (err, result) => {
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
  



/**
 * @swagger
 * 
 * /departamento/{idDepartamento}:
 *  delete:
 *    description: deleta um departamento na base de dados com base no ID do departamento especificado na URL.
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: idDepartamento
 *        description: ID do departamento a ser deletado.
 *        required: true
 *        type: integer
 *    responses:
 *      200:
 *        description: Departamento deletado com sucesso.
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: DEPTO deleted with success.
 *      400:
 *        description: Requisição inválida.
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Deleted not executed.
 *      500:
 *        description: Erro de banco de dados.
 */
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


// Exemplo utilizando diversos formatos de parametros professor
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


app.listen(3033, () => {
  console.log('Server is running!')
})