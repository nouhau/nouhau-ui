import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

const getUser = async (request: NextApiRequest, response: NextApiResponse) => {
  const { userId } = request.query
  
  await axios({
    method: 'GET',
    //TODO: add token to access route
    url: `${process.env.API_GATEWAY_URL}/user/${userId}`,
    headers: { 
      'Content-Type': 'application/json',
      // 'Authorization': `${request.headers.authorization}`
    }
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

export default getUser
