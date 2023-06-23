import TabNavigationBar from 'components/TabNavigationBar';
import UnitTemplateForm from 'components/UnitTemplateForm';
import { UnitTemplateFormState, formStateToUnitTemplate } from 'data/form';
import {
  getUnitTemplateById,
  getUnitTemplateByName,
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

const EditUnitTemplatePage = () => {
  const route = useLSRoute();
  const showAlert = useGlobalAlert();
  const data = useDatabase();
  const [, unitTemplateId] = route?.split(':') ?? [];
  if (!unitTemplateId) {
    console.error('Invalid unit template id');
    setLSRoute('error');
    return <div></div>;
  }
  const unitTemplate = getUnitTemplateById(unitTemplateId, data);
  if (!unitTemplate) {
    console.error('Unit template not found ' + unitTemplateId);
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
          <h1>Unit Template: {unitTemplate.name}</h1>
          <UnitTemplateForm
            unitTemplate={unitTemplate}
            data={data}
            hideTemplateLoadButton
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
                  getFormValues<UnitTemplateFormState>('UnitTemplateForm');
                if (formValues) {
                  if (formValues.name === '' || formValues.name.length > 100) {
                    showAlert('Unit Template must have a valid name.');
                    return false;
                  }
                  const existingTemplateFromName = getUnitTemplateByName(
                    formValues.name,
                    data
                  );
                  if (
                    existingTemplateFromName &&
                    formValues.name !== unitTemplate.name
                  ) {
                    showAlert('Unit Template must have a unique name.');
                    return false;
                  }

                  const newUnitTemplate = formStateToUnitTemplate(formValues);
                  newUnitTemplate.isCustom = true;
                  Object.assign(unitTemplate, newUnitTemplate);
                  saveEncounterDatabase(data);
                  showAlert('Successfully saved unit template.');
                  setLSRoute('unit-list');
                }
              }}
            >
              Save Unit Template
            </Button>
          </div>
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default EditUnitTemplatePage;
