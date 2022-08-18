import { 
  Button,
  Flex,
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  LinearScale
} from 'chart.js';
import { SubmitHandler, useForm } from 'react-hook-form'
import Card from '../../src/lib/Card'
import { Note } from '../../src/models/note.model'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../src/components/contexts/AuthContext'
import { User } from '../../src/models/user.model'
import Router from 'next/router'
   
export const getStaticPaths = async () => {
  const fetchStudents = await fetch(
    `${process.env.API_GATEWAY_URL}/students`
  )
    .then(async (response) => {
      const data = await response.json();
      return data
    })
    .catch((error) => {
      return error;
    });

  const students: User[] = await fetchStudents

  const paths = students.map(student => ({ params: { id: student.user_id }}))
  
  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params }: any) => {
  const id = params?.id

  const student = await fetch(
    `${process.env.API_GATEWAY_URL}/user/${id}`
  )
    .then(async (response) => {
      const data = await response.json();
      return data
    })
    .catch((error) => {
      return error
    });
  
  const notes: Note[] = await fetch(
    `${process.env.API_GATEWAY_URL}/evaluatornote/${student.user_id}`
  ).then(async (response) => {
    const data = await response.json();
    return data
  });

  if(!student) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      student,
      notes
    }
  };
}

const EmployePage: NextPage = ({ student, notes }: any) => {
  const [ dataNote, setDataNote ] = useState<any | null>(null)
  const { 'nouhau.token': token } = parseCookies()

  notes.sort((a: Note ,b: Note) => (a.evaluator_id > b.evaluator_id) ? 1 : ((b.evaluator_id > a.evaluator_id) ? -1 : 0))

  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    LinearScale,
    Filler,
    Tooltip
  );

  useEffect(() => {
    const getDataNote = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getDataNote/${student.user_id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      .then(async response => {
        const data = await response.json()
        setDataNote(data)
      })
      .catch(error => console.log(error))
    }

    getDataNote()
  }, [])

  const valueNotes = (dataNote?.mappingData.mappingNotes.sort((a: any ,b: any) => { return a.note - b.note }))
  
  return (
    <>
      <Card>
        <Box padding="5">
          <Text fontWeight="bold">Colaborador: {student.name}</Text>
        </Box>
      </Card>
      <Card>
          <Flex direction="row" paddingTop="5" paddingLeft="5">
            <Flex direction="column" width="50%">
              <Text fontWeight="bold">Notas</Text>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Competências</Th>
                    <Th>Nota</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    dataNote?.mappingData.mappingNotes.map((mappingNote: any) => {
                      let color: string = ''

                      if(mappingNote.note === valueNotes[0].note) { color = '#b96576' }
                      if(mappingNote.note === valueNotes[valueNotes.length - 1].note) { color = '#10DCAB' }

                      return(
                        <Tr key={mappingNote.mappingNote_id}>
                          <Td>{mappingNote.skillId.name}</Td>
                          <Td color={color}>
                            {(mappingNote.note * 100 / 2).toFixed(2)} %
                          </Td>
                        </Tr>
                      )
                    })
                  }
                </Tbody>
              </Table>
              {
                dataNote?.mappingData.mapping.feedback !== null && dataNote?.mappingData.mapping.feedback !== undefined &&
                <Box>
                  <Text fontWeight="bold" paddingTop="5">
                    Feedback
                  </Text>
                  <Text paddingLeft="5">
                    {dataNote.mappingData.mapping.feedback}
                  </Text>
                </Box>
              }
            </Flex>
            <Flex direction="column" marginLeft='3' width="50%">
              <Text fontWeight="bold">Gráfico</Text>
              <Flex width="60%">
                <Radar
                  data={
                    {
                      labels: dataNote?.mappingData.mappingNotes.map((mappingNote: any) => {return mappingNote.skillId.name}),
                      datasets: [
                        {
                          data: dataNote?.mappingData.mappingNotes.map((mappingNote: any) => {return (mappingNote.note * 100 / 2).toFixed(2)}),
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          borderColor: 'rgba(255, 99, 132, 1)',
                          borderWidth: 1
                        },
                      ]
                    }
                  }
                  options={
                    {
                      scales: {
                        r: {
                          min: 0,
                          max: 120,
                          grid: {
                            circular: true
                          }
                        }
                      },
                      elements: {
                        line: {
                          borderJoinStyle: 'round'
                        }
                      }
                    }
                  }
                />
              </Flex>
            </Flex>
          </Flex>
          <Box paddingLeft="5">
            <Flex padding="2">
              <Button 
                onClick={() => {
                  Router.push('/manager')
                }} 
                color="#b96576"
              >
                Voltar
              </Button>
            </Flex>
          </Box>
        </Card>
    </>
  );
}

export default EmployePage
