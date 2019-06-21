const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
  .then(() => console.log('MongoDB is connected...'))
  .catch(err => console.log('Could not connect MongoDB...', err))

const courseSchema = new mongoose.Schema({
  name: {type: String, required: true},
  author: String,
  tags: [String],
  date: { type: String, default: Date.now },
  isPublished: Boolean, 
  // price: { type: Number, required: () => {
  //   console.log(this)
  // }}
  price: { 
    type: Number,
    required: function () { return this.isPublished }
  }
})

const Course = mongoose.model('course', courseSchema)

// async function getData() {
//   const courses = await Course.find()
//   console.log(courses)
// }

// getData()

async function creteCourse() {
  const course = new Course({
    // name: 'Node.js',
    author: 'Hey',
    tags: ['test'],
    isPublished: true,
    // price: 888
  })
  try {
    const result = await course.save()
    // console.log(result)

    // Validate 方法返回一个空的 Promise，也就是说没有任何返回值
    // await course.Validate()
  }
  catch (ex) {
    console.log('ex: ', ex.message)
  }
}
creteCourse()