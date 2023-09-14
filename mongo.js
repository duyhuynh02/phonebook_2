const mongoose = require('mongoose')

let password = ''

if (process.argv.length < 3) {
    console.log('give password or name/phone as arguments')
    process.exit(1)
} else if (process.argv.length < 4) {
    password = process.argv[2]
} else if (process.argv.length < 6) {
    password = process.argv[2]
}

url = `mongodb+srv://imnikz:${password}@cluster0.pra6dob.mongodb.net/addPhone?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

if (process.argv.length > 3) {
    const phone = new Phone({
        name: process.argv[3],
        number: process.argv[4]
    })

    phone.save().then(result => {
        console.log(`add ${phone.name} number ${phone.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Phone.find({}).then(result => {
        result.forEach(phone => {
            console.log(phone)
        })
        mongoose.connection.close()
    })
}

