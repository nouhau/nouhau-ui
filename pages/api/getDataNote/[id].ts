import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next'

const getDataNote = async (request: NextApiRequest, response: NextApiResponse, token: any) => {
  const { id } = request.query
  
  await axios({
    method: 'GET',
    url: `${process.env.API_GATEWAY_URL}/records/${id}`,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `${request.headers.authorization}`
    }
  })
  .then(async result => {
    const records = await result.data
    await axios({
      method: 'GET',
      url: `${process.env.API_GATEWAY_URL}/mappingNote/${id}`,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `${request.headers.authorization}`
      }
    })
    .then(async result => {
      const mappingData = result.data
      return response.status(200).json({records, mappingData})
    })
    .catch(error => {
      console.log(error)
      throw new Error()
    })
  })
  .catch(error => {
    if(error.response){
      return response.status(error.response.status).json(error.response.data)
    }
    
    return response.status(500).json({error: 'Internal Server Error'})
  })
}

export default getDataNote
