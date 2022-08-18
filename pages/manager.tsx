import { 
  Box,
  Text,
  Flex,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { verify } from 'jsonwebtoken'
import type { GetServerSideProps, NextPage } from 'next'
import { parseCookies } from 'nookies'
import Card from '../src/lib/Card'
import { Payload } from '../src/models/payload.model'
import { User } from '../src/models/user.model'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ['nouhau.token']: token } = parseCookies(context)

  try {
    const user = verify(token, process.env.TOKEN) as Payload

    if(user.role !== 'manager') {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    const students: User[] = await fetch(
      `${process.env.API_GATEWAY_URL}/students/company/${user.company_id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(async (response) => {
      const data = await response.json();
      console.log('here', data)
      return data;
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

const Manager: NextPage = ({ user, students }: any) => {
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
        console.log('map', student)
        return(
          <Card key={student.name}>
            <Flex direction='row' padding='3'>
              <NextLink href={`/employe/${student.user_id}`}>
                <Flex cursor='pointer'>
                  <Text paddingLeft='3' fontWeight='bold'>
                    {student.name}
                  </Text>
                </Flex>
              </NextLink>
            </Flex>
          </Card>
        )
      })}
    </>
  );
}

export default Manager
