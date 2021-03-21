import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import validate from 'validate.js'
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Link,
  TextField,
  Typography
} from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import api from '../services/api'
import constraints from '../utils/validateConstraintsSignUp'
import ErrorsModal from '../components/ErrorsModal'
import SuccessModal from '../components/SuccessModal'
import { withIronSession } from 'next-iron-session'
import { GetServerSideProps } from 'next'

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

const SignUp: React.FC = () => {
  const smallScreen = useMediaQuery('(min-width:1190px)')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [openSuccessModal, setOpenSuccessModal] = useState(false)
  const [openErrorsModal, setOpenErrorsModal] = useState(false)
  const [errors, setErrors] = useState([])
  const [fetchProgress, setFetchProgress] = useState(0)
  const [fetchLoading, setFetchLoading] = useState(false)

  const handleSignUp = async () => {
    const { name: nameResp, email: emailResp, password: passwordResp } =
      validate({ name, email, password }, constraints, {
        fullMessages: false
      }) || {}

    if (nameResp || emailResp || passwordResp) {
      setErrors([
        ...(nameResp || []),
        ...(emailResp || []),
        ...(passwordResp || [])
      ])

      setOpenErrorsModal(true)
    } else {
      setFetchLoading(true)

      api
        .post(
          '/users',
          {
            name,
            email,
            password
          },
          {
            onUploadProgress: ({ loaded, total }) => {
              setFetchProgress((loaded * 100) / total / 2)
            },
            onDownloadProgress: ({ loaded, total }) => {
              setFetchProgress((loaded * 100) / total)
            }
          }
        )
        .then(() => {
          setOpenSuccessModal(true)
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
              label="Nome"
              variant="outlined"
              style={{ marginBottom: 24, width: '100%' }}
              onChange={event => setName(event.target.value)}
            />

            <TextField
              label="E-mail"
              variant="outlined"
              style={{ marginBottom: 24, width: '100%' }}
              onChange={event => setEmail(event.target.value)}
            />

            <TextField
              label="Senha"
              variant="outlined"
              type="password"
              style={{ width: '100%' }}
              onChange={event => setPassword(event.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ width: '100%', marginBottom: 24, marginTop: 48 }}
              onClick={() => handleSignUp()}
              disabled={fetchLoading}
            >
              Cadastrar
            </Button>

            <Grid container direction="row" style={{ width: '100%' }}>
              <Typography variant="body1" style={{ marginRight: 8 }}>
                Já possui uma conta?
              </Typography>

              <Link variant="body2" href="/signin">
                Entrar
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

      <SuccessModal
        openDialog={openSuccessModal}
        setOpenDialog={setOpenSuccessModal}
      />
    </>
  )
}

export default SignUp
