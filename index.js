require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Phone = require('./models/phone')

morgan.token('personNameAndNumber', (request) => {
  const { name, number } = request.body 
  return `{"name": "${name}", "number": "${number}"}` 
})


const handleMiddleware = (request, response, next) => {
  if (request.method === 'POST') {
    morgan(':method :url :status :response-time[3] :personNameAndNumber')(request, response, next)
  } else {
    morgan('tiny')(request, response, next)
  }
}

app.use(express.static('dist'))
app.use(express.json())
app.use(handleMiddleware)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

let persons = [
]


app.get('/api/persons', (request, response) => {
    //ex 3.13
    Phone.find({}).then(phones => {
      response.json(phones)
    })
})

app.get('/info', (request, response) => {
    const count = Object.keys(persons).length
    request.startTime = new Date();
    const receivedTime = request.startTime.toLocaleString()
    response.send(`<div>Phone book has infor for ${count} people </br>${receivedTime}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
  //ex 3.18
  Phone.findById(request.params.id)
    .then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(204).end()
      }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  //ex 3.15
  Phone.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {
  const body = request.body 

  const phone = new Phone({
    name: body.name, 
    number: body.number,
  })

  phone.save().then(savedPhone => {
    response.json(savedPhone)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body 
  console.log('body: ', body)

  const phone = {
    name: body.name,
    number: body.number 
  }

  Phone.findByIdAndUpdate(request.params.id, phone, { new: true })
    .then(updatedPhone => {
      response.json(updatedPhone)
    })
    .catch(error => next(error))
})

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}\n`)
})