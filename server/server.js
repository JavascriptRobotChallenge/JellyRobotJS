// const express = require('express')
// const app = express()
//
// const pkg = require('APP')
//
// // https://nodejs.org/api/modules.html#modules_accessing_the_main_module
// const server = app.listen(
//   pkg.port,
//   () => {
//     console.log(`--- Started HTTP Server for ${pkg.name} ---`)
//     const { address, port } = server.address()
//     const host = address === '::' ? 'localhost' : address
//     const urlSafeHost = host.includes(':') ? `[${host}]` : host
//     console.log(`Listening on http://${urlSafeHost}:${port}`)
//   }
// )
//
// module.exports = server