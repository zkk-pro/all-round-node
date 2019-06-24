const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
  .then(() => console.log('MongoDB is connected...'))
  .catch(err => console.log('Could not connect MongoDB...', err))

const courseSchema = new mongoose.Schema({
  // required验证器
  name: {type: String, required: true},
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
      // isAsync: true, // 表示异步验证
      validator: function(v, callback) {
        return new Promise(function(resolve, reject) {
          setTimeout(() => {
            resolve(v && v.length > 0)
          }, 3000)
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
    required: function () { return this.isPublished }
  }
})

const Course = mongoose.model('course', courseSchema)

async function creteCourse() {
  const course = new Course({
    // name: 'Node.js',
    author: 'Hey',
    tags: null,
    isPublished: true,
    // price: 888
  })
  try {
    const result = await course.save()
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
creteCourse()