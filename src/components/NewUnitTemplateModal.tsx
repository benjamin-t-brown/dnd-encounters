import { DataContext } from 'App';
import { UnitTemplateFormState, formStateToUnitTemplate } from 'data/form';
import {
  createUnitTemplate,
  getUnitTemplateByName,
  saveEncounterDatabase,
} from 'data/storage';
import { getFormValues, useGlobalAlert, useModal } from 'hooks';
import React, { useContext } from 'react';
import UnitTemplateForm from './UnitTemplateForm';
import Button from 'elements/Button';

const NewEncounterTemplateModal = () => {
  const data = useContext(DataContext);
  const showAlert = useGlobalAlert();

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      const formValues =
        getFormValues<UnitTemplateFormState>('UnitTemplateForm');
      if (formValues) {
        if (formValues.name === '' || formValues.name.length > 100) {
          showAlert('Unit Template must have a valid name.');
          return false;
        }

        console.log('confirm', formValues);
        const unitTemplate = formStateToUnitTemplate(formValues);
        const existingTemplate = getUnitTemplateByName(unitTemplate.name, data);
        if (existingTemplate) {
          alert('Unit Template with that name already exists.');
          return false;
        } else {
          data.unitTemplates.push(formStateToUnitTemplate(formValues));
          saveEncounterDatabase(data);
        }
      }
    },
    onCancel: () => {
      console.log('cancel');
    },
    title: 'New Unit Template',
    body: (
      <div>
        <UnitTemplateForm unitTemplate={createUnitTemplate()} data={data} />
      </div>
    ),
  });

  return (
    <>
      <Button
        color="secondary"
        onClick={() => {
          setOpen(true);
        }}
      >
        + Create Unit Template
      </Button>
      {modal}
    </>
  );
};

export default NewEncounterTemplateModal;
