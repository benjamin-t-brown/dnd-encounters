import MDEditor from '@uiw/react-md-editor';
import { getModifier } from 'data/dice';
import { UnitInEncounter } from 'data/storage';
import Button from 'elements/Button';
import {
  FormStatNumberInput,
  FormTextInput,
  FormTextInputFullWidth,
} from 'elements/FormInputs';
import HSpace from 'elements/HSpace';
import ImagePortrait from 'elements/ImagePortrait';
import { usePageReRender } from 'hooks';
import React, { useState } from 'react';
import { getColors } from 'style';
import UnitInfoModal from './UnitInfoModal';

const EncounterUnitInfo = (props: { unit: UnitInEncounter }) => {
  const change = () => void 0;
  const formState = props.unit.stats;
  const render = usePageReRender();
  const [notesFirst, setNotesFirst] = useState(false);

  const StatsInfo = (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ImagePortrait imgUrl={props.unit.imgUrl} hideThreshold={-1} large />
        </div>
        <HSpace />
        <h2
          style={{
            margin: '10px',
          }}
        >
          {props.unit.name}
        </h2>
        <div
          style={{
            marginTop: '8px',
            width: '100%',
            // display: props.unit.isPlayer ? 'none' : 'block',
          }}
        >
          <FormTextInputFullWidth
            label="Status"
            name="status"
            formState={{
              status: props.unit.current.status ?? '',
            }}
            change={(key, value) => {
              props.unit.current[key] = value;
              render();
            }}
          />
        </div>
        {props.unit.isPlayer ? null : (
          <div
            style={
              {
                // marginTop: '8px',
              }
            }
          >
            {props.unit.type ? (
              <FormTextInput
                label="Type"
                name="type"
                formState={props.unit}
                change={change}
                width={'100px'}
                disabled
              />
            ) : null}
            <HSpace />
            <FormTextInput
              label="Size"
              name="size"
              formState={props.unit}
              change={change}
              width={'100px'}
              disabled
            />
            <HSpace />
            <FormTextInput
              label="Alignment"
              name="alignment"
              formState={props.unit}
              change={change}
              width={'100px'}
              disabled
            />
          </div>
        )}
      </div>
      <div
        style={{
          margin: '12px 0',
          padding: '12px',
          border: '1px solid ' + getColors().TEXT_DESCRIPTION,
          display: props.unit.isPlayer ? 'none' : 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <FormStatNumberInput
          label="Max HP"
          name="hp"
          formState={props.unit}
          change={change}
          disabled
        />
        <FormStatNumberInput
          label="Armor Class"
          name="AC"
          formState={props.unit}
          change={change}
          disabled
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
            disabled
          />
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
            disabled
          />
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
            disabled
          />
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
            disabled
          />
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
            disabled
          />
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
            disabled
          />
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
          display: props.unit.isPlayer ? 'none' : 'block',
        }}
      >
        <FormStatNumberInput
          label="Speed"
          name="speed"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormStatNumberInput
          label="Speed Water"
          name="speedSwim"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormStatNumberInput
          label="Speed Fly"
          name="speedFly"
          formState={props.unit}
          change={change}
          disabled
        />
      </div>
      <div
        style={{
          display: props.unit.isPlayer ? 'none' : 'block',
        }}
      >
        <FormTextInputFullWidth
          label="Saving Throws"
          name="savingThrows"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormTextInputFullWidth
          label="Immunities"
          name="immunities"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormTextInputFullWidth
          label="Resistances"
          name="resistances"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormTextInputFullWidth
          label="Vulnerabilities"
          name="vulnerabilities"
          formState={props.unit}
          change={change}
          disabled
        />
      </div>
    </>
  );

  const StatsNotes = (
    <div
      style={{
        margin: '16px 0px',
        display: props.unit.isPlayer ? 'none' : 'block',
      }}
    >
      <MDEditor.Markdown
        source={props.unit.notes ?? ''}
        style={{ whiteSpace: 'pre-wrap', padding: '8px' }}
        // wrapperElement={{
        //   'data-color-mode': 'light',
        // }}
      />
    </div>
  );

  return (
    <>
      <div>
        <Button
          color="secondary"
          onClick={() => {
            setNotesFirst(!notesFirst);
          }}
          style={{
            marginLeft: '8px',
          }}
        >
          View {notesFirst ? 'Stats' : 'Notes'}
        </Button>
        <div
          style={{
            padding: '4px 8px',
          }}
        >
          {notesFirst ? StatsNotes : null}
          {StatsInfo}
          {!notesFirst ? StatsNotes : null}
        </div>
      </div>
    </>
  );
};

export default EncounterUnitInfo;
