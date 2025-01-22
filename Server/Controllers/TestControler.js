import express from 'express'

const test = express.Router();

test.get('/test', (req,res) =>{
    res.json(
        "hellow derick the coding is going well"
    )

})

export default test;