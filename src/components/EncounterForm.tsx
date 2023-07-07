import { encounterToFormState } from 'data/form';
import {
  Encounter,
  getEncounterTemplateById,
  getUnitTemplateById,
} from 'data/storage';
import { FormTextInput } from 'elements/FormInputs';
import InputLabel from 'elements/InputLabel';
import { useDatabase, useForm } from 'hooks';
import React from 'react';
import styled from 'styled-components';
import { sortByDate } from 'utils';
import Select from 'react-select';
import VSpace from 'elements/VSpace';

const Root = styled.div<Object>(() => {
  return {};
});

interface EncounterFormProps {
  encounter: Encounter;
}
const EncounterForm = (props: EncounterFormProps) => {
  const { formState, change, reset } = useForm({
    formId: 'EncounterForm',
    initialValues: encounterToFormState(props.encounter),
  });
  const data = useDatabase();

  const templateOptions = data.encounterTemplates.sort(sortByDate).map(t => {
    return {
      label: t.name,
      value: t.id,
    };
  });
  const templateValue = templateOptions.find(
    t => t.value === formState.templateId
  );

  const template = getEncounterTemplateById(formState.templateId, data);

  return (
    <Root>
      <div>
        <p>
          Campaign: <b>{template?.campaign || '(no campaign)'}</b>
        </p>
        <FormTextInput
          label="Name"
          name="name"
          formState={formState}
          change={change}
        />
      </div>
      <div>
        <VSpace />
        <InputLabel>Select Template</InputLabel>
        <Select
          options={templateOptions}
          styles={{
            option: provided => ({
              ...provided,
              color: '#000',
              cursor: 'pointer',
            }),
            control: provided => ({
              ...provided,
              cursor: 'pointer',
              marginTop: '8px',
            }),
            singleValue: provided => {
              return { ...provided };
            },
          }}
          value={templateValue}
          onChange={ev => {
            const id = ev?.value ?? '';
            change('templateId', id);
          }}
        />
      </div>
      <VSpace />
      <div>
        <InputLabel>Select Party</InputLabel>
        <Select
          options={data.parties.sort(sortByDate).map(t => {
            return {
              label: t.name,
              value: t.id,
            };
          })}
          styles={{
            option: provided => ({
              ...provided,
              color: '#000',
              cursor: 'pointer',
            }),
            control: provided => ({
              ...provided,
              cursor: 'pointer',
              marginTop: '8px',
            }),
            singleValue: provided => {
              return { ...provided };
            },
          }}
          onChange={ev => {
            const id = ev?.value ?? '';
            change('partyId', id);
          }}
        />
      </div>
    </Root>
  );
};

export default EncounterForm;
