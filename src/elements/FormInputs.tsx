import React from 'react';
import InputLabel from './InputLabel';
import Input from './Input';

export const FormTextInput = (props: {
  label: string;
  name: string;
  formState: Record<string, any>;
  change: (key: string, value: string) => void;
}) => {
  return (
    <div
      style={{
        display: 'inline-block',
      }}
    >
      <InputLabel>{props.label}</InputLabel>
      <Input
        aria-label={props.name}
        name={props.name}
        type="text"
        value={props.formState[props.name]}
        placeholder={props.label}
        onChange={ev => {
          props.change(props.name, ev.target.value);
        }}
        style={{
          width: '200px',
        }}
      />
    </div>
  );
};

export const FormTextInputFullWidth = (props: {
  label: string;
  name: string;
  formState: Record<string, any>;
  change: (key: string, value: string) => void;
}) => {
  return (
    <div>
      <InputLabel>{props.label}</InputLabel>
      <Input
        aria-label={props.name}
        name={props.name}
        type="text"
        value={props.formState[props.name]}
        onChange={ev => {
          props.change(props.name, ev.target.value);
        }}
        style={{
          width: '100%',
        }}
      />
    </div>
  );
};

export const FormStatNumberInput = (props: {
  label: string;
  name: string;
  formState: Record<string, any>;
  change: (key: string, value: number) => void;
}) => {
  return (
    <div
      style={{
        display: 'inline-block',
      }}
    >
      <InputLabel>{props.label}</InputLabel>
      <Input
        aria-label={props.name}
        name={props.name}
        value={props.formState[props.name]}
        type="number"
        onChange={ev => {
          props.change(props.name, Number(ev.target.value));
        }}
        style={{
          width: '75px',
          marginRight: '2px',
        }}
      />
    </div>
  );
};

export const FormOptionsInput = (props: {
  label: string;
  name: string;
  options: { label: string; value: string | number }[];
  formState: Record<string, any>;
  change: (key: string, value: string | number) => void;
}) => {
  return (
    <div
      style={{
        display: 'inline-block',
      }}
    >
      <InputLabel>{props.label}</InputLabel>
      <select
        name={props.name}
        value={props.formState[props.name]}
        onChange={ev => {
          let v: any = Number(ev.target.value);
          if (isNaN(v)) {
            v = ev.target.value;
          }
          props.change(props.name, v);
        }}
        style={{
          width: '200px',
          padding: '8px',
          marginTop: '4px',
        }}
      >
        {props.options.map(({ label, value }) => {
          return (
            <option key={label} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export const FormTextAreaInput = (props: {
  label: string;
  name: string;
  formState: Record<string, any>;
  change: (key: string, value: string) => void;
}) => {
  return (
    <div>
      <InputLabel>{props.label}</InputLabel>
      <textarea
        name={props.name}
        value={props.formState[props.name]}
        onChange={ev => {
          props.change(props.name, ev.target.value);
        }}
        style={{
          // width: '400px',
          width: '100%',
          height: '200px',
          marginTop: '4px',
          resize: 'none',
        }}
      />
    </div>
  );
};

export const FormCheckboxInput = (props: {
  label: string;
  name: string;
  formState: Record<string, any>;
  change: (key: string, value: boolean) => void;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
      }}
    >
      <input
        name={props.name}
        id={props.name}
        type="checkbox"
        checked={props.formState[props.name]}
        onChange={ev => {
          props.change(props.name, ev.target.checked);
        }}
        style={{
          marginRight: '8px',
          transform: 'scale(1.5)',
          marginLeft: '-2px',
        }}
      />
      <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
    </div>
  );
};
