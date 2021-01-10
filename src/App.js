import React,{useEffect} from 'react';
import WorkTimer from './components/workTimer';
import BreakTimer from './components/breakTimer';
import WaterBreakTimer from './components/waterBreakTimer';
import Note from './components/note';
import './App.css';

const App=()=> {
  useEffect(()=>{
    Notification.requestPermission().then(function(permission) {
      if(permission === 'denied'){
        alert('Allow notification in site settings to achieve the functionality!')
      } 
  })
  },[])
  return (
     <div className="main-wrapper">
       <div className="components-wrapper">
        <WorkTimer />
        <p className="clear-note-storage"></p>
        <Note/>
        <div className="break-wrap">
          <BreakTimer />
          <WaterBreakTimer />
          <p className="clear-note"></p>
        </div>
       </div>
     </div>
  );
}

export default App;
