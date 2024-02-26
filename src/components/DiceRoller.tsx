import { roll, rollAsync } from 'data/dice';
import Button from 'elements/Button';
import HSpace from 'elements/HSpace';
import React, { useEffect } from 'react';
import { getColors } from 'style';
import styled from 'styled-components';
import { plusOrMinus } from 'utils';
import { useReRender } from 'hooks';
import RangeButtonInput from 'elements/RangeButtonInput';
import InputLabel from 'elements/InputLabel';

const Root = styled.div<Object>(() => {
  return {
    background: getColors().BACKGROUND2,
    padding: '0 8px',
    border: '1px solid ' + getColors().TEXT_DESCRIPTION,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: window.innerWidth < 600 ? 'column' : 'row',
  };
});

const LogRollResult = (props: {
  rolling: boolean;
  result: number;
  bonus: number;
  showBonus: boolean;
  dice: number;
  minimal?: boolean;
}) => {
  return (
    <span
      style={{
        fontSize: props.minimal ? 'unset' : '20px',
        width: props.minimal
          ? 'unset'
          : window.innerWidth < 500
          ? '100%'
          : '280px',
        // height: window.innerWidth < 500 ? 'unset' : '24px',
        textAlign: props.minimal ? 'left' : 'center',
        display: 'inline-block',
        alignItems: 'center',
      }}
    >
      <>
        <span
          style={{
            color: getColors().SUCCESS_TEXT,
            width: '45px',
            display: 'inline-block',
          }}
        >
          D{props.dice}
        </span>{' '}
        <>
          <span
            style={{
              color:
                props.dice === 20 && (props.result === 20 || props.result === 1)
                  ? getColors().ERROR_TEXT
                  : getColors().TEXT_DESCRIPTION,
            }}
          >
            {props.result}
          </span>{' '}
          <span
            style={{
              color: getColors().TEXT_DESCRIPTION,
            }}
          >
            {plusOrMinus(props.bonus)} {Math.abs(props.bonus)}
          </span>
          <span style={{}}> = {props.result + props.bonus}</span>
        </>
      </>
    </span>
  );
};

const RollResult = (props: {
  rolling: boolean;
  result: number;
  bonus: number;
  showBonus: boolean;
  dice: number;
  minimal?: boolean;
  editBonus?: boolean;
  setBonus?: (v: number) => void;
}) => {
  const [intermediateResult, setIntermediateResult] = React.useState(0);

  useEffect(() => {
    if (props.rolling) {
      const interval = setInterval(() => {
        setIntermediateResult(roll(20));
      }, 33);
      return () => {
        clearInterval(interval);
      };
    }
  }, [props.rolling]);
  const total = props.result + props.bonus;
  const nbsp = total > 9 ? '' : '\u00A0';
  return (
    <div
      style={{
        fontSize: props.minimal ? 'unset' : '20px',
        width: props.minimal
          ? 'unset'
          : window.innerWidth < 500
          ? '100%'
          : '280px',
        // height: window.innerWidth < 500 ? 'unset' : '24px',
        textAlign: props.minimal ? 'left' : 'center',
        display: 'inline-flex',
        justifyContent: props.rolling ? 'center' : 'space-between',
        alignItems: 'center',
        flexGrow: '0',
        minHeight: '48px',
      }}
    >
      {props.rolling ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '48px',
          }}
        >
          {intermediateResult}
        </div>
      ) : (
        <>
          <span
            style={{
              color: getColors().SUCCESS_TEXT,
              width: '45px',
              display: 'inline-block',
            }}
          >
            D{props.dice}
          </span>{' '}
          {props.showBonus ? (
            <>
              <span
                style={{
                  color:
                    props.dice === 20 &&
                    (props.result === 20 || props.result === 1)
                      ? getColors().ERROR_TEXT
                      : getColors().TEXT_DESCRIPTION,
                }}
              >
                {props.result}
              </span>{' '}
              {props.editBonus ? (
                <RangeButtonInput
                  value={props.bonus}
                  onChange={v => {
                    if (props.setBonus) {
                      props.setBonus(v);
                    }
                  }}
                  min={-10}
                  max={10}
                  step={1}
                  style={{
                    display: 'inline-flex',
                    // width: '64px',
                  }}
                />
              ) : (
                <span
                  style={{
                    color: getColors().TEXT_DESCRIPTION,
                  }}
                >
                  {plusOrMinus(props.bonus)} {Math.abs(props.bonus)}
                </span>
              )}{' '}
              <div
                style={{
                  width: '44px',
                  whiteSpace: 'pre',
                  display: 'inline-block',
                  flexShrink: 0,
                  flexGrow: 0,
                }}
              >
                = {nbsp + total}
              </div>
            </>
          ) : (
            plusOrMinus(props.result) + props.result
          )}
        </>
      )}
    </div>
  );
};

const getStoredRollHistory = () => {
  const stored = localStorage.getItem('rollHistory');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse roll history', e, stored);
    }
  }
  return [];
};

const DiceRoller = () => {
  const [bonus, setBonus] = React.useState(0);
  const diceValues = [4, 6, 8, 10, 12, 20, 100];
  const [rollHistory, setRollHistory] = React.useState<
    { result: number; bonus: number; dice: number }[]
  >(getStoredRollHistory());
  const [rolling, setRolling] = React.useState(false);
  const [sumLastN, setSumLastN] = React.useState(1);
  const [sumIncludeBonus, setSumIncludeBonus] = React.useState(false);
  const render = useReRender();

  const lastRoll = rollHistory[rollHistory.length - 1];

  useEffect(() => {
    localStorage.setItem('rollHistory', JSON.stringify(rollHistory));
  }, [rollHistory]);

  const handleDiceClick = (dice: number) => {
    if (rolling) {
      return false;
    }

    setRolling(true);
    rollAsync(dice).then(result => {
      setRollHistory([
        ...rollHistory,
        {
          result,
          bonus,
          dice,
        },
      ]);
      setRolling(false);
    });
  };

  return (
    <Root id="dice-roller">
      <div
        style={
          {
            // width: '40%',
          }
        }
      >
        <div
          style={{
            minWidth: '168px',
          }}
        >
          {diceValues.map(diceValue => {
            return (
              <React.Fragment key={diceValue}>
                <Button
                  color={diceValue === 20 ? 'secondary' : 'primary'}
                  key={diceValue}
                  style={{
                    fontSize: window.innerWidth < 500 ? '13px' : '18px',
                  }}
                  onClick={() => {
                    handleDiceClick(diceValue);
                  }}
                >
                  D{diceValue}
                </Button>
                <HSpace />
              </React.Fragment>
            );
          })}
        </div>
        {/* <div>
          <div
            style={{
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            Bonus {bonus >= 0 ? '+' : ''}
            {bonus}
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            value={bonus}
            onChange={ev => {
              setBonus(ev.target.valueAsNumber);
            }}
            style={{ width: '100%' }}
          />
        </div> */}
        <div
          style={{
            margin: '16px',
            background: getColors().BACKGROUND,
            border: '1px solid ' + getColors().TEXT_DESCRIPTION,
            borderRadius: '8px',
            padding: '8px',
          }}
        >
          <h3
            style={{
              margin: '0',
            }}
          >
            Bonus
          </h3>
          {lastRoll ? (
            <RollResult
              rolling={rolling}
              result={lastRoll.result}
              bonus={lastRoll.bonus}
              dice={lastRoll.dice}
              showBonus={true}
              editBonus={true}
              setBonus={v => {
                lastRoll.bonus = v;
                setBonus(v);
                render();
              }}
            />
          ) : (
            <RollResult
              rolling={rolling}
              result={0}
              bonus={bonus}
              dice={0}
              showBonus={true}
              editBonus={true}
              setBonus={v => {
                setBonus(v);
                render();
              }}
            />
          )}
        </div>
      </div>
      {/* <div
        style={{
          margin: '0 16px',
        }}
      >
        
      </div> */}
      <div
        style={{
          margin: '4px',
          marginTop: window.innerWidth < 500 ? '0px' : '16px',
        }}
      >
        <div>
          <div
            style={{
              textAlign: 'center',
              marginTop: '4px',
            }}
          >
            Sum Last {sumLastN} ={' '}
            {rollHistory.slice(-sumLastN).reduce((prev, curr) => {
              return prev + curr.result + (sumIncludeBonus ? curr.bonus : 0);
            }, 0)}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '4px',
            }}
          >
            <input
              type="checkbox"
              name="includeBonus"
              id="includeBonus"
              checked={sumIncludeBonus}
              onChange={ev => {
                setSumIncludeBonus(ev.target.checked);
              }}
            />
            <InputLabel htmlFor="includeBonus">Include Bonus</InputLabel>
          </div>
          <RangeButtonInput
            value={sumLastN}
            onChange={v => {
              setSumLastN(v);
            }}
            disablePlus={true}
            min={1}
            max={12}
            step={1}
            style={{ width: '100%' }}
          />
        </div>
        <div
          style={{
            background: 'black',
            padding: '4px 8px',
            height: '180px',
            width: '195px',
            overflow: 'auto',
            fontSize: '14px',
            border: '1px solid ' + getColors().TEXT_DESCRIPTION,
          }}
        >
          {rollHistory
            .slice()
            .reverse()
            .map((roll, index) => {
              return (
                <div key={index}>
                  {rollHistory.length - index}.{' '}
                  <LogRollResult
                    dice={roll.dice}
                    result={roll.result}
                    rolling={false}
                    bonus={roll.bonus}
                    showBonus={true}
                    minimal={true}
                  />
                </div>
              );
            })}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            color="secondary"
            onClick={() => {
              setRollHistory([]);
            }}
          >
            Clear History
          </Button>
        </div>
      </div>
    </Root>
  );
};

export default DiceRoller;
