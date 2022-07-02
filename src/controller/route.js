var express = require('express')
const router = express.Router()
const { initContract } =  require('./route_ctrl')

const baseAccountId = '/account/:accountAddress'

router.post(baseAccountId + '/initContract', initContract)

module.exports =  router 