import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next'

const getEvaluatorNotes = async (request: NextApiRequest, response: NextApiResponse) => {
  const { studentId } = request.query

  await axios({
    method: 'GET',
    url: `${process.env.API_GATEWAY_URL}/evaluatornote/${studentId}`,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `${request.headers.authorization}`
    }
  })
  .then(async result => {
    return response.status(200).json({ result })
  })
  .catch(error => {
    if(error.response){
      return response.status(error.response.status).json(error.response.data)
    }
    
    return response.status(500).json({error: 'Internal Server Error'})
  })
}

export default getEvaluatorNotes
