import React from 'react';
import useLocalStorage  from '../hooks/useLocalStorage';
import './uiStyles/textarea.css';

const TextArea = () => {
  const [{state,setState}] = useLocalStorage('textAreaContent','');

  const handleTextAreaChange = (e) => {
    setState(e.target.value)
  }

  return (
    <div className="textBox-wrapper">
      <textarea 
       DIR="rtl"
       resizable=""
       placeholder=" שלום מאמא! כאן אפשר לכתוב דברים לפני שתשכחי אותם "
       onChange={handleTextAreaChange}
       value={state}
       draggable={false}
      />
    </div>
  )
}

export default TextArea;