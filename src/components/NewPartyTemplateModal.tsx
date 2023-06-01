import {
  PartyStorage,
  createPartyStorage,
  getEncounterTemplateByName,
  getPartyStorageByName,
  saveEncounterDatabase,
} from 'data/storage';
import {
  getFormValues,
  useDatabase,
  useGlobalAlert,
  useModal,
  usePageReRender,
} from 'hooks';
import React from 'react';
import Button from 'elements/Button';
import PartyTemplateForm from './PartyTemplateForm';
import { MAX_WIDTH } from 'style';

const NewPartyTemplateModal = () => {
  const data = useDatabase();
  const render = usePageReRender();
  const showAlert = useGlobalAlert();

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      const formValues = getFormValues<PartyStorage>('PartyTemplateForm');
      if (formValues) {
        console.log('confirm', formValues);
        if (formValues.name === '' || formValues.name.length > 100) {
          showAlert('Party must have a valid name.');
          return false;
        }
        const existingTemplate = getPartyStorageByName(formValues.name, data);
        if (existingTemplate) {
          showAlert('Party with that name already exists.');
          return false;
        }

        for (let i = 0; i < formValues.partyMembers.length; i++) {
          const name = formValues.partyMembers[i];
          if (name === '' || name.length > 100) {
            showAlert('All party members must have a valid name.');
            return false;
          }
          if (formValues.partyMembers.slice(i + 1).indexOf(name) > -1) {
            showAlert('All party members must have a unique name.');
            return false;
          }
        }

        data.parties.push(formValues);
        saveEncounterDatabase(data);
        render();
      }
    },
    onCancel: () => {
      console.log('cancel');
    },
    title: 'New Party',
    maxWidth: String(MAX_WIDTH / 2) + 'px',
    body: (
      <div>
        <PartyTemplateForm partyTemplate={createPartyStorage()} />
      </div>
    ),
  });

  return (
    <>
      <Button
        color="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        + Create Party
      </Button>
      {modal}
    </>
  );
};

export default NewPartyTemplateModal;
