import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Link,
  TextField,
  Typography
} from '@material-ui/core'
import Head from 'next/head'
import Image from 'next/image'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useState } from 'react'
import validate from 'validate.js'
import api from '../services/api'
import constraints from '../utils/validateConstraintsSignIn'
import ErrorsModal from '../components/ErrorsModal'
import axios from 'axios'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { withIronSession } from 'next-iron-session'

export const getServerSideProps: GetServerSideProps = withIronSession(
  async ({ req }) => {
    const user = req.session.get('user')

    if (user) {
      return {
        redirect: {
          destination: '/map',
          permanent: false
        }
      }
    } else {
      return {
        props: {}
      }
    }
  },
  {
    cookieName: 'user',
    cookieOptions: {
      secure: false
    },
    password: process.env.COOKIE_PASS
  }
)

const SignIn: React.FC = () => {
  const smallScreen = useMediaQuery('(min-width:1190px)')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [openErrorsModal, setOpenErrorsModal] = useState(false)
  const [errors, setErrors] = useState([])
  const [fetchProgress, setFetchProgress] = useState(0)
  const [fetchLoading, setFetchLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = () => {
    const { email: emailResp, password: passwordResp } =
      validate({ email, password }, constraints, {
        fullMessages: false
      }) || {}

    if (emailResp || passwordResp) {
      setErrors([...(emailResp || []), ...(passwordResp || [])])

      setOpenErrorsModal(true)
    } else {
      setFetchLoading(true)

      api
        .get('/users/login', {
          params: {
            email,
            password
          },
          onUploadProgress: ({ loaded, total }) => {
            setFetchProgress((loaded * 100) / total / 2)
          },
          onDownloadProgress: ({ loaded, total }) => {
            setFetchProgress((loaded * 100) / total)
          }
        })
        .then(async ({ data: fetchResponse }) => {
          await axios.post('/api/login', {
            id: fetchResponse.data.id
          })

          router.push('/map')
        })
        .catch(({ response: fetchResponse }) => {
          setErrors(fetchResponse.data.errors)
          setOpenErrorsModal(true)
        })
        .finally(() => {
          setFetchLoading(false)
          setFetchProgress(0)
        })
    }
  }

  return (
    <>
      <Head>
        <title>Map App</title>
      </Head>

      <LinearProgress
        variant="determinate"
        value={fetchProgress}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          display: fetchLoading ? 'block' : 'none'
        }}
      />

      <Grid container>
        <Grid
          item
          container
          xs={6}
          alignItems="center"
          justify="center"
          style={{
            padding: 64,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '0px 30px 30px 0px',
            display: smallScreen ? 'block' : 'none'
          }}
        >
          <Box
            style={{
              height: '100%',
              width: '100%',
              position: 'relative'
            }}
          >
            <Image src="/background.svg" alt="Background Image" layout="fill" />
          </Box>
        </Grid>

        <Grid
          item
          container
          xs={smallScreen ? 6 : 12}
          style={{ height: '100vh' }}
          alignItems="center"
          justify="center"
          direction="column"
        >
          <Grid
            item
            container
            xs={10}
            sm={7}
            lg={6}
            xl={5}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Typography
              variant="h3"
              style={{ marginBottom: 74, width: '100%' }}
            >
              Bem-vindo!
            </Typography>

            <TextField
              label="E-mail"
              variant="outlined"
              onChange={event => setEmail(event.target.value)}
              style={{ marginBottom: 24, width: '100%' }}
            />

            <TextField
              label="Senha"
              variant="outlined"
              type="password"
              onChange={event => setPassword(event.target.value)}
              style={{ width: '100%' }}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleSignIn()}
              style={{ width: '100%', marginBottom: 24, marginTop: 48 }}
            >
              Entrar
            </Button>

            <Grid container direction="row" style={{ width: '100%' }}>
              <Typography variant="body1" style={{ marginRight: 8 }}>
                Ainda não possui uma conta?
              </Typography>

              <Link variant="body2" href="/signup">
                Cadastrar-se
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <ErrorsModal
        openDialog={openErrorsModal}
        setOpenDialog={setOpenErrorsModal}
        errors={errors}
      />
    </>
  )
}

export default SignIn
