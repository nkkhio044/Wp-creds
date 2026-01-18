const express = require('express')
const path = require('path')
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

let sock = null

app.post('/generate-pair-code', async (req, res) => {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  sock = makeWASocket({ auth: state })

  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (update) => {
    const { pairingCode } = update
    if (pairingCode) {
      res.json({ pairCode: pairingCode })
    }
  })
})

app.listen(3000, () => console.log('Knight Bot backend running on http://localhost:3000'))
