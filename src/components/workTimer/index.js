import React,{useState,useEffect} from 'react';
import {Helmet} from "react-helmet";
import { message } from 'antd';
import Calender from '../../components/calender';
import ModalAtom from '../../uiElements/modal';
import useTimer from '../../hooks/useTimer';
import useLocalStorage from '../../hooks/useLocalStorage';
import './workTimer.css';

const WorkTimer=()=> {
  const [{state:existingValue,setState}] = useLocalStorage('timing',null);
  const [{state:isStartClicked,setState:setStartClicked}] = useLocalStorage('isStartClicked',false);
  const [{setState:setTotalBreakTaken}] = useLocalStorage('breakTaken',{hours:0,minutes:0,seconds:0});
  const [state,setStartTime] = useTimer(existingValue,isStartClicked);
  const [isModalOpen,setModalVisible] = useState(false);
  const date = new Date()

  useEffect(() => {
    if(state?.minutes < 0){
      handleEndClick()
    }
  }, [state])



  const handleStartClick = () => {
    message.info('🥛 זמן העבודה התחיל, כדאי לתזמן הפסקת מים');
    setStartClicked(true);
    setState(new Date().toLocaleTimeString())
    setStartTime(new Date().toLocaleTimeString())
  }

  const handleEndClick = () => {
     setStartClicked(false);
     setModalVisible(true);
     setTotalBreakTaken({hours:0,minutes:0,seconds:0})
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }

  return (
      <div className="work-timer-wrap">
         <Helmet>
                <title>{`Work from home tool -${date.toLocaleDateString()} ${state?.hours ? `- worked for ${state?.hours}:${state?.minutes}`:''}`}</title>
                <meta name="description" content="Work from home tool" />

         </Helmet>
       <div className="control-button" onClick={handleStartClick}>
         <div className="control-button-inner">להתחיל</div>
       </div>
       <p className="timer">
         <span className="timer-element">{state?.hours< 10 ? `${0}${state?.hours}`: state?.hours}</span>
         <span className="timer-element">{state?.minutes< 10 ? `${0}${state?.minutes}`: state?.minutes}</span>
         <span className="timer-element">{state?.seconds< 10 ? `${0}${state?.seconds}`: state?.seconds}</span>
       </p>
       <div className="control-button" onClick={handleEndClick}>
         <div className="control-button-inner">לסיים</div>
       </div>
       <Calender/>
       {isModalOpen &&
       <ModalAtom
        isModalOpen = { isModalOpen }
        workDone = { state }
        handleModalClose = { handleModalClose }
       />}
       </div> 
  );
}

export default WorkTimer;
