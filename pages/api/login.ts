import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { SignData } from '../../src/models/signData.model'
import { LoginResponse } from '../../src/models/loginResponse.model'
import { verify } from 'jsonwebtoken'

const login = async (request: NextApiRequest, response: NextApiResponse) => {
  const signData: SignData = request.body
  await axios({
    method: 'POST',
    url: `${process.env.API_GATEWAY_URL}/login`,
    headers: { 
      'Content-Type': 'application/json',
    },
    data: signData
  })
  .then(async result => {
    const { token } = await result.data

    const user: any = verify(
        token,
        process.env.TOKEN
    );

    console.log(user)
    
    const responseData: LoginResponse = {
      token,
      user
    }

    return response.status(200).json(responseData)
  })
  .catch(error => {
    return response.status(403).json({message: 'Senha/Email inválido'})
  })
}

export default login
