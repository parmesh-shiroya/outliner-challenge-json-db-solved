const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs').promises
const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})


// Test Put student API
tape("Put student", async function (t) {
  const url = `${endpoint}/student1/courses/calculus/quizzes/ye0ab61`
  jsonist.put(url, { "score": 98 }, (err, body) => {
    if (err) t.error(err)
    t.equal(body.courses.calculus.quizzes.ye0ab61.score, 98, "Api response contains the sent propery")
    fs.readFile("data/student1.json", "utf-8").then(data => {
      t.ok(data, "Student file successfully created")
      let studentData = JSON.parse(data)
      t.equal(studentData.courses.calculus.quizzes.ye0ab61.score, 98, "Student file contain the sent propery")
      t.end()
    }).catch(err => {
      console.log(err)
      t.fail("Student file is not exist " + err.message)
      t.end()
    })
  })
})

// Test Get Student API
tape("Get student", async function (t) {
  const url = `${endpoint}/student1/courses/calculus`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.deepEqual(body, {
      "quizzes": {
        "ye0ab61": {
          "score": 98
        }
      }
    }, "Api response contains the data that student file contains")
    t.end()
  })
})


// Test Delete Student API
tape("Get student", async function (t) {
  const url = `${endpoint}/student1/courses/calculus`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    t.deepEqual(body, {
      "courses": {}

    }, "Api response contains only remaining data after deletion")
    fs.readFile("data/student1.json", "utf-8").then(data => {
      t.ok(data, "Student file is exist")
      let studentData = JSON.parse(data)
      t.deepEqual(studentData, {
        "courses": {}
      }, "Student file contain only remaining data that should be exist after deletion")
      t.end()
    }).catch(err => {
      console.log(err)
      t.fail("Student file is not exist " + err.message)
      t.end()
    })

  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
