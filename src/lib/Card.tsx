import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface ICard {
  children: ReactNode
}

const Card = ({ children }: ICard) => {
  return(
    <Box backgroundColor='#FFFFFF' borderWidth='1px' borderRadius='lg'>
      { children }
    </Box>
  )
}

export default Card
