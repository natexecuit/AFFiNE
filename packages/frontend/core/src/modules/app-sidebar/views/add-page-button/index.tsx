import { Button, IconButton, Menu, MenuItem, MenuSub } from '@affine/component';
import { usePageHelper } from '@affine/core/blocksuite/block-suite-page-list/utils';
import { useAsyncCallback } from '@affine/core/components/hooks/affine-async-hooks';
import { DocsService } from '@affine/core/modules/doc';
import { EditorSettingService } from '@affine/core/modules/editor-setting';
import { TemplateDocService } from '@affine/core/modules/template-doc';
import { TemplateListMenuContentScrollable } from '@affine/core/modules/template-doc/view/template-list-menu';
import { WorkbenchService } from '@affine/core/modules/workbench';
import { WorkspaceService } from '@affine/core/modules/workspace';
import { inferOpenMode } from '@affine/core/utils';
import { useI18n } from '@affine/i18n';
import track from '@affine/track';
import type { DocMode } from '@blocksuite/affine/model';
import {
  ArrowDownSmallIcon,
  EdgelessIcon,
  PageIcon,
  PlusIcon,
  TemplateIcon,
} from '@blocksuite/icons/rc';
import { useLiveData, useService } from '@toeverything/infra';
import clsx from 'clsx';
import type React from 'react';
import { type MouseEvent, useCallback, useState } from 'react';

import * as styles from './index.css';
import { IframeModal } from './iframe-modal'; // <-- Add this import

// ... (rest of your code unchanged) ...

function AddPageWithAsk({ className, style }: AddPageButtonProps) {
  const t = useI18n();
  const createDoc = useNewDoc();
  const workbench = useService(WorkbenchService).workbench;
  const docsService = useService(DocsService);
  const workspaceService = useService(WorkspaceService);
  const pageHelper = usePageHelper(workspaceService.workspace.docCollection);

  const [iframeModalOpen, setIframeModalOpen] = useState(false);

  const createPage = useCallback(
    (e?: MouseEvent) => {
      createDoc(e, 'page');
      track.$.navigationPanel.$.createDoc();
      track.$.sidebar.newDoc.quickStart({ with: 'page' });
    },
    [createDoc]
  );
  const createEdgeless = useCallback(
    (e?: MouseEvent) => {
      createDoc(e, 'edgeless');
      track.$.navigationPanel.$.createDoc();
      track.$.sidebar.newDoc.quickStart({ with: 'edgeless' });
    },
    [createDoc]
  );

  const createDocFromTemplate = useAsyncCallback(
    async (templateId: string) => {
      const docId = await docsService.duplicateFromTemplate(templateId);
      workbench.openDoc(docId);
      track.$.sidebar.newDoc.quickStart({ with: 'template' });
    },
    [docsService, workbench]
  );

  // Add this handler for iframe page
  const handleCreateIframePage = useCallback(
    (url: string) => {
      pageHelper.createPage('iframe', { iframeUrl: url, at: 'active', show: true });
      setIframeModalOpen(false);
      track.$.sidebar.newDoc.quickStart({ with: 'iframe' });
    },
    [pageHelper]
  );

  return (
    <>
      <Menu
        items={
          <>
            <MenuItem
              prefixIcon={<PageIcon />}
              onClick={createPage}
              onAuxClick={createPage}
            >
              {t['Page']()}
            </MenuItem>
            <MenuItem
              prefixIcon={<EdgelessIcon />}
              onClick={createEdgeless}
              onAuxClick={createEdgeless}
            >
              {t['Edgeless']()}
            </MenuItem>
            <MenuItem
              prefixIcon={
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <rect x="3" y="5" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
              onClick={() => setIframeModalOpen(true)}
              data-testid="sidebar-new-iframe-page-button"
            >
              Embed Iframe
            </MenuItem>
            <MenuSub
              triggerOptions={{
                prefixIcon: <TemplateIcon />,
              }}
              subContentOptions={{
                sideOffset: 16,
                className: styles.templateMenu,
              }}
              items={
                <TemplateListMenuContentScrollable
                  onSelect={createDocFromTemplate}
                />
              }
            >
              {t['Template']()}
            </MenuSub>
          </>
        }
      >
        <Button
          tooltip={t['New Page']()}
          tooltipOptions={sideBottom}
          data-testid="sidebar-new-page-with-ask-button"
          className={clsx([styles.withAskRoot, className])}
          style={style}
        >
          <div className={styles.withAskContent}>
            <PlusIcon />
            <ArrowDownSmallIcon />
          </div>
        </Button>
      </Menu>
      <IframeModal
        open={iframeModalOpen}
        onClose={() => setIframeModalOpen(false)}
        onCreate={handleCreateIframePage}
      />
    </>
  );
}
