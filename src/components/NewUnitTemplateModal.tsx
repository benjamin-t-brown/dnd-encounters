import { DataContext } from 'App';
import { UnitTemplateFormState, formStateToUnitTemplate } from 'data/form';
import {
  createUnitTemplate,
  getUnitTemplateById,
  getUnitTemplateByName,
  saveEncounterDatabase,
} from 'data/storage';
import { getFormValues, useGlobalAlert, useModal } from 'hooks';
import React, { useContext } from 'react';
import UnitTemplateForm from './UnitTemplateForm';
import Button from 'elements/Button';

const NewUnitTemplateModal = (props: { unitTemplateId?: string }) => {
  const data = useContext(DataContext);
  const showAlert = useGlobalAlert();

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      const formValues =
        getFormValues<UnitTemplateFormState>('UnitTemplateForm');
      if (formValues) {
        if (formValues.name === '' || formValues.name.length > 100) {
          showAlert('Unit Template must have a valid name.');
          console.error(
            'invalid name',
            formValues,
            formValues.name,
            formValues.name === '',
            formValues.name.length > 100
          );
          return false;
        }

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
    onCancel: () => {},
    title: 'New Unit Template',
    disableEnterConfirm: true,
    body: (
      <div>
        <UnitTemplateForm
          unitTemplate={
            props.unitTemplateId
              ? getUnitTemplateById(props.unitTemplateId, data) ??
                createUnitTemplate()
              : createUnitTemplate()
          }
          data={data}
        />
      </div>
    ),
  });

  return (
    <>
      <Button
        color="primary"
        id="new-unit-template"
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

export default NewUnitTemplateModal;