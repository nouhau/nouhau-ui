import { 
  Center, 
  Input, 
  Stack, 
  Button
} from '@chakra-ui/react'
import { verify } from 'jsonwebtoken'
import type { GetServerSideProps, NextPage } from 'next'
import Router from 'next/router'
import { parseCookies, setCookie } from 'nookies'
import { useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AuthContext } from '../src/components/contexts/AuthContext'
import Card from '../src/lib/Card'

interface IUser {
  email: string
  password: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ['nouhau.token']: token } = parseCookies(context)

  if(!token){
    return {
      props: {}
    }
  }

  const user: any = verify(
    token,
    process.env.TOKEN
  )

  if(token) {
    return {
      redirect: {
        destination: user.role === 'admin' ? '/admin' : '/alunos',
        permanent: false
      },
      props: {}
    }
  }

  return {
    props: {}
  }
}

const Home: NextPage = () => {
  const { validating, setValidating, setUser } = useContext(AuthContext)
  const { register, handleSubmit } = useForm<IUser>()

  const handleSignIn: SubmitHandler<IUser> = async (data) => {
    setValidating(true)
    await fetch(`${process.env.API_GATEWAY_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(async (response) => {
      const data = await response.json()

      const user: any = verify(
        data.token,
        process.env.TOKEN
      )

      console.log(user)

      if(!data.token || !user) {
        setValidating(false)
        alert('Erro ao logar')
        return { error: 'Login error' }
      }

      setCookie(undefined, 'nouhau.token', data.token, {
        maxAge: 60 * 60 * 24 * 365, //1 year
      });

      setCookie(undefined, 'nouhau.user', user.user_id, {
        maxAge: 60 * 60 * 24 * 365, //1 year
      });

      setUser(user);
      setValidating(false)
      user.role === 'admin' && Router.push('/admin')
      user.role === 'evaluator' && Router.push('/alunos');
    })
  }

  return (
    <Center>
      <Card>
        <Stack padding="5">
          <Center>Login</Center>
          <Input {...register('email')} variant="filled" placeholder="Email" />
          <Input {...register('password')} variant="filled" type="password" placeholder="Senha" />
          {
            !validating ?
            <Button 
              onClick={handleSubmit(handleSignIn)}
              backgroundColor="#10DCAB" size="md">
              Entrar
            </Button>
            :
            <Button
              isLoading
              loadingText='Validando'
              colorScheme='#10DCAB'
              variant='outline'
            >
              Submit
            </Button>
          }
          
        </Stack>
      </Card>
    </Center>
  );
}

export default Home
