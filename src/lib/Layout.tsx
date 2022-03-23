import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'
import Header from '../components/Header/Header'

interface ILayout {
  children: ReactNode
}

const Layout = ({ children }: ILayout) => {
  return(
    <Box minHeight='100vh' backgroundColor='#E2E2E2'>
      <Header/>
      <Box padding='5'>
        { children }
      </Box>
    </Box>
  )
}

export default Layout
