import { unitTemplateToFormState } from 'data/form';
import {
  EncounterDatabase,
  UnitTemplate,
  getUnitTemplateById,
} from 'data/storage';
import InputLabel from 'elements/InputLabel';
import { useForm, useGlobalAlert } from 'hooks';
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
import { parse } from 'data/parse';
import ImagePortrait from 'elements/ImagePortrait';

const Root = styled.div<Object>(() => {
  return {
    marginRight: '8px',
  };
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
  const showInfo = useGlobalAlert();

  const [unitTemplateToLoad, setUnitTemplateToLoad] =
    useState<UnitTemplate | null>(null);
  const [pasteTemplate, setPasteTemplate] = useState<string>('');

  const { modal: loadExistingModal, setOpen: setLoadExistingModalOpen } =
    useModal({
      title: 'Search Templates',
      onConfirm: () => {
        if (unitTemplateToLoad) {
          reset({
            ...unitTemplateToFormState(unitTemplateToLoad),
            isCustom: true,
            id: randomId(),
          });
        }
        setUnitTemplateToLoad(null);
      },
      onCancel: () => {
        setUnitTemplateToLoad(null);
      },
      body: (
        <div
          style={{
            minHeight: '375px',
          }}
        >
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
                  setUnitTemplateToLoad(template);
                }
              }
            }}
          />
        </div>
      ),
    });

  const { modal: parseModal, setOpen: setParseModalOpen } = useModal({
    title: 'Paste Template',
    onConfirm: () => {
      if (pasteTemplate) {
        try {
          const unitTemplate: any = parse(pasteTemplate);
          reset({
            ...unitTemplateToFormState(unitTemplate),
            id: randomId(),
          });
        } catch (e) {
          console.error('Failed to parse template', e);
          showInfo('Could not parse template.');
        }
      }
      setPasteTemplate('');
    },
    onCancel: () => {
      setPasteTemplate('');
    },
    body: (
      <div
        style={{
          minHeight: '225px',
        }}
      >
        <InputLabel>Paste Template From D&D Beyond Here</InputLabel>
        <textarea
          value={pasteTemplate}
          onChange={ev => {
            setPasteTemplate(ev.target.value);
          }}
          style={{
            marginTop: '4px',
            resize: 'none',
            width: '100%',
            height: '400px',
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
          }}
        >
          <Button
            color="primary"
            onClick={() => {
              setLoadExistingModalOpen(true);
            }}
          >
            Search Templates
          </Button>
          <HSpace />
          <Button
            color="secondary"
            onClick={() => {
              setParseModalOpen(true);
            }}
          >
            Paste Template
          </Button>
        </div>
        <div>
          <ImagePortrait imgUrl={formState.imgUrl} hideThreshold={-1} />
          <br />
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
          <HSpace />
          <FormTextInput
            label="CR"
            name="challenge"
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
            label="Saving Throws"
            name="savingThrows"
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
        <div>
          <FormRte
            label="Notes"
            name="notes"
            formState={formState}
            change={change}
          />
        </div>
      </Root>
      {loadExistingModal}
      {parseModal}
    </>
  );
};

export default UnitTemplateForm;
