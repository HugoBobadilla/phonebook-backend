const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
// app.use(morgan(':method :url :body'));

let contacts = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/api/contacts', (req, res) => {
  return res.json(contacts)
})

app.get('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id)
  const contact = contacts.find(c => c.id === id)
  if(!contact) {
    res.status(404).end()
  } else {
    res.json(contact)
  }
})

app.post('/api/contacts', (req, res) => {
  const body = req.body
  const contactExists = contacts.find(c => c.name === body.name)

  if(!body.name || !body.number) {
    res.status(400).json({
      error: 'name and number are required'
    })
  } else if(contactExists) {
      res.status(400).json({
        error: 'name must be unique'
      })
  } else {
    const contact = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 100000000)
    }
  
    contacts = [...contacts, contact]
    res.json(contact)
  }
  
})
// morgan.token('body', request => JSON.stringify(request.body))

app.delete('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id)
  contacts = contacts.filter(c => c.id !== id)
  res.status(204).end()
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`)
})