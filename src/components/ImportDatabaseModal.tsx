import { DataContext } from 'App';
import { saveEncounterDatabase } from 'data/storage';
import Button from 'elements/Button';
import { useModal } from 'hooks';
import React from 'react';
import { getColors } from 'style';

const ImportDatabaseModal = () => {
  const [fileName, setFileName] = React.useState('');
  const fileInputRef = React.useRef<any>(null);

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const parsedData = JSON.parse(e.target?.result as string);
            // data.unitTemplates = parsedData
            saveEncounterDatabase(parsedData);
          } catch (e) {
            console.error('Error during import', e);
            alert('Failed to import data');
          }
        };
        reader.readAsText(file);
      }
    },
    onCancel: () => {},
    title: 'Import',
    body: (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            position: 'relative',
          }}
        >
          <input
            style={{
              position: 'absolute',
              left: 0,
              opacity: 0,
              top: 0,
              bottom: 0,
              width: '100%',
              cursor: 'pointer',
            }}
            ref={fileInputRef}
            type="file"
            name="fileData"
            id="fileData"
            onChange={ev => {
              setFileName(ev.target.files?.[0]?.name ?? '');
            }}
          />
          <label
            htmlFor="fileData"
            style={{
              width: '100%',
              color: getColors().TEXT_DEFAULT,
              background: getColors().BACKGROUND,
              border: '2px dotted ' + getColors().TEXT_DESCRIPTION,
              padding: '24px',
              borderRadius: '4px',
            }}
          >
            {fileName
              ? fileName
              : 'Tap to choose a file or click-and-drag one here.'}
          </label>
        </div>
      </div>
    ),
  });

  return (
    <>
      <Button
        color="secondary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Import Database
      </Button>
      {modal}
    </>
  );
};

export default ImportDatabaseModal;
