import { withIronSession } from 'next-iron-session'

function handler(req, res) {
  req.session.destroy()
  res.status(200).send(true)
}

export default withIronSession(handler, {
  cookieName: 'user',
  password: process.env.COOKIE_PASS,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
})
