import { 
  Box, 
  Image, 
  Flex,
  Button,
  Spacer,
  Center
} from '@chakra-ui/react'
import NextLink from 'next/link'
import Router from 'next/router';
import { destroyCookie } from 'nookies'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const Header = () => {
  const { setUser, user } = useContext(AuthContext)

  const handleSignOut = () => {
    console.log('saindo')
    destroyCookie({}, 'nouhau.token')
    destroyCookie({}, 'nouhau.user')

    setUser(null)

    Router.push('/')
  }
  return(
    <Flex minWidth='100wh' backgroundColor='#404040' padding='2'>
      <NextLink href='/'>
        <Box cursor='pointer'>
          
          <Image src='./assets/Logo.svg'/>
        </Box>
      </NextLink> 
      {!!user && (
        <>
          <Spacer />
          <Button 
            onClick={handleSignOut}
            backgroundColor="#b96576" 
            size="md"
          >
            Sair
          </Button> 
        </>
      )}
    </Flex>
  )
}

export default Header
