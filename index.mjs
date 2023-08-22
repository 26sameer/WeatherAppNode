import http from 'http'
import fs from 'fs'

const htmlFile = fs.readFileSync('./index.html', 'utf-8')
const server = http.createServer((req, res) => {
  res.end(htmlFile)
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening at port 8000')
})
