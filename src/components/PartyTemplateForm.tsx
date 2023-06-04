import { PartyStorage } from 'data/storage';
import Button from 'elements/Button';
import { FormTextInput, FormTextInputFullWidth } from 'elements/FormInputs';
import ImagePortrait from 'elements/ImagePortrait';
import { useForm, useGlobalAlert } from 'hooks';
import React from 'react';
import { MAX_HEIGHT_MODAL, getColors } from 'style';
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
        <br />
        <br />
        <ImagePortrait imgUrl={formState.imgUrl} hideThreshold={-1} />
        <br />
        <FormTextInputFullWidth
          label="Image"
          name="imgUrl"
          formState={formState}
          change={change}
        />
      </div>
      <div
        style={{
          margin: '8px 0',
          // maxHeight: MAX_HEIGHT_MODAL + 'px',
          overflow: 'auto',
          paddingTop: '8px',
          borderTop: '1px solid ' + getColors().TEXT_DESCRIPTION,
        }}
      >
        {formState.partyMembers.map((partyMemberName, index) => {
          return (
            <div key={index}>
              <div>
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
                  color="plain"
                  onClick={() => {
                    const newPartyMembers = [...formState.partyMembers];
                    newPartyMembers.splice(index, 1);
                    const partyMembersImages = [
                      ...formState.partyMembersImages,
                    ];
                    partyMembersImages.splice(index, 1);
                    change('partyMembers', newPartyMembers as any);
                    change('partyMembersImages', partyMembersImages as any);
                  }}
                  style={{
                    marginLeft: '8px',
                  }}
                >
                  - Remove
                </Button>
              </div>
              <div>
                <FormTextInputFullWidth
                  label="Image"
                  name={String(index)}
                  formState={formState.partyMembersImages ?? []}
                  change={(_, value) => {
                    const newPartyMembersImages = [
                      ...formState.partyMembersImages,
                    ];
                    newPartyMembersImages[index] = value;
                    change('partyMembersImages', newPartyMembersImages as any);
                  }}
                />
              </div>
            </div>
          );
        })}
        <Button
          color="secondary"
          onClick={() => {
            const newPartyMembers = [...formState.partyMembers, ''];
            // if (newPartyMembers.length > 10) {
            //   showAlert("Can't have more than 10 party members");
            //   return;
            // }
            const newPartyMembersImages = [...formState.partyMembersImages, ''];
            change('partyMembers', newPartyMembers as any);
            change('partyMembersImages', newPartyMembersImages as any);
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
