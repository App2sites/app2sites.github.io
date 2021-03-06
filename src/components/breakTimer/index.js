import React,{useState,useEffect} from 'react';
import Switch from '../../uiElements/switch';
import { Tooltip,message } from 'antd';
import ProgressBar from '../../uiElements/progress';
import {ALARM_TONE} from '../../helpers/sounds';
import DesktopNotification from '../../uiElements/desktopNotification';
import useLocalStorage  from '../../hooks/useLocalStorage';
import useReduceTimer from '../../hooks/useReduceTimer';
import useBreakTimer from '../../hooks/useBreakTimer';
import PlayButton from '../icons/play.svg';
import StopButton from '../icons/stop.svg';
import PlusIcon from '../icons/plus.svg';
import MinusIcon from '../icons/minus.svg';
import './breakTimer.css';

var breakTimerSetIntervalTime=0;
const audio = new Audio(ALARM_TONE);
const BreakTimer = () => {
  const [breakTime,setBreakTime] = useState({
    seconds:0,
    minutes:5
  });
  const [isBreakStartClicked,setBreakStartClicked] = useState(false);
  const [{state:isEnableNotification,setState:setEnableNotification}] = useLocalStorage('isDesktopNotificationBreak',true);
  const [{state:isAlarmEnabled,setState:setAlarmEnabled}] = useLocalStorage('isAlarmEnabled',true);
  const [state,setState] = useReduceTimer({minutes:5,seconds:0},isBreakStartClicked)
  const [timer,setTotalBreakTiming] = useBreakTimer()
  const [showDesktopNotification,setDesktopNotification] = useState(false);

  window.onbeforeunload = function() {
      return 'err';
  };

  useEffect(()=>{
    return (()=> clearInterval(breakTimerSetIntervalTime))
  },[])

  const handleSetInterval = () => {
    breakTimerSetIntervalTime=setInterval(function(){
      if(isEnableNotification){
        setDesktopNotification(true)
       }
       if(isAlarmEnabled){
         playAudio()
       }
       handleEnd(false)
       }, breakTime?.minutes * 60000);
   }

  const playAudio = () => {
    audio.play();
  }

  const stopAudio=(audio)=> {
    audio.pause();
    audio.currentTime = 0;
}


  const handleIncrement = () => {
    if(breakTime?.minutes<60)
    {
      setBreakTime(prevBreakTime => {
        return {...prevBreakTime, minutes: prevBreakTime.minutes+5};
      });
      setState(prevState => {
          return {...prevState, minutes: prevState.minutes+5};
      })
    }
  }

  const handleDecrement = () => {
     if(breakTime?.minutes>5)
     {
      setBreakTime(prevBreakTime => {
        return {...prevBreakTime, minutes: prevBreakTime.minutes-5};
      });
      setState(prevState => {
        return {...prevState, minutes: prevState.minutes-5};
    })
     }
   
  }

  const handleStart = () => {
    message.info(` ⏳ ההפסקה התחילה `);

    setBreakStartClicked(!isBreakStartClicked);
    setState(breakTime)
    setTotalBreakTiming(breakTime?.minutes)
    handleSetInterval()
  }

  const handleEnd = (fromIntervalFn=true) => {
    setBreakStartClicked(false);
    if(isBreakStartClicked){
      timer({
        breakTaken : fromIntervalFn ? state: breakTime,
        totalBreak : breakTime?.minutes
      })
    }
  
    setState({
      seconds:0,
      minutes:breakTime?.minutes
    })
    window.clearInterval(breakTimerSetIntervalTime)
    fromIntervalFn && stopAudio(audio)
  }

  const resetValue = () => {
    setDesktopNotification(false)
  }

  const handleDesktopSwitchChange = (value) => {
    setEnableNotification(value)
  }

  const handleAlertSwitchChange = (value) => {
    setAlarmEnabled(value)
  }

  return (
    <div className="break-wrapper">
     <div className="break-control-wrapper">
      <div className="set-break-wrapper">
        <p>לקחת פסק זמן</p>
        <div className="set-break-time">
         <figure className="set-break-icon" onClick={handleIncrement}><img src={PlusIcon} alt="plus"/> </figure>
           <p>{breakTime?.minutes}  דקות</p>
           <figure className="set-break-icon" onClick={handleDecrement}><img src={MinusIcon} alt="minus"/> </figure>
        </div>
       </div>

        <div className="switch-wrapper">
        <Switch label={"התראה בשולחן העבודה"} handleSwitchChange={handleDesktopSwitchChange} checked={isEnableNotification}/>
        <Switch label={"התראה עם צלצול"} handleSwitchChange={handleAlertSwitchChange} checked={isAlarmEnabled}/>
        </div>
      </div> 

      <div>
       <ProgressBar time={state} totalTime={breakTime?.minutes}/>
      <div className="timer-control-wrapper">
        <figure className="timer-icons" onClick={handleStart}><img className="timer-img" src={PlayButton} alt="play/pause"/></figure>
        <figure className="timer-icons" onClick={handleEnd}><img className="timer-img"  src={StopButton} alt="stop"/></figure>
       </div>
      </div>

       <DesktopNotification
        title="Work from home tool"
        body=" 💖 ההפסקה הסתיימה "
        timing ={8000}
        showDesktopNotification = { isEnableNotification?showDesktopNotification:false }
        resetValue = { resetValue }
      />
    </div>
  )
}

export default BreakTimer;