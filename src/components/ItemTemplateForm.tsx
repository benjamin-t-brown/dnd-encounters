import { itemTemplateToFormState } from 'data/form';
import { EncounterDatabase, ItemTemplate } from 'data/storage';
import {
  FormOptionsInput,
  FormRte,
  FormTextInput,
  FormTextInputFullWidth,
} from 'elements/FormInputs';
import HSpace from 'elements/HSpace';
import ImagePortrait from 'elements/ImagePortrait';
import { useForm, useGlobalAlert } from 'hooks';
import React from 'react';
import styled from 'styled-components';

interface ItemTemplateFormProps {
  itemTemplate: ItemTemplate;
  data: EncounterDatabase;
}

const Root = styled.div<Object>(() => {
  return {
    marginRight: '8px',
  };
});

export default function ItemTemplateForm(props: ItemTemplateFormProps) {
  const { itemTemplate, data } = props;
  const { formState, change, reset } = useForm({
    formId: 'ItemTemplateForm',
    initialValues: itemTemplateToFormState(itemTemplate),
  });
  const showInfo = useGlobalAlert();
  return (
    <Root>
      <ImagePortrait
        imgUrl={formState.imgUrl}
        hideThreshold={-1}
        large={true}
      />
      <br />
      <FormTextInputFullWidth
        label="Image URL"
        name="imgUrl"
        formState={formState}
        change={change}
      />
      <br />
      <FormTextInput
        label="Name"
        name="name"
        formState={formState}
        change={change}
      />
      <HSpace />
      <FormOptionsInput
        label="Rarity"
        name="rarity"
        formState={formState}
        change={change}
        options={[
          {
            label: 'Common',
            value: 'common',
          },
          {
            label: 'Uncommon',
            value: 'uncommon',
          },
          {
            label: 'Rare',
            value: 'rare',
          },
          {
            label: 'Very Rare',
            value: 'very rare',
          },
          {
            label: 'Legendary',
            value: 'legendary',
          },
        ]}
      />
      <div>
        <FormRte
          label="Notes"
          name="notes"
          formState={formState}
          change={change}
        />
      </div>
    </Root>
  );
}
