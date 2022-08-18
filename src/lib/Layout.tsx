import Head from 'next/head';
import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'
import Header from '../components/Header/Header'

interface ILayout {
  children: ReactNode
}

const Layout = ({ children }: ILayout) => {
  return(
    <>
      <Head>
        <link href="http://fonts.cdnfonts.com/css/metropolis" rel="stylesheet" />
        <title>Nouhau</title>
        <meta property="og:title" content="Nouhau" key="title" />
      </Head>
      <Box minHeight='100vh' backgroundColor='#E2E2E2'>
        <Header/>
        <Box padding='5'>
          { children }
        </Box>
      </Box>
    </>
  )
}

export default Layout
