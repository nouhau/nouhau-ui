import { Flex, Text } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { Note } from '../../models/note.model';
import { evaluatorStatus } from '../constants/evaluatorStatus';
import { parseCookies } from 'nookies';

interface IEvaluatorStatus {
  studentId: string,
  evaluatorId: string
}

const EvaluatorStatus = ({ studentId, evaluatorId }: IEvaluatorStatus) => {
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const { ['nouhau.token']: token } = parseCookies()
    const getNotes = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getEvaluatorNotes/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      .then(async (response) => {
        const data = await response.json();
        const fetchNotes: Note[] = data.notes

        const waiting = fetchNotes.filter(note => !note.note)
        const notFilled = fetchNotes.filter(note => !note.note && note.evaluator_id === evaluatorId)

        if( waiting.length > 0 && notFilled.length === 0 ) {
          setStatus(evaluatorStatus.WAITING)
        }

        notFilled.length > 0 && setStatus(evaluatorStatus.NOT_FILLED)

        if( waiting.length === 0 && notFilled.length === 0 ) {
          setStatus(evaluatorStatus.CONCLUDED)
        }
      })
      .catch(error => {
        setStatus(evaluatorStatus.NOT_FILLED)
      });
    }

    getNotes()
  }, [status])

  return (
    <Flex>
      <Text>
        { status === evaluatorStatus.CONCLUDED && 
          <>
            <CheckCircleIcon w={4} h={4} color='#10DCAB' /> Concluído
          </>
        }

        { status === evaluatorStatus.NOT_FILLED && 
          <>
            <WarningIcon w={4} h={4} color='#b96576' /> Não preenchido
          </>
        }

        { status === evaluatorStatus.WAITING && 
          <>
            <WarningIcon w={4} h={4} color='#c5b525' /> Aguardando outra avaliadora
          </>
        }
      </Text>
    </Flex>
  );
};

export default EvaluatorStatus;
