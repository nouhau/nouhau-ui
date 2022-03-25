import { 
  Box,
  Text,
  Flex,
  Spacer,
  
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { verify } from 'jsonwebtoken'
import type { GetServerSideProps, NextPage } from 'next'
import { parseCookies } from 'nookies'
import EvaluatorStatus from '../src/components/EvaluatorStatus/EvaluatorStatus'
import Card from '../src/lib/Card'
import { Payload } from '../src/models/payload.model'
import { User } from '../src/models/user.model'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ['nouhau.token']: token } = parseCookies(context)
  const authorization = ['admin']
  
  try {
    const user = verify(token, process.env.TOKEN) as Payload

    if(!authorization.includes(user.role)) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    const students: User[] = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getStudents`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(async (response) => {
      const data = await response.json();
      return data.students;
    })

    return {
      props: {
        user,
        students
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
}

const Admin: NextPage = ({ user, students }: any) => {
  return (
    <>
      <Card>
        <Box padding="5">
          <Text fontWeight="bold">
            Administradora: {user.name}
          </Text>
        </Box>
      </Card>
      {students.map((student: User) => {
        return(
          <Card key={student.name}>
            <Flex direction='row' padding='3'>
              <NextLink href={`/alunos/${student.user_id}`}>
                <Flex cursor='pointer'>
                  <Text paddingLeft='3' fontWeight='bold'>
                    {student.name}
                  </Text>
                </Flex>
              </NextLink>
                <Spacer />
                <EvaluatorStatus studentId={student.user_id} evaluatorId={user.sub} />
            </Flex>
          </Card>
        )
      })}
    </>
  );
}

export default Admin
