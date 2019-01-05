import React, { Component } from 'react';


const getInputFields = function(field, state) {
  switch(field.type) {
    case 'checkbox':
      return (
        <input 
          id={field.name} 
          name={field.name} 
          type={field.type} 
          data-label={field.label}
          onChange={field.change} 
          checked={
            Object.keys(state.userValues.categories).length > 0 && state.userValues.categories[field.name] ?
            state.userValues.categories[field.name].checked : false 
          } 
        />
      );
    case 'checkbox-spezial':
      return (
        <input 
          id={field.name} 
          name={field.name} 
          type={field.type} 
          onChange={field.change} 
          checked={state.userValues.categories[field.name] || false } 
        />
      );
    case 'textarea':
      return (
          <textarea 
            id={field.name} 
            name={field.name} 
            maxlength="250"
            type={field.type} 
            onChange={field.change}
            value={state.userValues[field.name]}
          />
      );
    case 'radio': 
        return (
          <input 
            id={field.name} 
            name={field.radioName} 
            type={field.type} 
            value={field.value} 
            onChange={field.change} 
            checked={(state.userValues.status === field.value ? true : false)}
          />
        )
    default:
    case 'text':
      return (
          <input 
            id={field.name} 
            name={field.name} 
            type={field.type} 
            onChange={field.change}
            defaultValue={state.userValues[field.name]}
          />
      );
  }
}

export default getInputFields;