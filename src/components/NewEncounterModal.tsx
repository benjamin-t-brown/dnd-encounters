import {
  createEncounter,
  createEncounterTemplate,
  getEncounterTemplateByName,
  saveEncounterDatabase,
} from 'data/storage';
import {
  getFormValues,
  setLSRoute,
  useDatabase,
  useGlobalAlert,
  useModal,
  usePageReRender,
} from 'hooks';
import React from 'react';
import EncounterTemplateForm from './EncounterTemplateForm';
import Button from 'elements/Button';
import {
  EncounterFormState,
  EncounterTemplateFormState,
  formStateToEncounter,
  formStateToEncounterTemplate,
} from 'data/form';
import { MAX_HEIGHT_MODAL, MAX_WIDTH } from 'style';
import EncounterForm from './EncounterForm';
import { getEncounterByName } from 'data/storage';

const NewEncounterModal = (props: { templateId?: string }) => {
  const data = useDatabase();
  const render = usePageReRender();
  const showAlert = useGlobalAlert();

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      const formValues = getFormValues<EncounterFormState>('EncounterForm');
      if (formValues) {
        console.log('confirm', formValues);
        if (formValues.name === '' || formValues.name.length > 100) {
          showAlert('Encounter must have a valid name.');
          return false;
        }
        if (!formValues.templateId) {
          showAlert('Encounter must have an encounter template.');
          return false;
        }
        if (!formValues.partyId) {
          showAlert('Encounter must have a party template.');
          return false;
        }

        const encounter = formStateToEncounter(formValues, data);
        const existingEncounter = getEncounterByName(encounter.name, data);
        if (existingEncounter) {
          showAlert('Encounter with that name already exists.');
          return false;
        } else {
          data.encounters.push(encounter);
          saveEncounterDatabase(data);
          setLSRoute('run-encounter:' + encounter.id);
          // render();
        }
      }
    },
    onCancel: () => {
      console.log('cancel');
    },
    title: 'New Encounter',
    body: (
      <div>
        <EncounterForm encounter={createEncounter(props.templateId)} />
      </div>
    ),
    maxWidth: String(MAX_WIDTH / 2),
  });

  return (
    <>
      <Button
        id="new-encounter-modal"
        color="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        + Create Encounter
      </Button>
      {modal}
    </>
  );
};

export default NewEncounterModal;
