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
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import type { NextPage } from 'next'
import { SubmitHandler, useForm } from 'react-hook-form'
import Skill from '../../src/components/Skill/Skill'
import Card from '../../src/lib/Card'
import { Note } from '../../src/models/note.model'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../src/components/contexts/AuthContext'
import EvaluatorData from '../../src/components/EvaluatorData/EvaluatorData'
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

const EvaluationPage: NextPage = ({ student, notes }: any) => {
  const [ dataNote, setDataNote ] = useState<any | null>(null)
  const { register, handleSubmit } = useForm()
  const { 'nouhau.token': token } = parseCookies()
  const { user } = useContext(AuthContext)

  notes.sort((a: Note ,b: Note) => (a.evaluator_id > b.evaluator_id) ? 1 : ((b.evaluator_id > a.evaluator_id) ? -1 : 0))

  console.log(user)

  const userId: string | undefined = user?.user_id ? user?.user_id : user?.sub
  const notesEvaluator: Note[] = notes.filter((note: Note) => note.evaluator_id === userId)

  let newNotes: any
  if(user?.role === 'admin'){
    newNotes = notes.map((note: Note) => note.evaluator_id)
    newNotes = newNotes.filter((id: any, key: any) => newNotes.indexOf(id) === key)
  }

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
    }

    getDataNote()
  }, [])

  console.log('reload', dataNote)

  const handleSignIn: SubmitHandler<any> = async (data) => {
    const notesRequest: any = []
    Object.keys(data).forEach(key => {
        let evidenceId: string = ''
        notes.forEach((note: any) => {
          if(note.evidenceId.name === key){
            evidenceId = note.evidenceId.evidence_id
          }
        })

        const obj: any = {
          evidenceId,
          note: parseFloat(data[key])
        }
        notesRequest.push(obj)
      })

    const requestBody = {
      evaluatorId: user?.user_id,
      peopleId: student.user_id,
      notes: notesRequest
    }

    await fetch(`${process.env.API_GATEWAY_URL}/evaluatornote`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    })
    .then(async response => {
      const data = await response.json()

      data.affected === 0 && alert('Erro ao salvar as notas')
      alert('Notas salvas')
    })
    .catch(error => {
      console.log(error)
      alert('Ocorreu um erro')
    })
  }

  const updateMapping: any = async () => {
    await fetch(`${process.env.API_GATEWAY_URL}/mappingnote`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mappingId: dataNote?.mappingData.mapping.mapping_id
      })
    })
    .then(async response => {
      const data = await response.json()
      alert('Notas salvas')
    })
    .catch(error => {
      alert('Ocorreu um erro')
    })
  }
  
  return (
    <>
      <Card>
        <Box padding="5">
          <Text fontWeight="bold">Aluno: {student.name}</Text>
        </Box>
      </Card>
      <Card>
        <Box padding="5">
          {user?.role === "evaluator" &&
            notesEvaluator.map((note: Note) => {
              console.log(note)
              return (
                <div key={note.evaluation_id}>
                  <Skill
                    name={note.evidenceId.name}
                    defaultValue={!note.note ? 0 : note.note}
                    register={register(`${note.evidenceId.name}`)}
                    status={note.note}
                  />
                </div>
              );
            })}

          {user?.role === "admin" &&
            newNotes.map((evaluatorId: string) => {
              const evaluatorNotes = notes.filter(
                (note: Note) => note.evaluator_id === evaluatorId
              );

              console.log(evaluatorNotes)

              return (
                <div key={evaluatorId}>
                  <EvaluatorData key={evaluatorId} evaluatorId={evaluatorId} />
                  {evaluatorNotes.map((note: Note) => {
                    return (
                      <Skill
                        key={note.evaluation_id}
                        name={note.evidenceId.name}
                        defaultValue={!note.note ? 0 : note.note}
                        status={note.note}
                      />
                    );
                  })}
                </div>
              );
            })}
          <Flex paddingTop="5" direction="column" gap={1}>
            <Text fontStyle="italic" fontSize="14px">
              <CheckCircleIcon w={4} h={4} color="#10DCAB" /> Nota salva
            </Text>
            <Text fontStyle="italic" fontSize="14px">
              <WarningIcon w={4} h={4} color="#b96576" /> Nota pendente
            </Text>
          </Flex>
        </Box>
      </Card>
      {user?.role !== "admin" ? (
        <Card>
          <Box paddingTop="5" padding="5">
            <Flex>
              <Button
                onClick={handleSubmit(handleSignIn)}
                backgroundColor="#10DCAB"
              >
                Salvar
              </Button>
              <Button 
                marginLeft='2'
                onClick={() => {
                  Router.push('/admin')
                }} 
                color="#b96576"
              >
                Voltar
              </Button>
            </Flex>
          </Box>
        </Card>
      ) : (
        <Card>
          <Flex direction="row" paddingTop="5" paddingLeft="5">
          <Flex direction="column" width="50%">
              <Text fontWeight="bold">Notas</Text>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Competências</Th>
                    <Th isNumeric>Nota</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataNote?.mappingData.mappingNotes.map((mappingNote: any) => {
                    return(
                      <Tr key={mappingNote.mappingNote_id}>
                        <Td>{mappingNote.skillId.name}</Td>
                        <Td isNumeric>{mappingNote.note}</Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </Flex>
            <Flex direction="column" marginLeft='3' width="50%">
              <Text fontWeight="bold">Médias</Text>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Evidência</Th>
                    <Th isNumeric>Média</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataNote?.records.map((record: any) => {
                    return(
                      <Tr key={record.record_id}>
                        <Td>{record.evidenceId.name}</Td>
                        <Td isNumeric>{record.average !== null && record.average !== undefined ? record.average : '-'}</Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </Flex>
          </Flex>
          <Box paddingLeft="5">
            <Flex padding="2">
              <Button 
                onClick={() => {
                  Router.push('/admin')
                }} 
                color="#b96576"
              >
                Voltar
              </Button>

              <Button 
                marginLeft='2' 
                onClick={updateMapping} 
                backgroundColor="#10DCAB"
              >
                Gerar notas
              </Button>
            </Flex>
          </Box>
        </Card>
      )}
    </>
  );
}

export default EvaluationPage
