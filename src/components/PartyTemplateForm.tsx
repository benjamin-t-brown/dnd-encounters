import { PartyStorage } from 'data/storage';
import Button from 'elements/Button';
import { FormTextInput } from 'elements/FormInputs';
import { useForm, useGlobalAlert } from 'hooks';
import React from 'react';
import styled from 'styled-components';

const Root = styled.div<Object>(() => {
  return {};
});

interface PartyTemplateFormProps {
  partyTemplate: PartyStorage;
}
const PartyTemplateForm = (props: PartyTemplateFormProps) => {
  const { formState, change, reset } = useForm({
    formId: 'PartyTemplateForm',
    initialValues: {
      ...props.partyTemplate,
    },
  });

  const showAlert = useGlobalAlert();

  return (
    <Root>
      <div>
        <FormTextInput
          label="Party Name"
          name="name"
          formState={formState}
          change={change}
        />
      </div>
      <div
        style={{
          margin: '8px 0',
        }}
      >
        {formState.partyMembers.map((partyMemberName, index) => {
          return (
            <div key={index}>
              <FormTextInput
                label={'Party Member Name ' + (index + 1)}
                name={String(index)}
                formState={formState.partyMembers}
                change={(_, value) => {
                  const newPartyMembers = [...formState.partyMembers];
                  newPartyMembers[index] = value;
                  change('partyMembers', newPartyMembers as any);
                }}
              />
              <Button
                color="secondary"
                onClick={() => {
                  const newPartyMembers = [...formState.partyMembers];
                  newPartyMembers.splice(index, 1);
                  change('partyMembers', newPartyMembers as any);
                }}
                style={{
                  marginLeft: '8px',
                }}
              >
                - Remove
              </Button>
            </div>
          );
        })}
        <Button
          color="primary"
          onClick={() => {
            const newPartyMembers = [...formState.partyMembers, ''];
            if (newPartyMembers.length > 10) {
              showAlert("Can't have more than 10 party members");
              return;
            }
            change('partyMembers', newPartyMembers as any);
          }}
          style={{
            marginTop: '16px',
          }}
        >
          + Add Party Member
        </Button>
      </div>
    </Root>
  );
};

export default PartyTemplateForm;
