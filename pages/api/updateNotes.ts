import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next'

const updateNotes = async (request: NextApiRequest, response: NextApiResponse) => {
  console.log(request.body)
  
  await axios({
    method: 'PUT',
    url: `${process.env.API_GATEWAY_URL}/evaluatornote`,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `${request.headers.authorization}`
    },
    data: request.body
  })
  .then(async result => {
    return response.status(200).json(result.data)
  })
  .catch(error => {
    if(error.response){
      return response.status(error.response.status).json(error.response.data)
    }
    
    return response.status(500).json({error: 'Internal Server Error'})
  })
}

export default updateNotes
