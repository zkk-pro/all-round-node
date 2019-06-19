const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('Could not connect to MongoDB...', err))

const courseSchema = new mongoose.Schema({
  name: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  author: String,
  isPublished: Boolean
})

const Course = mongoose.model('course', courseSchema)

async function getCourses () {
  return await Course
    // .find({ isPublished: true, tags: { $in: ['backend', 'frontend'] } })
    .find({ isPublished: true })
    .or([ { tags: 'backend'}, {tags: 'frontend'} ])
    .sort('-price')
    // .select({name: 1, author: 1})
    .select('name')
}
async function run () {
  const courses = await getCourses()
  console.log(courses)
}
run()