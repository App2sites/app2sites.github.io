import React,{useState,useEffect} from 'react';
import {message} from 'antd';
import {WATER_TONE} from '../../helpers/sounds';
import Switch from '../../uiElements/switch';
import DesktopNotification from '../../uiElements/desktopNotification';
import ProgressBar from '../../uiElements/progress';
import useLocalStorage  from '../../hooks/useLocalStorage';
import useReduceTimer from '../../hooks/useReduceTimer';
import PlusIcon from '../icons/plus.svg';
import MinusIcon from '../icons/minus.svg';
import PlayButton from '../icons/play.svg';
import StopButton from '../icons/stop.svg';
import './waterBreak.css'

var waterTimerSetIntervalTime=0;
const WaterBreakTimer = () => {
  const [waterBreakTime,setWaterBreakTime] = useState({
    seconds:0,
    minutes:20
  });
  const [showDesktopNotification,setDesktopNotification] = useState(false);
  const [isWaterBreakStartClicked,setWaterBreakStartClicked] = useState(false);
  const [{state:isEnableNotification,setState:setEnableNotification}] = useLocalStorage('isDesktopNotificationWater',true);
  const [state,setState] = useReduceTimer({minutes:0,seconds:0},isWaterBreakStartClicked)

  useEffect(() => {
    if(state?.seconds===0 && state?.minutes===0){
      setState(prevBreakTime => {
        return {...prevBreakTime, minutes: waterBreakTime?.minutes,seconds:0};
      });
   }
  }, [state, setState, waterBreakTime])

  useEffect(()=>{
    return (()=> clearInterval(waterTimerSetIntervalTime))
  },[])



  const handleSetInterval = () => {
   waterTimerSetIntervalTime=setInterval(function(){
       setDesktopNotification(true) 
       setState({
         minutes:waterBreakTime?.minutes-1,seconds:59
       })
      }, waterBreakTime?.minutes * 60000);
  }

   
  const handleIncrement = () => {
    if(waterBreakTime?.minutes<60){
      setWaterBreakTime(prevBreakTime => {
        return {...prevBreakTime, minutes: prevBreakTime.minutes+10};
      });
      setState(prevState=>{
        return {...prevState, minutes: prevState.minutes+10};
      })
    }
  
  }
  const handleDecrement = () => {
     if(waterBreakTime?.minutes>20){
      setWaterBreakTime(prevBreakTime => {
        return {...prevBreakTime, minutes: prevBreakTime.minutes-10};
      });
      setState(prevState=>{
        return {...prevState, minutes: prevState.minutes-10};
      })
     }
    
  }

  const handleStart = () => {
    setWaterBreakStartClicked(true);
    setState(waterBreakTime);
    handleSetInterval();
    message.info('⏲ התחלתי לספור');
  }

  const handleEnd = () => {
    setWaterBreakStartClicked(false);
    setState({
      seconds:0,
      minutes: waterBreakTime?.minutes
    })
    clearInterval(waterTimerSetIntervalTime);
  }

  const resetValue = () => {
    setDesktopNotification(false)
  }

  const handleSwitchChange = (value) => {
    setEnableNotification(value)
  }

  return (
    <div className="water-break-wrapper">
        <div className="notify-text-water">
        </div>

        <div>
        <ProgressBar time={state} totalTime={waterBreakTime?.minutes}/>
        <div className="water-break-control">
        <figure className="timer-icons" onClick={handleStart}><img className="timer-img"  src={PlayButton} alt="play/pause"/></figure>
        <figure className="timer-icons" onClick={handleEnd}><img className="timer-img" src={StopButton} alt="stop"/></figure>
        </div>
       </div> 


       <div className="set-water-break-wrapper">
        <div className="set-water-break">
          <p>תזמון הפסקת מים</p>
          <div className="water-break-timer">
            <figure className="set-break-icon" onClick={handleIncrement}>
              <img  src={PlusIcon} alt="play"/>
            </figure>
            <p>{waterBreakTime?.minutes}  דקות</p>
            <figure className="set-break-icon" onClick={handleDecrement}>
              <img src={MinusIcon} alt="minus"/>
            </figure>
          </div>
        </div>
         <Switch label={"התראה בשולחן העבודה"} handleSwitchChange={handleSwitchChange} checked={isEnableNotification}/>
         </div>
     


       <DesktopNotification
        title="Work from home tool"
        body="☀ זמן להפסקת מים"
        sound={WATER_TONE}
        showDesktopNotification = { isEnableNotification?showDesktopNotification:false }
        isEnable = {  showDesktopNotification }
        resetValue = { resetValue }
      />
    </div>
  )
}

export default WaterBreakTimer;