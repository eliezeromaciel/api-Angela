import jwt from 'jsonwebtoken'

const login = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1] // split necessário por causa do espaço entre bearer
    jwt.verify(token, process.env.JWT_KEY) 
    next()

  } catch (error) {
    res.status(401)
    res.send(error)
    return    
  }
}

export default login