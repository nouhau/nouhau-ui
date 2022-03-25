import { Text } from '@chakra-ui/react'
import { parseCookies } from 'nookies'
import { useEffect, useState } from 'react'
import { User } from '../../models/user.model'

interface IEvaluatorData {
  evaluatorId: string
}

export const EvaluatorData = ({ evaluatorId }: IEvaluatorData) => {
  const [evaluator, setEvaluator] = useState<User | null>(null)

  useEffect(() => {
    const getEvaluator = async () => {
      const { 'nouhau.token': token } = parseCookies();
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getUser/${evaluatorId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      .then(async response => {
        const { user } = await response.json()
        setEvaluator(user)
      })
    }

    getEvaluator()
  }, [])

  return(
    <Text fontWeight="bold">
      Avaliadora: {evaluator?.name}
    </Text>
  )
}

export default EvaluatorData
