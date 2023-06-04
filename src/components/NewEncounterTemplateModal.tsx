import {
  createEncounterTemplate,
  getEncounterTemplateByName,
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
import EncounterTemplateForm from './EncounterTemplateForm';
import Button from 'elements/Button';
import {
  EncounterTemplateFormState,
  formStateToEncounterTemplate,
} from 'data/form';
import { MAX_HEIGHT_MODAL } from 'style';

const NewEncounterTemplateModal = () => {
  const data = useDatabase();
  const render = usePageReRender();
  const showAlert = useGlobalAlert();

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      const formValues = getFormValues<EncounterTemplateFormState>(
        'EncounterTemplateForm'
      );
      if (formValues) {
        if (formValues.name === '' || formValues.name.length > 100) {
          showAlert('Encounter Template must have a valid name.');
          return false;
        }

        const encounterTemplate = formStateToEncounterTemplate(formValues);
        const existingTemplate = getEncounterTemplateByName(
          encounterTemplate.name,
          data
        );
        if (existingTemplate) {
          showAlert('Encounter Template with that name already exists.');
          return false;
        } else {
          data.encounterTemplates.push(encounterTemplate);
          saveEncounterDatabase(data);
          render();
        }
      }
    },
    onCancel: () => {},
    title: 'New Encounter Template',
    body: (
      <div>
        <EncounterTemplateForm
          encounterTemplate={createEncounterTemplate()}
          maxHeight={MAX_HEIGHT_MODAL}
        />
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
        + Create Encounter Template
      </Button>
      {modal}
    </>
  );
};

export default NewEncounterTemplateModal;
