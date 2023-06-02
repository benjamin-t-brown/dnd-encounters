import { unitTemplateToFormState } from 'data/form';
import {
  EncounterDatabase,
  UnitTemplate,
  getUnitTemplateById,
} from 'data/storage';
import InputLabel from 'elements/InputLabel';
import { useForm } from 'hooks';
import React, { useState } from 'react';
import { getColors } from 'style';
import styled from 'styled-components';
import Select from 'react-select';
import { useModal } from 'hooks';
import Button from 'elements/Button';
import { randomId } from 'utils';
import {
  FormCheckboxInput,
  FormOptionsInput,
  FormRte,
  FormStatNumberInput,
  FormTextAreaInput,
  FormTextInput,
  FormTextInputFullWidth,
} from 'elements/FormInputs';
import HSpace from 'elements/HSpace';
import VSpace from 'elements/VSpace';
import { getModifier } from 'data/dice';

const Root = styled.div<Object>(() => {
  return {};
});

interface UnitTemplateFormProps {
  unitTemplate: UnitTemplate;
  data: EncounterDatabase;
  hideTemplateLoadButton?: boolean;
}
const UnitTemplateForm = (props: UnitTemplateFormProps) => {
  const { formState, change, reset } = useForm({
    formId: 'UnitTemplateForm',
    initialValues: unitTemplateToFormState(props.unitTemplate),
  });

  const [unitTemplateToLoad, setUnitTemplateToLoad] =
    useState<UnitTemplate | null>(null);

  const { modal, setOpen } = useModal({
    title: 'Load Existing Unit Template',
    onConfirm: () => {
      if (unitTemplateToLoad) {
        reset({
          ...unitTemplateToFormState(unitTemplateToLoad),
          id: randomId(),
        });
      }
      setUnitTemplateToLoad(null);
    },
    onCancel: () => {
      setUnitTemplateToLoad(null);
    },
    body: (
      <div>
        <InputLabel>Select Template</InputLabel>
        <Select
          options={props.data.unitTemplates
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
              const template = getUnitTemplateById(id, props.data);
              if (template) {
                console.log('set template', id, template);
                setUnitTemplateToLoad(template);
              }
            }
          }}
        />
      </div>
    ),
  });

  return (
    <>
      <Root>
        <div
          style={{
            margin: '24px 0',
            display: props.hideTemplateLoadButton ? 'none' : 'block',
            // padding: '12px 0',
            // width: '50%',
            // borderBottom: '1px solid ' + getColors().TEXT_DESCRIPTION,
            // display: 'flex',
            // flexDirection: 'row',
            // flexWrap: 'wrap',
          }}
        >
          <Button
            color="secondary"
            onClick={() => {
              setOpen(true);
            }}
          >
            Load Existing Template
          </Button>
        </div>
        <div>
          <FormTextInputFullWidth
            label="Image"
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
            label="Type"
            name="type"
            options={[
              {
                label: 'Humanoid',
                value: 'humanoid',
              },
            ]}
            formState={formState}
            change={change}
          />
          <HSpace />
          <FormOptionsInput
            label="Size"
            name="size"
            options={[
              {
                label: 'Tiny',
                value: 'tiny',
              },
              {
                label: 'Small',
                value: 'small',
              },
              {
                label: 'Medium',
                value: 'medium',
              },
              {
                label: 'Large',
                value: 'large',
              },
              {
                label: 'Huge',
                value: 'huge',
              },
              {
                label: 'Gargantuan',
                value: 'gargantuan',
              },
            ]}
            formState={formState}
            change={change}
          />
          <HSpace />
          <FormOptionsInput
            label="Alignment"
            name="alignment"
            options={[
              {
                label: 'Any',
                value: 'any',
              },
              {
                label: 'Any Good',
                value: 'any good',
              },
              {
                label: 'Any Neutral',
                value: 'any neutral',
              },
              {
                label: 'Any Evil',
                value: 'any evil',
              },
              {
                label: 'Lawful Good',
                value: 'lawful good',
              },
              {
                label: 'Neutral Good',
                value: 'neutral good',
              },
              {
                label: 'Chaotic Good',
                value: 'chaotic good',
              },
              {
                label: 'Lawful Neutral',
                value: 'lawful neutral',
              },
              {
                label: 'Neutral',
                value: 'neutral',
              },
              {
                label: 'Chaotic Neutral',
                value: 'chaotic neutral',
              },
              {
                label: 'Lawful Evil',
                value: 'lawful evil',
              },
              {
                label: 'Neutral Evil',
                value: 'neutral evil',
              },
              {
                label: 'Chaotic Evil',
                value: 'chaotic evil',
              },
            ]}
            formState={formState}
            change={change}
          />
        </div>
        <div
          style={{
            width: '75%',
          }}
        >
          <FormStatNumberInput
            label="Speed"
            name="speed"
            formState={formState}
            change={change}
          />
          <HSpace />
          <FormStatNumberInput
            label="Speed Water"
            name="speedSwim"
            formState={formState}
            change={change}
          />
          <HSpace />
          <FormStatNumberInput
            label="Speed Fly"
            name="speedFly"
            formState={formState}
            change={change}
          />
          <HSpace />
          <FormTextInputFullWidth
            label="Immunities"
            name="immunities"
            formState={formState}
            change={change}
          />
          <HSpace />
          <FormTextInputFullWidth
            label="Resistances"
            name="resistances"
            formState={formState}
            change={change}
          />
          <HSpace />
          <FormTextInputFullWidth
            label="Vulnerabilities"
            name="vulnerabilities"
            formState={formState}
            change={change}
          />
        </div>
        <div
          style={{
            margin: '12px 0',
            padding: '12px',
            border: '1px solid ' + getColors().TEXT_DESCRIPTION,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          <FormStatNumberInput
            label="HP"
            name="hp"
            formState={formState}
            change={change}
          />
          <FormStatNumberInput
            label="Armor Class"
            name="ac"
            formState={formState}
            change={change}
          />
          <HSpace />
          <HSpace />
          <HSpace />
          <div>
            <FormStatNumberInput
              label="STR"
              name="STR"
              formState={formState}
              change={change}
            />{' '}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {(getModifier(formState.STR) > 0 ? '+' : '') +
                getModifier(formState.STR)}
            </div>
          </div>
          <div>
            <FormStatNumberInput
              label="DEX"
              name="DEX"
              formState={formState}
              change={change}
            />{' '}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {(getModifier(formState.DEX) > 0 ? '+' : '') +
                getModifier(formState.DEX)}
            </div>
          </div>
          <div>
            <FormStatNumberInput
              label="CON"
              name="CON"
              formState={formState}
              change={change}
            />{' '}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {(getModifier(formState.CON) > 0 ? '+' : '') +
                getModifier(formState.CON)}
            </div>
          </div>
          <div>
            <FormStatNumberInput
              label="INT"
              name="INT"
              formState={formState}
              change={change}
            />{' '}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {(getModifier(formState.INT) > 0 ? '+' : '') +
                getModifier(formState.INT)}
            </div>
          </div>
          <div>
            <FormStatNumberInput
              label="WIS"
              name="WIS"
              formState={formState}
              change={change}
            />{' '}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {(getModifier(formState.WIS) > 0 ? '+' : '') +
                getModifier(formState.WIS)}
            </div>
          </div>
          <div>
            <FormStatNumberInput
              label="CHA"
              name="CHA"
              formState={formState}
              change={change}
            />{' '}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {(getModifier(formState.CHA) > 0 ? '+' : '') +
                getModifier(formState.CHA)}
            </div>
          </div>
        </div>
        <div>
          <FormRte
            label="Notes"
            name="notes"
            formState={formState}
            change={change}
          />
        </div>
      </Root>
      {modal}
    </>
  );
};

export default UnitTemplateForm;
