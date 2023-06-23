import TabNavigationBar from 'components/TabNavigationBar';
import EncounterTemplateForm from 'components/EncounterTemplateForm';
import {
  EncounterTemplateFormState,
  formStateToEncounterTemplate,
} from 'data/form';
import {
  getEncounterTemplateById,
  getEncounterTemplateByName,
  saveEncounterDatabase,
} from 'data/storage';
import Button from 'elements/Button';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import {
  getFormValues,
  setLSRoute,
  useDatabase,
  useGlobalAlert,
  useLSRoute,
  usePageReRender,
} from 'hooks';
import React from 'react';
import styled from 'styled-components';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const EditEncounterTemplatePage = () => {
  const route = useLSRoute();
  const showAlert = useGlobalAlert();
  const data = useDatabase();
  const [, encounterTemplateId] = route?.split(':') ?? [];
  if (!encounterTemplateId) {
    console.error('Invalid encounter template id');
    setLSRoute('error');
    return <div></div>;
  }
  const encounterTemplate = getEncounterTemplateById(encounterTemplateId, data);
  if (!encounterTemplate) {
    console.error('Encounter template not found ' + encounterTemplateId);
    setLSRoute('error');
    return <div></div>;
  }

  return (
    <>
      <TopBar>
        <CardTitleZone align="left"></CardTitleZone>
        <CardTitle>DND Encounters</CardTitle>
        <CardTitleZone align="right"></CardTitleZone>
      </TopBar>
      <StandardLayout topBar>
        <TabNavigationBar />
        <InnerRoot>
          <h1>Encounter Template: {encounterTemplate.name}</h1>
          <EncounterTemplateForm
            encounterTemplate={encounterTemplate}
            maxHeight={window.innerHeight - 500}
          />
          <div
            style={{
              marginTop: '16px',
            }}
          >
            <Button
              color="primary"
              onClick={() => {
                const formValues = getFormValues<EncounterTemplateFormState>(
                  'EncounterTemplateForm'
                );
                if (formValues) {
                  if (formValues.name === '' || formValues.name.length > 100) {
                    showAlert('Encounter Template must have a valid name.');
                    return false;
                  }
                  const existingTemplateFromName = getEncounterTemplateByName(
                    formValues.name,
                    data
                  );
                  if (
                    existingTemplateFromName &&
                    formValues.name !== encounterTemplate.name
                  ) {
                    showAlert('Encounter Template must have a unique name.');
                    return false;
                  }

                  const newEncounterTemplate =
                    formStateToEncounterTemplate(formValues);
                  Object.assign(encounterTemplate, newEncounterTemplate);
                  saveEncounterDatabase(data);
                  showAlert('Successfully saved encounter template.');
                  setLSRoute('encounter-list');
                }
              }}
            >
              Save Encounter Template
            </Button>
          </div>
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default EditEncounterTemplatePage;
