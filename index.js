const { VM } = require('vm2')
const fetch = require('node-fetch')

module.exports = async function jsonpClient(url) {
  const resBody = await fetch(url).then(res => res.text())
  const callbackNameReg = /^([$\w_][\d\w_$]+)\(/
  const jsonpStartReg = /^\(/
  const jsonpEndReg = /\);?$/m
  const isJsonpStart = jsonpStartReg.test(resBody)
  const isJsonpEnd = jsonpEndReg.test(resBody)
  let jsonp = resBody
  let callbackName = ''
  if (callbackNameReg.test(resBody) && isJsonpEnd) {
    callbackName = jsonp.match(callbackNameReg)[1]
  } else if (isJsonpStart && isJsonpEnd) {
    callbackName = 'jsonp_' + Date.now().toString()
    jsonp = callbackName + jsonp
  } else {
    return resBody
  }
  const vm = new VM({
    timeout: 1000,
    sandbox: {
      [callbackName](data) {
        try {
          return JSON.stringify(data)
        } catch (error) {
          return data.toString()
        }
      }
    }
  })
  return vm.run(jsonp)
}
