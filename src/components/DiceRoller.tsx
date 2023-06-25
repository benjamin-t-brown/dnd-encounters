import { roll, rollAsync } from 'data/dice';
import Button from 'elements/Button';
import HSpace from 'elements/HSpace';
import React, { useEffect } from 'react';
import { getColors } from 'style';
import styled from 'styled-components';
import { plusOrMinus } from 'utils';
import EditInputModal from './EditInputModal';
import { useReRender } from 'hooks';

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

  return (
    <span
      style={{
        fontSize: props.minimal ? 'unset' : '20px',
        width: props.minimal
          ? 'unset'
          : window.innerWidth < 500
          ? '100%'
          : '250px',
        height: window.innerWidth < 500 ? 'unset' : '24px',
        textAlign: props.minimal ? 'left' : 'center',
        display: 'inline-block',
      }}
    >
      {props.rolling ? (
        intermediateResult
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
                <EditInputModal
                  label="Bonus"
                  value={String(props.bonus)}
                  onConfirm={value => {
                    if (props.setBonus) {
                      props.setBonus(Number(value));
                    }
                  }}
                  inputType="number"
                  style={{
                    transform: 'translateY(-2px)',
                    color: '#333',
                  }}
                  buttonLabel={
                    plusOrMinus(props.bonus) + ' ' + Math.abs(props.bonus)
                  }
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
              = {props.result + props.bonus}
            </>
          ) : (
            props.result
          )}
        </>
      )}
    </span>
  );
};

const DiceRoller = () => {
  const [bonus, setBonus] = React.useState(0);
  const diceValues = [4, 6, 8, 10, 12, 20, 100];
  const [rollHistory, setRollHistory] = React.useState<
    { result: number; bonus: number; dice: number }[]
  >([]);
  const [rolling, setRolling] = React.useState(false);
  const [sumLastN, setSumLastN] = React.useState(1);
  const render = useReRender();

  const lastRoll = rollHistory[rollHistory.length - 1];

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
        <div>
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
        </div>
      </div>
      <div
        style={{
          margin: '0 16px',
        }}
      >
        <div
          style={{
            margin: '16px',
            background: getColors().BACKGROUND,
            border: '1px solid ' + getColors().TEXT_DESCRIPTION,
            borderRadius: '8px',
            padding: '8px',
          }}
        >
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
      <div
        style={{
          margin: '16px',
          marginTop: window.innerWidth < 500 ? '0px' : '16px',
        }}
      >
        <div>
          <div
            style={{
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            Sum Last {sumLastN} ={' '}
            {rollHistory.slice(-sumLastN).reduce((prev, curr) => {
              return prev + curr.result + curr.bonus;
            }, 0)}
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={sumLastN}
            onChange={ev => {
              setSumLastN(ev.target.valueAsNumber);
            }}
            style={{ width: '100%' }}
          />
        </div>
        <div
          style={{
            background: 'black',
            padding: '4px 8px',
            height: '80px',
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
                  <RollResult
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
      </div>
    </Root>
  );
};

export default DiceRoller;
