import { withIronSession } from 'next-iron-session'

async function handler(req, res) {
  const { id } = req.body

  req.session.set('user', { id })

  await req.session.save()

  res.status(201).send(true)
}

export default withIronSession(handler, {
  cookieName: 'user',
  password: process.env.COOKIE_PASS,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
})
