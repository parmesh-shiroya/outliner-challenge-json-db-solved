const router = require('express').Router()
const fs = require('fs').promises
const { asyncErrorHandler } = require("../../middleware")
const StudentController = require("./controller")

module.exports = router


router.put("/:studentId/*", getStudent(), asyncErrorHandler(StudentController.putStudent))
router.get("/:studentId/*?", getStudent(true), asyncErrorHandler(StudentController.getStudent))
router.delete("/:studentId/*?", getStudent(true), asyncErrorHandler(StudentController.deleteStudent))




// A middleware only for student component to check if student exist or not
// @params studentShouldExist:Boolean  If this set as true student file should exist for execute the route function other wise return Student not found
function getStudent(studentShouldExist = false) {
    return (req, res, next) => {
        let studentId = req.params.studentId;
        fs.readFile(`data/${studentId}.json`, "utf-8").then(data => {
            // Try to parse data as Json if fail pass empty object
            try {
                res.studentData = JSON.parse(data);
            } catch (e) {
                res.studentData = {};
            }
            next()
        }).catch(err => {
            if (studentShouldExist)
                return res.status(404).json({ error: 'Student Not Found' })
            next()
        })
    }
}
