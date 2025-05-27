import { DropdownButton, Menu } from '@affine/component';
import { BlockCard } from '@affine/component/card/block-card';
import { useI18n } from '@affine/i18n';
import { track } from '@affine/track';
import { EdgelessIcon, ImportIcon, PageIcon } from '@blocksuite/icons/rc';
import type { MouseEvent, PropsWithChildren } from 'react';
import { useCallback, useState } from 'react';

import * as styles from './new-page-button.css';
import { IframeModal } from './iframe-modal'; // Add this import

type NewPageButtonProps = {
  createNewDoc: (e?: MouseEvent) => void;
  createNewPage: (e?: MouseEvent) => void;
  createNewEdgeless: (e?: MouseEvent) => void;
  createNewIframePage?: (iframeUrl: string) => void; // Add this
  importFile?: () => void;
  size?: 'small' | 'default';
};

export const CreateNewPagePopup = ({
  createNewPage,
  createNewEdgeless,
  createNewIframePage, // Add this
  importFile,
}: NewPageButtonProps) => {
  const t = useI18n();
  const [iframeModalOpen, setIframeModalOpen] = useState(false);

  const handleCreateIframePage = (url: string) => {
    createNewIframePage?.(url);
    setIframeModalOpen(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px',
      }}
    >
      <BlockCard
        title={t['com.affine.new.page-mode']()}
        desc={t['com.affine.write_with_a_blank_page']()}
        right={<PageIcon width={20} height={20} />}
        onClick={createNewPage}
        onAuxClick={createNewPage}
        data-testid="new-page-button-in-all-page"
      />
      <BlockCard
        title={t['com.affine.new_edgeless']()}
        desc={t['com.affine.draw_with_a_blank_whiteboard']()}
        right={<EdgelessIcon width={20} height={20} />}
        onClick={createNewEdgeless}
        onAuxClick={createNewEdgeless}
        data-testid="new-edgeless-button-in-all-page"
      />
      <BlockCard
        title="Embed Iframe"
        desc="Embed an external website as a page"
        right={
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect x="3" y="5" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        }
        onClick={() => setIframeModalOpen(true)}
        data-testid="new-iframe-page-button-in-all-page"
      />
      <IframeModal
        open={iframeModalOpen}
        onClose={() => setIframeModalOpen(false)}
        onCreate={handleCreateIframePage}
      />
      {importFile ? (
        <BlockCard
          title={t['com.affine.new_import']()}
          desc={t['com.affine.import_file']()}
          right={<ImportIcon width={20} height={20} />}
          onClick={importFile}
          data-testid="import-button-in-all-page"
        />
      ) : null}
      {/* TODO Import */}
    </div>
  );
};

export const NewPageButton = ({
  createNewDoc,
  createNewPage,
  createNewEdgeless,
  createNewIframePage, // Add this
  importFile,
  size,
  children,
}: PropsWithChildren<NewPageButtonProps>) => {
  const [open, setOpen] = useState(false);

  const handleCreateNewDoc: NewPageButtonProps['createNewDoc'] = useCallback(
    e => {
      createNewDoc(e);
      setOpen(false);
      track.allDocs.header.actions.createDoc();
    },
    [createNewDoc]
  );

  const handleCreateNewPage: NewPageButtonProps['createNewPage'] = useCallback(
    e => {
      createNewPage(e);
      setOpen(false);
      track.allDocs.header.actions.createDoc({ mode: 'page' });
    },
    [createNewPage]
  );

  const handleCreateNewEdgeless: NewPageButtonProps['createNewEdgeless'] =
    useCallback(
      e => {
        createNewEdgeless(e);
        setOpen(false);
        track.allDocs.header.actions.createDoc({
          mode: 'edgeless',
        });
      },
      [createNewEdgeless]
    );

  const handleCreateNewIframePage = useCallback(
    (iframeUrl: string) => {
      createNewIframePage?.(iframeUrl);
      setOpen(false);
      track.allDocs.header.actions.createDoc({ mode: 'iframe' });
    },
    [createNewIframePage]
  );

  const handleImportFile = useCallback(() => {
    importFile?.();
    setOpen(false);
  }, [importFile]);

  return (
    <Menu
      items={
        <CreateNewPagePopup
          createNewDoc={handleCreateNewDoc}
          createNewPage={handleCreateNewPage}
          createNewEdgeless={handleCreateNewEdgeless}
          createNewIframePage={handleCreateNewIframePage}
          importFile={importFile ? handleImportFile : undefined}
        />
      }
      rootOptions={{
        open,
      }}
      contentOptions={{
        className: styles.menuContent,
        align: 'end',
        hideWhenDetached: true,
        onInteractOutside: useCallback(() => {
          setOpen(false);
        }, []),
      }}
    >
      <DropdownButton
        size={size}
        onClick={handleCreateNewDoc}
        onAuxClick={handleCreateNewPage}
        onClickDropDown={useCallback(() => setOpen(open => !open), [])}
        className={styles.button}
      >
        {children}
      </DropdownButton>
    </Menu>
  );
};
