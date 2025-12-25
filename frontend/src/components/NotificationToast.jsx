import toast from 'react-hot-toast';

export const notifySuccess = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: 'white',
      fontSize: '16px',
    },
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: 'white',
    },
  });
};

export const notifyInfo = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: 'white',
    },
  });
};