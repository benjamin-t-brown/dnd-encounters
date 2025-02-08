import { DataContext } from 'App';
import { ItemTemplateFormState, formStateToItemTemplate } from 'data/form';
import {
  createItemTemplate,
  getItemTemplateById,
  getItemTemplateByName,
  saveEncounterDatabase,
} from 'data/storage';
import { getFormValues, setLSRoute, useGlobalAlert, useModal } from 'hooks';
import React, { useContext } from 'react';
import ItemTemplateForm from './ItemTemplateForm';
import Button from 'elements/Button';
import { randomId } from 'utils';

const NewItemTemplateModal = (props: {
  itemTemplateId?: string;
  clone?: boolean;
}) => {
  const data = useContext(DataContext);
  const showAlert = useGlobalAlert();

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      const formValues =
        getFormValues<ItemTemplateFormState>('ItemTemplateForm');
      if (formValues) {
        if (formValues.name === '' || formValues.name.length > 100) {
          showAlert('Item Template must have a valid name.');
          console.error(
            'invalid name',
            formValues,
            formValues.name,
            formValues.name === '',
            formValues.name.length > 100
          );
          return false;
        }

        const itemTemplate = formStateToItemTemplate(formValues);
        const existingTemplate = getItemTemplateByName(itemTemplate.name, data);
        if (existingTemplate) {
          alert('Item Template with that name already exists.');
          return false;
        } else {
          itemTemplate.id = randomId();
          if (!data.itemTemplates) {
            data.itemTemplates = [];
          }
          data.itemTemplates.push(itemTemplate);
          saveEncounterDatabase(data);
          setLSRoute('item-template:' + itemTemplate.id);
          window.location.reload();
        }
      }
    },
    onCancel: () => {},
    title: 'New Item Template',
    disableEnterConfirm: true,
    body: (
      <div>
        <ItemTemplateForm
          itemTemplate={
            props.itemTemplateId
              ? getItemTemplateById(props.itemTemplateId, data) ??
                createItemTemplate()
              : createItemTemplate()
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
        id="new-item-template"
        onClick={() => {
          setOpen(true);
        }}
      >
        {props.clone ? 'Clone' : '+ Create Item Template'}
      </Button>
      {modal}
    </>
  );
};

export default NewItemTemplateModal;
