import React from 'react';
import {Modal} from 'antd';
import useLocalStorage from '../hooks/useLocalStorage';
import ProgressBar from './progress';
import './uiStyles/modal.css';

const ModalAtom = ({
  isModalOpen,
  workDone,
  handleModalClose
}) => {
  const [{state:totalBreakTaken}] = useLocalStorage('breakTaken',{hours:0,minutes:0,seconds:0});

  return (
    <>
      <Modal
        title="יום העבודה שלך"
        visible={isModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        <div className="result-area">
          <div>
            <p>שעות העבודה שלך</p>
            <ProgressBar width={170}  time={workDone} percent={100} />
          </div>
          <div>
            <p>סה"כ ההפסקות שלך<span className="approx"></span></p>
            <ProgressBar width={170} time={totalBreakTaken} percent={100} />
          </div>
        </div>
          {workDone?.hours > 9 && <p className="warning-text">היי! עבדת יותר מעשר שעות<span role="img" aria-labelledby="shock">😲</span></p>}
      </Modal>
    </>
  );
}

export default ModalAtom
