const registerRequest = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }
  console.log('POST request received', req.body)
  res.end()
}

export default registerRequest
