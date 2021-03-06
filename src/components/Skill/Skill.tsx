import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Text,
  Divider,
  Spacer,
  Box
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import { useState } from 'react';

interface ISkill {
  name: string,
  defaultValue: number
  register?: any,
  status: null | number
}

const Skill = ({ name, defaultValue, register, status }: ISkill) => {
  const [value, setValue] = useState<number>(defaultValue)

  return (
    <>
      <Flex direction='row' paddingTop='3' paddingBottom='3' maxW='50%'>
        <Flex direction='row' width='90%'>
          <Text>{name}</Text>
        <Spacer/>
          <NumberInput
            paddingLeft='3'
            precision={1}
            defaultValue={defaultValue}
            step={1}
            min={-1}
            max={3}
            size='xs'
            maxW={20}
            onChange={(value) => {
              setValue(parseFloat(value));
            }}
            value={value}
          >
            <NumberInputField
              {...register}
            />
            {
              register && 
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            }
          </NumberInput>
        </Flex>
        <Spacer/>
        <Box>
          {
            status !== undefined && status !== null ?
            <CheckCircleIcon w={5} h={5} color='#10DCAB'/> :
            <WarningIcon w={5} h={5} color='#b96576'/> 
            
          }
        </Box>
      </Flex>
      <Divider />
    </>
  );
};

export default Skill;
