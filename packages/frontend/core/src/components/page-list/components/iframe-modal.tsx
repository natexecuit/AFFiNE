import { Modal, RowInput, Button } from '@affine/component';
import { useI18n } from '@affine/i18n';
import { useState } from 'react';

type IframeModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (url: string) => void;
};

export const IframeModal = ({ open, onClose, onCreate }: IframeModalProps) => {
  const t = useI18n();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    try {
      // Basic URL validation
      const parsed = new URL(url);
      if (!/^https?:/.test(parsed.protocol)) {
        setError('URL must start with http:// or https://');
        return;
      }
      setError('');
      onCreate(url);
      setUrl('');
    } catch {
      setError('Please enter a valid URL.');
    }
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <Modal open={open} onOpenChange={handleClose} title={t['Embed Iframe']?.() || 'Embed Iframe'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <RowInput
          value={url}
          onChange={setUrl}
          placeholder={t['Enter website URL']?.() || 'Enter website URL'}
          autoFocus
        />
        {error && (
          <div style={{ color: 'red', fontSize: 12 }}>{error}</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={handleClose} type="default">
            {t['Cancel']?.() || 'Cancel'}
          </Button>
          <Button onClick={handleCreate} type="primary" disabled={!url}>
            {t['Create']?.() || 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
