import { EncounterDatabase, loadEncounterDatabase } from 'data/storage';
import { useModal, useReRender } from 'hooks';
import React, { useEffect } from 'react';
import Router from 'router';
import { MAX_WIDTH } from 'style';

const data = loadEncounterDatabase();
(window as any).data = data;
export const DataContext = React.createContext<EncounterDatabase>(data);

(window as any).reRender = () => void 0;

const App = () => {
  const reRender = useReRender();
  (window as any).reRender = reRender;

  useEffect(() => {
    let debounceResizeId: any;
    window.addEventListener('resize', () => {
      if (debounceResizeId !== false) {
        clearTimeout(debounceResizeId);
        debounceResizeId = false;
      }
      debounceResizeId = setTimeout(() => {
        reRender();
        debounceResizeId = false;
      }, 50);
    });
  }, []);

  const [confirmModalText, setConfirmModalText] = React.useState('');
  const [modalCb, setModalCb] = React.useState<any>({
    cb: () => void 0,
  });
  const { modal: confirmModal, setOpen: setConfirmModalOpen } = useModal({
    body: <div>{confirmModalText}</div>,
    confirmText: 'Yes',
    onConfirm: () => {
      modalCb.cb();
    },
    cancelText: 'Cancel',
    onCancel: () => {},
    maxWidth: MAX_WIDTH / 2 + 'px',
    title: 'Confirm',
  });
  (window as any).showConfirmModal = (text: string, cb: () => void) => {
    setConfirmModalText(text);
    setModalCb({
      cb,
    });
    setConfirmModalOpen(true);
  };

  const [infoModalText, setInfoModalText] = React.useState('');
  const { modal: infoModal, setOpen: setInfoModalOpen } = useModal({
    body: <div>{infoModalText}</div>,
    confirmText: 'Okay',
    maxWidth: MAX_WIDTH / 2 + 50 + 'px',
    title: 'Info',
  });
  (window as any).showInfoModal = (text: string) => {
    setInfoModalText(text);
    setInfoModalOpen(true);
  };

  return (
    // <React.StrictMode>
    <DataContext.Provider value={data}>
      <Router />
      {confirmModal}
      {infoModal}
      {/* <EncounterListPage data={data} /> */}
    </DataContext.Provider>
    // </React.StrictMode>
  );
};

export default App;
