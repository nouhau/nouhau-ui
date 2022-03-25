import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next'

const updateMapping = async (request: NextApiRequest, response: NextApiResponse) => {
  await axios({
    method: 'PUT',
    url: `${process.env.API_GATEWAY_URL}/mapping`,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `${request.headers.authorization}`
    },
    data: request.body
  })
  .then(async result => {
    console.log(result)
    return response.status(200).json(result.data)
  })
  .catch(error => {
    if(error.response){
      return response.status(error.response.status).json(error.response.data)
    }
    
    return response.status(500).json({error: 'Internal Server Error'})
  })
}

export default updateMapping
