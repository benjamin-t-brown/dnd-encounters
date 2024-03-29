import {
  Encounter,
  UnitTemplate,
  createUnit,
  getUnitTemplateById,
  saveEncounterDatabase,
} from 'data/storage';
import Button from 'elements/Button';
import InputLabel from 'elements/InputLabel';
import { useDatabase, useModal, usePageReRender } from 'hooks';
import React from 'react';
import { MAX_WIDTH } from 'style';
import Select from 'react-select';
import { FormStatNumberInput } from 'elements/FormInputs';

const AddUnitToEncounterModal = (props: { encounter: Encounter }) => {
  const data = useDatabase();
  const [unitTemplate, setUnitTemplate] = React.useState<
    UnitTemplate | undefined
  >();
  const render = usePageReRender();
  const [amount, setAmount] = React.useState<number>(1);

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      if (unitTemplate) {
        for (let i = 0; i < amount; i++) {
          const unit = createUnit(unitTemplate);
          unit.current.publicId =
            props.encounter.units.filter(unit => !unit.isPlayer).length + 1;
          props.encounter.units.push(unit);
        }
        saveEncounterDatabase(data);
        render();
      }
    },
    onCancel: () => {},
    title: 'Add Unit',
    body: (
      <div
        style={{
          minHeight: '375px',
        }}
      >
        <InputLabel>Select Template</InputLabel>
        <Select
          options={data.unitTemplates
            .sort((a, b) => {
              return a.name.localeCompare(b.name);
            })
            .map(unitTemplate => {
              return {
                label: unitTemplate.name,
                value: unitTemplate.id,
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
            if (id) {
              const template = getUnitTemplateById(id, data);
              if (template) {
                setUnitTemplate(template);
              }
            }
          }}
        />
        <br />
        <FormStatNumberInput
          label="Amount"
          name="amount"
          formState={{ amount }}
          change={(_, value) => {
            setAmount(value);
          }}
        />
      </div>
    ),
    maxWidth: MAX_WIDTH / 2 + 'px',
  });

  return (
    <>
      <Button
        fullWidth
        color="plain"
        onClick={ev => {
          ev.stopPropagation();
          setOpen(true);
        }}
        style={{}}
      >
        + Add Unit To Enc
      </Button>
      {modal}
    </>
  );
};

export default AddUnitToEncounterModal;
