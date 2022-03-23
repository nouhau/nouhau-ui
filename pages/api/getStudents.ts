import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next'

const getStudents = async (request: NextApiRequest, response: NextApiResponse) => {
  await axios({
    method: 'GET',
    url: `${process.env.API_GATEWAY_URL}/students`,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `${request.headers.authorization}`
    }
  })
  .then(async result => {
    return response.status(200).json({ students: result.data.students })
  })
  .catch(error => {
    if(error.response){
      return response.status(error.response.status).json(error.response.data)
    }
    
    console.log(error)
    return response.status(500).json({error: 'Internal Server Error'})
  })
}

export default getStudents
