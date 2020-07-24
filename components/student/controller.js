const fs = require('fs').promises;
const immutable = require('object-path-immutable')
module.exports = { putStudent, getStudent, deleteStudent }

async function putStudent(req, res) {
    let studentId = req.params.studentId;
    let studentData = res.studentData || {};
    // Changing path params to the properties key ex. prop1/prop2 to prop1.prop2
    let properies = req.params[0].replace(new RegExp("\/", "g"), ".");
    studentData = immutable.set(studentData, properies, req.body)

    await fs.writeFile(`data/${studentId}.json`, JSON.stringify(studentData, null, 4))

    return res.send(studentData)
}

async function getStudent(req, res) {
    let studentData = res.studentData || {};
    // Changing path params to the properties key ex. prop1/prop2 to prop1.prop2
    let properies = req.params[0].replace(new RegExp("\/", "g"), ".");
    let properyValue = immutable.get(studentData, properies, null)
    if (!properyValue)
        return res.status(404).json({ error: 'Property Not Found' })
    return res.json(properyValue)
}

async function deleteStudent(req, res) {
    let studentId = req.params.studentId;

    let studentData = res.studentData || {};
    // Changing path params to the properties key ex. prop1/prop2 to prop1.prop2
    let properies = req.params[0] ? req.params[0].replace(new RegExp("\/", "g"), ".") : "";
    // Check is property exists
    let properyValue = immutable.get(studentData, properies, null)
    if (!properyValue)
        return res.status(404).json({ error: 'Property Not Found' })
    // Delete propery
    studentData = immutable.del(studentData, properies)
    console.log(studentData)
    // After property deletion if empty array or empty object exists delete student file
    if (!studentData || (Array.isArray(studentData) && studentData.length == 0) || Object.keys(studentData).length == 0) {
        await fs.unlink(`data/${studentId}.json`)
        return res.json({ msg: "Student deleted successfully" })
    }
    //Rewrite the student file with remain data
    await fs.writeFile(`data/${studentId}.json`, JSON.stringify(studentData, null, 4))
    return res.json(studentData)
}