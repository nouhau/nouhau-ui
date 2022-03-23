import { 
  Flex, 
  Text, 
  Spacer,
  Box
} from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link'
import Card from '../../src/lib/Card'
import { Student } from '../../src/models/student.model'
import { parseCookies } from 'nookies'
import { verify } from 'jsonwebtoken'
import React from 'react'
import EvaluatorStatus from '../../src/components/EvaluatorStatus/EvaluatorStatus'
import { Payload } from '../../src/models/payload.model'

const StudentsPage: NextPage = ({ user, students }: any) => {
  return (
    <>
      <Card>
        <Box padding="5">
          <Text fontWeight="bold">
            Avaliadora: {user.name}
          </Text>
        </Box>
      </Card>
      {students.map((student: Student) => {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ['nouhau.token']: token } = parseCookies(context)
  const authorization = ['admin', 'evaluator']
  
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

    const students: Student[] = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getStudents`
    ).then(async (response) => {
      const data = await response.json();
      return data.students;
    });

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

export default StudentsPage
