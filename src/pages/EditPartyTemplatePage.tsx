import TabNavigationBar from 'components/TabNavigationBar';
import PartyTemplateForm from 'components/PartyTemplateForm';
import {
  PartyStorage,
  getPartyStorageById,
  getPartyStorageByName,
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

const EditPartyTemplatePage = () => {
  const route = useLSRoute();
  const showAlert = useGlobalAlert();
  const data = useDatabase();
  const [, partyTemplateId] = route?.split(':') ?? [];
  if (!partyTemplateId) {
    console.error('Invalid party template id');
    setLSRoute('error');
    return <div></div>;
  }
  const partyTemplate = getPartyStorageById(partyTemplateId, data);
  if (!partyTemplate) {
    console.error('Party template not found ' + partyTemplateId);
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
          <h1>Party Template: {partyTemplate.name}</h1>
          <PartyTemplateForm
            partyTemplate={partyTemplate}
            // maxHeight={window.innerHeight - 500}
          />
          <div
            style={{
              marginTop: '16px',
            }}
          >
            <Button
              color="primary"
              onClick={() => {
                const formValues =
                  getFormValues<PartyStorage>('PartyTemplateForm');
                if (formValues) {
                  if (formValues.name === '' || formValues.name.length > 100) {
                    showAlert('Party must have a valid name.');
                    return false;
                  }
                  const existingTemplateFromName = getPartyStorageByName(
                    formValues.name,
                    data
                  );
                  if (
                    existingTemplateFromName &&
                    formValues.name !== partyTemplate.name
                  ) {
                    showAlert('Party must have a unique name.');
                    return false;
                  }

                  for (let i = 0; i < formValues.partyMembers.length; i++) {
                    const name = formValues.partyMembers[i];
                    if (name === '' || name.length > 100) {
                      showAlert('All party members must have a valid name.');
                      return false;
                    }
                    if (
                      formValues.partyMembers.slice(i + 1).indexOf(name) > -1
                    ) {
                      showAlert('All party members must have a unique name.');
                      return false;
                    }
                  }

                  const newPartyTemplate = formValues;
                  Object.assign(partyTemplate, newPartyTemplate);
                  partyTemplate.lastUpdated = +new Date();
                  saveEncounterDatabase(data);
                  showAlert('Successfully saved party.');
                  setLSRoute('party-list');
                }
              }}
            >
              Save Party
            </Button>
          </div>
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default EditPartyTemplatePage;
