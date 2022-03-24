import { 
  Button,
  Flex,
  Text,
  Box
} from '@chakra-ui/react'
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import type { NextPage } from 'next'
import { SubmitHandler, useForm } from 'react-hook-form'
import Skill from '../../src/components/Skill/Skill'
import Card from '../../src/lib/Card'
import { Note } from '../../src/models/note.model'
import { Student } from '../../src/models/student.model'
import { parseCookies } from 'nookies'
   
export const getStaticPaths = async () => {
  const fetchStudents = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getStudents`
  )
    .then(async (response) => {
      const data = await response.json();
      return data
    })
    .catch((error) => {
      return error;
    });

  const students: Student[] = fetchStudents.students

  const paths = students.map(student => ({ params: { id: student.user_id }}))
  
  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params }: any) => {
  const id = params?.id
  
  const student = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getUser/${id}`
  )
    .then(async (response) => {
      const data = await response.json();
      return data.user
    })
    .catch((error) => {
      return error
    });

  const notes: Note[] = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getEvaluatorNotes/${student.user_id}`
  ).then(async (response) => {
    const data = await response.json();
    return data.notes
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
  const { register, handleSubmit } = useForm()
  const { 'nouhau.user': user } = parseCookies()
  const { 'nouhau.token': token } = parseCookies()

  notes.forEach((note: Note) => {
    note.evaluator_id !== user && notes.pop(note)
  })

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
      evaluatorId: user,
      peopleId: student.user_id,
      notes: notesRequest
    }

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/updateNotes`, {
      method: 'POST',
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

  return (
    <>
      <Card>
        <Box padding="5">
          <Text fontWeight="bold">
            Aluno: {student.name}
          </Text>
        </Box>
      </Card>
      <Card>
        <Box padding="5">
          {notes.map((note: Note) => {
            if(!note.note){
              note.note = 0
            }

            return (
              <div key={note.evaluation_id}>
                <Skill 
                  name={note.evidenceId.name}
                  defaultValue={note.note}
                  register={register(`${note.evidenceId.name}`)}
                />
              </div>
            );
          })}
          <Flex paddingTop='5' direction='column' gap={1}>
            <Text fontStyle='italic' fontSize='14px'>
              <CheckCircleIcon w={4} h={4} color='#10DCAB'/> Nota salva
            </Text>
            <Text fontStyle='italic' fontSize='14px'>
              <WarningIcon w={4} h={4} color='#b96576'/> Nota pendente
            </Text>
          </Flex>
          <Flex paddingTop="2">
            <Button
              onClick={handleSubmit(handleSignIn)}
              backgroundColor="#10DCAB"
            >
              Salvar
            </Button>
          </Flex>
        </Box>
      </Card>
    </>
  );
}

export default EvaluationPage
