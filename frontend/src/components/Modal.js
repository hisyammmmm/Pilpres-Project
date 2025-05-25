import React from 'react';
import { FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const Modal = ({ isOpen, type, title, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const icons = {
    success: <FaCheck className="modal-icon-svg" />,
    warning: <FaExclamationTriangle className="modal-icon-svg" />,
    info: <FaInfoCircle className="modal-icon-svg" />
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content modal-${type}`}>
        <div className={`modal-icon ${type}-icon`}>
          {icons[type]}
        </div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          {type === 'warning' ? (
            <>
              <button className="btn btn-secondary" onClick={onClose}>Batal</button>
              <button className="btn btn-red" onClick={onConfirm}>Ya, Keluar</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>Tutup</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;