import { UnitTemplateFormState, formStateToUnitTemplate } from 'data/form';
import {
  createUnitTemplate,
  getUnitTemplateById,
  getUnitTemplateByName,
  saveEncounterDatabase,
} from 'data/storage';
import { getFormValues, setLSRoute, useGlobalAlert, useModal } from 'hooks';
import React, { useContext } from 'react';
import UnitTemplateForm from './UnitTemplateForm';
import Button from 'elements/Button';
import { randomId } from 'utils';
import { getDataContext } from 'db';

const NewUnitTemplateModal = (props: {
  unitTemplateId?: string;
  clone?: boolean;
}) => {
  const data = useContext(getDataContext());
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
          unitTemplate.id = randomId();
          data.unitTemplates.push(unitTemplate);
          saveEncounterDatabase(data);
          setLSRoute('unit-template:' + unitTemplate.id);
          window.location.reload();
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
        {props.clone ? 'Clone' : '+ Create Unit Template'}
      </Button>
      {modal}
    </>
  );
};

export default NewUnitTemplateModal;
