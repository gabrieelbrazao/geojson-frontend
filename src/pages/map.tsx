import Head from 'next/head'
import dynamic from 'next/dynamic'
import { GetServerSideProps } from 'next'
import { withIronSession } from 'next-iron-session'
import { useEffect, useState } from 'react'
import api from '../services/api'
import { Button } from '@material-ui/core'
import { ExitToApp } from '@material-ui/icons'
import { useRouter } from 'next/router'
import axios from 'axios'
import NewFeatureModal from '../components/NewFeatureModal'
import { useTheme } from '@material-ui/core/styles'

const MapContainer = dynamic(() => import('../components/map'), {
  ssr: false
})

export const getServerSideProps: GetServerSideProps = withIronSession(
  async ({ req }) => {
    const user = req.session.get('user')

    if (!user) {
      return {
        redirect: {
          destination: '/signin',
          permanent: false
        }
      }
    }

    return {
      props: { user }
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

interface Iprops {
  user: {
    id: string
  }
}

const Map: React.FC<Iprops> = ({ user }) => {
  const [center, setCenter] = useState([-23.2927, -51.1732])
  const [features, setFeatures] = useState([])
  const [openCreationModal, setOpenCreationModal] = useState(false)
  const [layerData, setLayerData] = useState(null)
  const [geomName, setGeomName] = useState('')
  const [geomColor, setGeomColor] = useState('')
  const router = useRouter()
  const theme = useTheme()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCenter([position.coords.latitude, position.coords.longitude])
    })

    api.get(`geoms/${user.id}`).then(({ data: fetchResponse }) => {
      setFeatures(fetchResponse.data)
    })
  }, [])

  const remvoeLastGeom = () => {
    const geoms = document.getElementsByClassName('leaflet-interactive')

    geoms[geoms.length - 1].remove()
  }

  const createFeature = ({ layer, layerType }) => {
    setOpenCreationModal(false)

    let newFeature

    if (layerType === 'marker') {
      newFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [layer._latlng.lat, layer._latlng.lng]
        },
        properties: {
          name: geomName,
          color: geomColor
        }
      }
    }

    if (layerType === 'polygon') {
      const points = []

      layer._latlngs[0].map(point => {
        points.push([point.lat, point.lng])
      })

      newFeature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: points
        },
        properties: {
          name: geomName,
          color: geomColor
        }
      }
    }

    remvoeLastGeom()

    setFeatures([...features, newFeature])

    api.post('/geoms', { content: newFeature, userId: user.id })
  }

  const cancelFeature = () => {
    setOpenCreationModal(false)
    remvoeLastGeom()
  }

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }

    return color
  }

  const handleCreate = data => {
    setGeomColor(getRandomColor())
    setGeomName('')

    setOpenCreationModal(true)
    setLayerData(data)
  }

  const handleLogOut = async () => {
    await axios.delete('/api/logout')

    router.replace('/signin')
  }

  return (
    <>
      <Head>
        <title>Map App</title>
      </Head>

      <MapContainer
        center={center}
        handleCreate={handleCreate}
        features={features}
      />

      <Button
        style={{
          position: 'absolute',
          right: 12,
          top: 12,
          zIndex: 400,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.main
        }}
        onClick={() => handleLogOut()}
      >
        <ExitToApp color="secondary" style={{ width: 32, height: 32 }} />
      </Button>

      <NewFeatureModal
        openDialog={openCreationModal}
        setOpenDialog={setOpenCreationModal}
        createFeature={createFeature}
        layerData={layerData}
        setGeomName={setGeomName}
        geomName={geomName}
        setGeomColor={setGeomColor}
        geomColor={geomColor}
        cancelFeature={cancelFeature}
      />
    </>
  )
}

export default Map
