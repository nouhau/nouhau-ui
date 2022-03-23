import { verify } from 'jsonwebtoken'
import { parseCookies } from 'nookies'

//TODO: delete this

interface IPayload {
  role: string
  sub: string;
}

export const validateToken = (context: any) => {
  const { ['nouhau.token']: token } = parseCookies(context)
  const authorization = ['admin', 'evaluator']
  
  try {
    const user = verify(token, process.env.TOKEN) as IPayload

    if(!authorization.includes(user.role)) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    return {
      props: {
        user: user
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
}
