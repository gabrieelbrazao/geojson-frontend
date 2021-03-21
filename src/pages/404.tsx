import { useRouter } from 'next/router'
import { useEffect } from 'react'

const PageNotFound: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/signin')
  }, [])

  return <div></div>
}

export default PageNotFound
