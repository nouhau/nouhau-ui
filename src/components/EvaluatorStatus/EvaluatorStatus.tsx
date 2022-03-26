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
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const { ['nouhau.token']: token } = parseCookies()
    const getNotes = async () => {
      await fetch(
        `${process.env.API_GATEWAY_URL}/evaluatornote/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      .then(async (response) => {
        const data = await response.json();
        const fetchNotes: Note[] = data.notes

        const evaluatorNotes = fetchNotes.filter(note => note.evaluator_id === evaluatorId)

        const waiting = fetchNotes.filter(note => note.note !== undefined && note.note !== null)
        const notFilled = fetchNotes.filter(note => note.note !== undefined && note.note !== null && note.evaluator_id === evaluatorId)

        if( waiting.length === fetchNotes.length && notFilled.length === evaluatorNotes.length) {
          setStatus(evaluatorStatus.CONCLUDED)
        }

        if(waiting.length < fetchNotes.length){
          notFilled.length === evaluatorNotes.length ? setStatus(evaluatorStatus.WAITING) : setStatus(evaluatorStatus.NOT_FILLED)
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
