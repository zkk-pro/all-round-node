const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
  .then(() => console.log('MongoDB is connected...'))
  .catch(err => console.log('Could not connect MongoDB...', err))

const courseSchema = new mongoose.Schema({
  // required验证器
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  author: String,
  // 自定义验证器
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0
      },
      message: 'have at least one tag'
    }
  },
  // 自定义异步验证器
  tags2: {
    type: Array,
    validate: {
      validator: function(v, callback) {
        return new Promise(function(resolve, reject) {
          setTimeout(() => {
            resolve(v && v.length > 0)
          }, 1000)
        })
      },
      message: 'have at least one tag'
    }
  },
  date: { type: String, default: Date.now },
  isPublished: Boolean, 
  // required验证器返回一个布尔值的函数
  price: { 
    type: Number,
    required: function () { return this.isPublished },
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
})

const Course = mongoose.model('course', courseSchema)

async function creteCourse() {
  const course = new Course({
    name: ' Node2.js  ',
    author: 'Hey2',
    tags: ['fontend2'],
    tags2: ['backend2'],
    isPublished: true,
    price: 8.888
  })
  try {
    const result = await course.save()
    console.log('result:', result)
    // Validate 方法返回一个空的 Promise，也就是说没有任何返回值
    // await course.Validate()
  }
  catch (ex) {
    // console.log('ex: ', ex.message)
    for (let field in ex.errors) {
      console.log(ex.errors[field].message)
    }
  }
}
// creteCourse()


async function getCourse () {
  const course = await Course.find({ name: 'node2.js' })
  console.log(course[0].price)
}

getCourse()
