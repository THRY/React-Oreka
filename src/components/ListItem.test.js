import React from 'react'
import ListItem from './ListItem'
import Adapter from 'enzyme-adapter-react-16'
import {shallow, mount, configure} from 'enzyme'
import { StaticRouter } from 'react-router'


configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  let user = {}
  user.categories = [ 
    {
      'einkaufen': true,
      'checked': true
    }
  ];
  shallow(<ListItem user={user}/>);
});



it('check if class name for list item is set correctly', () =>{
  let user = {}
  user.categories = [ 
    {
      'einkaufen': true,
      'checked': true
    }
  ];
  user.status = 'biete';

  const context = {};

  let wrapper = mount(
    <StaticRouter location="/" context={context}>
      <ListItem user={user}/>
    </StaticRouter>
  )

  expect(wrapper.find('.list-item').first().hasClass('biete')).toBe(true);
})