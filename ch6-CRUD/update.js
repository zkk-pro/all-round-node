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

async function updateCourse(id) {
  // 1. 通过id找到数据
  const course = await Course.findById(id)
  console.log('course:', course)
  if (!course) return // 判断

  // 2. 修改数据
  // course.isPublished = true
  // course.author = 'yaya'
  // 另一种修改方式
  course.set({ isPublished: true, author: 'yaya'})

  // 3. 保存数据
  const result = await course.save()
  console.log(result)
}

// updateCourse('5a68fdf95db93f6477053ddd')

async function updateCourse2(id) {
  // 1. 更新数据，update方法第一个参数作为过滤
  // 传入唯一的条件，更新一个数据，传入匹配多条数据的，更新多个数据

  // 第二个参数为更新的数据，这里需要使用一个或多个更新运算符
  // 更新运算符可以在MongoDB的官方文档里：
  // Reference->Operators->Update Operators里查看
  // 返回的结果是实现更新操作的结果，而不是文档
  const result = await Course.update({_id: id}, {
    $set: {
      author: 'Hey',
      isPublished: false
    }
  })
  console.log(result)
}
updateCourse2('5a68fdf95db93f6477053ddd')
