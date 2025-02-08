import TabNavigationBar from 'components/TabNavigationBar';
import ItemTemplateForm from 'components/ItemTemplateForm';
import { ItemTemplateFormState, formStateToItemTemplate } from 'data/form';
import {
  getItemTemplateById,
  getItemTemplateByName,
  saveEncounterDatabase,
} from 'data/storage';
import BackButton from 'elements/BackButton';
import Button from 'elements/Button';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import HSpace from 'elements/HSpace';
import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import {
  getFormValues,
  setLSRoute,
  useDatabase,
  useGlobalAlert,
  useLSRoute,
  useTemporaryNotification,
} from 'hooks';
import React from 'react';
import styled from 'styled-components';
import NewItemTemplateModal from 'components/NewItemTemplateModal';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const EditItemTemplatePage = () => {
  const route = useLSRoute();
  const showAlert = useGlobalAlert();
  const data = useDatabase();
  const [, itemTemplateId] = route?.split(':') ?? [];

  const { showNotification, notificationComponent } =
    useTemporaryNotification();

  if (!itemTemplateId) {
    console.error('Invalid unit template id');
    setLSRoute('error');
    return <div></div>;
  }
  const itemTemplate = getItemTemplateById(itemTemplateId, data);
  if (!itemTemplate) {
    console.error('Item template not found ' + itemTemplateId);
    setLSRoute('error');
    return <div></div>;
  }

  const onSaveItemTemplate = () => {
    const formValues = getFormValues<ItemTemplateFormState>('ItemTemplateForm');
    if (formValues) {
      if (formValues.name === '' || formValues.name.length > 100) {
        showAlert('Item Template must have a valid name.');
        return false;
      }
      const existingTemplateFromName = getItemTemplateByName(
        formValues.name,
        data
      );
      if (existingTemplateFromName && formValues.name !== itemTemplate.name) {
        showAlert('Item Template must have a unique name.');
        return false;
      }

      const newItemTemplate = formStateToItemTemplate(formValues);
      Object.assign(itemTemplate, newItemTemplate);
      saveEncounterDatabase(data);
      showAlert('Successfully saved item template.');
    }
  };

  const url = new URL(window.location.href);
  url.searchParams.set('itemTemplateId', itemTemplateId);

  return (
    <>
      <TopBar>
        <CardTitleZone align="left">
          <BackButton />
        </CardTitleZone>
        <CardTitle>DND Encounters</CardTitle>
        <CardTitleZone align="right"></CardTitleZone>
      </TopBar>
      <StandardLayout topBar>
        <TabNavigationBar />
        <InnerRoot>
          <h1>Item Template: {itemTemplate.name}</h1>
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <Button color="primary" onClick={onSaveItemTemplate}>
              Save Item Template
            </Button>
            <HSpace />
            <NewItemTemplateModal
              itemTemplateId={itemTemplateId}
              clone={true}
            />
          </div>
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <Button
              onClick={() => {
                navigator.clipboard.writeText(url.href);
                showNotification({
                  message: 'URL copied to clipboard.',
                });
              }}
              color="secondary"
              style={{
                marginRight: '16px',
              }}
            >
              Copy URL
            </Button>
            URL: {url.href}
          </div>
          <ItemTemplateForm itemTemplate={itemTemplate} data={data} />
          <div
            style={{
              marginTop: '16px',
            }}
          >
            <Button color="primary" onClick={onSaveItemTemplate}>
              Save Item Template
            </Button>
          </div>
        </InnerRoot>
      </StandardLayout>
      {notificationComponent}
    </>
  );
};

export default EditItemTemplatePage;
