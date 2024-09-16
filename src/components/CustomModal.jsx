import React from 'react';
import { Modal } from 'antd';
const CustomModal = ({ title, isModalOpen, handleOk, handleCancel, children, footer, width, maskClosable }) => {
  return (
    <>
      <Modal
        title={title}

        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={footer}
        width={width}
        maskClosable={maskClosable}
      >
        {children}
      </Modal>
    </>
  );
};
export default CustomModal;