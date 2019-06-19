const mongoose = require('mongoose').set('debug', true)

mongoose.connect('mongodb://localhost/mongo-exercises', {useNewUrlParser: true})
  .then(() => console.log('MongoDB is connected...'))
  .catch(err => console.log('Could not connect MongoDB...', err))

const courseSchema = new mongoose.Schema({
  name: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  author: String,
  isPublished: Boolean
})

const Course = mongoose.model('course', courseSchema)

// 删除单个
async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id })
  console.log(result)
}
// removeCourse('5a68fdc3615eda645bc6bdec')

// 删除多个
async function removeCourse(author) {
  const result = await Course.deleteMany({ author })
  console.log(result)
}
removeCourse('Mosh')

// 得到被删除的文档
async function removeCourse(id) {
  const course = await Course.findByIdAndRemove(id)
  console.log(course)
}
removeCourse('5a68fdc3615eda645bc6bdec')