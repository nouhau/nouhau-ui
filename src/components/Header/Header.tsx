import { 
  Box, 
  Image, 
  Center
} from '@chakra-ui/react'
import NextLink from 'next/link'

const Header = () => {
  return(
    <NextLink href='/'>
      <Box cursor='pointer' minWidth='100wh' backgroundColor='#404040' padding='2'>
        <Center>
          <Image src='./assets/Logo.svg'/>
        </Center>
      </Box>
    </NextLink>
  )
}

export default Header
