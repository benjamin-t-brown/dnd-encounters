import {
  createEncounter,
  getEncounterTemplateById,
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
import Button from 'elements/Button';
import { EncounterFormState, formStateToEncounter } from 'data/form';
import { MAX_WIDTH } from 'style';
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
          encounter.campaign = getEncounterTemplateById(
            props.templateId ?? '',
            data
          )?.campaign;
          data.encounters.push(encounter);
          saveEncounterDatabase(data);
          setLSRoute('run-encounter:' + encounter.id);
          // render();
        }
      }
    },
    onCancel: () => {},
    title: 'New Encounter',
    body: (
      <div style={{ minHeight: '600px' }}>
        <EncounterForm
          encounter={createEncounter(
            props.templateId
              ? getEncounterTemplateById(props.templateId, data)
              : undefined
          )}
        />
      </div>
    ),
    maxWidth: String(MAX_WIDTH / 2),
  });

  return (
    <>
      <Button
        id="new-encounter-modal"
        color="secondary"
        onClick={() => {
          setOpen(true);
        }}
      >
        + Run Encounter
      </Button>
      {modal}
    </>
  );
};

export default NewEncounterModal;
