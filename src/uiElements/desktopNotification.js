import React from 'react';
import Notification from 'react-web-notification';

const DesktopNotification = ({
  title='ניהול עבודה מהבית',
  body,
  sound,
  showDesktopNotification,
  resetValue,
  timing=4000,
}) => {

  const options = {
    tag: 'now',
    body,
    lang: 'Hebrew',
    dir: 'ltr',
  }

  const onPermissionDenied = () => {
     alert('היי מאמא! אפשרי הודעות בהגדרות האתר כדי לקבל התראות חשובות')
  }

  const handleOnShow = () => {
    resetValue()
  }

  return (
    <div>
      {showDesktopNotification &&
       <Notification
        askAgain = {true}
        onShow={handleOnShow}
        onPermissionDenied = {onPermissionDenied}
        timeout={6000}
        title={title}
        options={options}
       />}
    </div>
  )
}

export default DesktopNotification;
