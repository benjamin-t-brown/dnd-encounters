import { DataContext } from 'App';
import {
  EncounterTemplateFormState,
  encounterTemplateToFormState,
} from 'data/form';
import {
  EncounterTemplate,
  UnitTemplate,
  getUnitTemplateById,
} from 'data/storage';
import { FormCheckboxInput, FormTextInput } from 'elements/FormInputs';
import Input from 'elements/Input';
import InputLabel from 'elements/InputLabel';
import { useForm } from 'hooks';
import React, { useContext } from 'react';
import { getColors } from 'style';
import styled from 'styled-components';

const Root = styled.div<Object>(() => {
  return {};
});

const UnitsArea = styled.div<Object>(() => {
  return {
    width: 'calc(50% - 12px)',
    height: '400px',
    overflow: 'auto',
    background: getColors().BACKGROUND,
    border: '1px solid ' + getColors().TEXT_DESCRIPTION,
    borderRadius: '4px',
  };
});

const UnitMoveButton = styled.div<{
  side: 'inside-encounter' | 'outside-encounter';
}>(() => {
  return {
    padding: '4px 8px',
    background: getColors().BACKGROUND2,
    border: '1px solid ' + getColors().TEXT_DESCRIPTION,
    borderRadius: '4px',
    margin: '0px 12px',
    cursor: 'pointer',
    userSelect: 'none',
  };
});

const Unit = (props: {
  formState: EncounterTemplateFormState;
  change: (key: keyof EncounterTemplateFormState, value: any) => void;
  unitTemplate: UnitTemplate;
  side: 'inside-encounter' | 'outside-encounter';
  count: number;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid ' + getColors().TEXT_DESCRIPTION,
        boxSizing: 'border-box',
        borderRadius: '4px',
        background:
          props.side === 'outside-encounter'
            ? getColors().BACKGROUND2
            : getColors().BACKGROUND3,
        margin: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {props.side === 'outside-encounter' ? (
            <UnitMoveButton
              side={props.side}
              onClick={() => {
                props.change('units', [
                  ...props.formState.units,
                  props.unitTemplate.id,
                ]);
              }}
            >
              {'+'}
            </UnitMoveButton>
          ) : null}
          <div
            style={{
              width: '64px',
              height: '64px',
              flexGrow: 0,
              flexShrink: 0,
              backgroundColor: 'black',
              backgroundImage: props.unitTemplate.imgUrl
                ? `url(${props.unitTemplate.imgUrl})`
                : 'unset',
              border: '1px solid ' + getColors().TEXT_DEFAULT,
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'local',
              backgroundPosition: 'center',
              backgroundSize: 'auto 100%',
              display: window.innerWidth < 500 ? 'none' : 'block',
            }}
          ></div>
          <div
            style={{
              marginLeft: '16px',
            }}
          >
            <div>{props.unitTemplate.name}</div>
            <div
              style={{
                color: getColors().TEXT_DESCRIPTION,
              }}
            >
              AC: {props.unitTemplate.AC} HP: {props.unitTemplate.hp}
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {props.count > 0 ? <div>{props.count}</div> : null}
          {props.side === 'inside-encounter' ? (
            <div>
              <UnitMoveButton
                side={props.side}
                onClick={() => {
                  props.change('units', [
                    ...props.formState.units,
                    props.unitTemplate.id,
                  ]);
                }}
              >
                {'+'}
              </UnitMoveButton>
              <UnitMoveButton
                side={props.side}
                onClick={() => {
                  const ind = props.formState.units.findIndex(
                    id => id === props.unitTemplate.id
                  );
                  if (ind > -1) {
                    const newUnits = props.formState.units.slice();
                    newUnits.splice(ind, 1);
                    props.change('units', newUnits);
                  }
                }}
              >
                {'-'}
              </UnitMoveButton>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

interface EncounterTemplateFormProps {
  encounterTemplate: EncounterTemplate;
}
const EncounterTemplateForm = (props: EncounterTemplateFormProps) => {
  const { formState, change, reset } = useForm({
    formId: 'EncounterTemplateForm',
    initialValues: encounterTemplateToFormState(props.encounterTemplate),
  });
  const [unitTemplateFilter, setUnitTemplateFilter] = React.useState('');
  const [onlyCustomUnits, setOnlyCustomUnits] = React.useState(false);
  const data = useContext(DataContext);

  const aggUnits = formState.units.reduce(
    (arr, templateId) => {
      const obj = arr.find(t => t.id === templateId);
      if (obj) {
        obj.count++;
        return arr;
      }
      arr.push({
        id: templateId,
        count: 1,
      });
      return arr;
    },
    [] as {
      id: string;
      count: number;
    }[]
  );

  return (
    <>
      <Root>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <FormTextInput
              label="Name"
              name="name"
              formState={formState}
              change={change}
            />
            <div
              style={{
                marginTop: '8px',
              }}
            >
              Units in Encounter
            </div>
          </div>
          <div
            style={{
              padding: '8px',
              paddingRight: '0px',
            }}
          >
            <InputLabel>Filter by Name</InputLabel>
            <Input
              aria-label="Filter"
              name="filter"
              value={unitTemplateFilter}
              type="text"
              onChange={ev => {
                setUnitTemplateFilter(ev.target.value);
              }}
              style={{
                width: '100%',
                marginRight: '2px',
              }}
            />
            <div
              style={{
                marginTop: '8px',
              }}
            >
              <FormCheckboxInput
                label="Only Custom Units"
                name="selected"
                formState={{
                  selected: onlyCustomUnits,
                }}
                change={(_, value) => {
                  setOnlyCustomUnits(value);
                }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <UnitsArea id="inside-encounter">
            {aggUnits.map(({ id, count }) => {
              const unitTemplate = getUnitTemplateById(id, data);
              if (!unitTemplate) {
                throw new Error('Unit template not found: ' + id);
              }
              return (
                <Unit
                  key={id}
                  change={change}
                  formState={formState}
                  unitTemplate={unitTemplate}
                  side="inside-encounter"
                  count={count}
                />
              );
            })}
          </UnitsArea>
          <UnitsArea id="outside-encounter">
            {data.unitTemplates
              .filter(unitTemplate => {
                if (unitTemplateFilter) {
                  return unitTemplate.name
                    .toLowerCase()
                    .includes(unitTemplateFilter.toLowerCase());
                } else {
                  return true;
                }
              })
              .filter(unitTemplate => {
                return (
                  !unitTemplate.isPlayer &&
                  (onlyCustomUnits ? unitTemplate.isCustom : true)
                );
              })
              .sort((a, b) => {
                return a.name.localeCompare(b.name);
              })
              .map(unitTemplate => {
                return (
                  <Unit
                    key={unitTemplate.id}
                    change={change}
                    formState={formState}
                    unitTemplate={unitTemplate}
                    side="outside-encounter"
                    count={0}
                  />
                );
              })}
          </UnitsArea>
        </div>
      </Root>
    </>
  );
};

export default EncounterTemplateForm;
