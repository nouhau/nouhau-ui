import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next'

//TODO: delete this

const getEvaluatorNotes = async (request: NextApiRequest, response: NextApiResponse) => {
  const { studentId } = request.query

  
  
  return response.status(200).json({ student: {
    user_id: studentId,
    name: 'string',
    email: 'string@email',
    role: 'students'
  }})
}

export default getEvaluatorNotes
