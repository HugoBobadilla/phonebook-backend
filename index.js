const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()
const Contact = require('./models/contact')
const errorHandler = require('./middlewares/ErrorHandler')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
// app.use(morgan(':method :url :body'));


app.get('/api/contacts', (req, res) => {
  Contact.find({})
    .then(contacts => {
      res.json(contacts)
    })
})

app.get('/api/contacts/:id', (req, res, next) => {
  const id = req.params.id
  Contact.findById(id)
    .then(contact => {
      res.json(contact)
    })
    .catch(error => next(error))
})

app.post('/api/contacts', (req, res, next) => {
  const body = req.body
  if(body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: 'name and number are required'
    })
  }
  const contact = new Contact({
    name: body.name,
    number: body.number
  })
  contact.save()
    .then(savedContact => {
      res.json(savedContact)
    })
    .catch(error => next(error))
  // const contactExists = contacts.find(c => c.name === body.name)

  // if(!body.name || !body.number) {
  //   res.status(400).json({
  //     error: 'name and number are required'
  //   })
  // } else if(contactExists) {
  //     res.status(400).json({
  //       error: 'name must be unique'
  //     })
  // } else {
  //   const contact = {
  //     name: body.name,
  //     number: body.number,
  //     id: Math.floor(Math.random() * 100000000)
  //   }
  //   contacts = [...contacts, contact]
  //   res.json(contact)
  // }
})
// morgan.token('body', request => JSON.stringify(request.body))

app.delete('/api/contacts/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/contacts/', async (req, res, next) => {
  const body = req.body
  let contactToUpdate = await Contact.find({ name: body.name })
  // if(!contactToUpdate) {
  //   res.status(404).json({ error: 'Contact not found'})
  // }
  const contact = {
    name: contactToUpdate[0].name,
    number: body.number
  }

  console.log(contact)

  Contact.findByIdAndUpdate(contactToUpdate[0].id, contact, { new: true })
    .then(updatedContact => {
      console.log(updatedContact)
      res.json(updatedContact)
    })
    .catch(error => {
      next(error)
    })
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`)
})