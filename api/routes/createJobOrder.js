const Router = require('express-promise-router')
const router = new Router()

const db = require('../db/db')

router.get('user/:id', async (req, res) => {
    const { id } = req.params
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id])
    res.send({
        result: rows[0]
    })
  })

router.get('/sample', async (req, res) => {
    const { id } = req.params
    const { rows } = await db.query('SELECT * FROM test')
    res.send({
        result: rows[0]
    })
})

router.post('/create', async (req,res) => {
  console.log("POST")
  console.log(req.body)
  await db.query('INSERT INTO job_orders VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[req.body.job_id,req.body.employer,req.body.position,new Date(),new Date(),req.body.location,1,req.body.catchments,req.body.jobDescriptionFile])
  await db.query('COMMIT')
  res.send({
      result: rows[0]
  }) 
})

module.exports = router
