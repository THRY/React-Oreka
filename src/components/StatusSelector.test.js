import React from 'react'
import ListItem from './ListItem'
import Adapter from 'enzyme-adapter-react-16'
import {shallow, mount, configure} from 'enzyme'
import StatusSelector from './StatusSelector';

configure({ adapter: new Adapter() });

it('renders game status correctly', () => {  
  const wrapper = mount(<StatusSelector  searchingFor="biete" change={() => {}}/>)
  const firstPlayer = wrapper.find('p.label').first().text()
  expect(firstPlayer).toEqual('Nachbarn, die Hilfe bieten')
})