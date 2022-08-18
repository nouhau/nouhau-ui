import { render, screen } from '@testing-library/react';
import * as nookies from 'nookies'
import Header from './Header'
import '@testing-library/jest-dom'

jest.mock('nookies', () => ({
  destroyCookie: jest.fn()
}))
describe('Teste', ()=> {
  
  it('Test', () => {
    expect(2).toBe(2)
  })
})
