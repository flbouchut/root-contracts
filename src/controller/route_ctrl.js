const { web3 } = require("../web3")
const sendError = (res, status, message, body) => {
    return res.status(status).json( {
        "meta": buildErrorMeta(message),
        "error": body
    })
}

const sendSuccess = (res, body) => {
    return res.json( {
        "meta": buildSuccessMeta(),
        "data": body
    })
}

const initContract = async(req, res) => {
    try{
        const address =  req.params?.accountAddress
        
    }catch(e){
        return sendError(res, 500, "Couldn't connect to wallet")
    }
}

module.exports = { initContract }