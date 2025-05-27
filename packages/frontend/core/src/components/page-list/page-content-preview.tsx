import { DocsSearchService } from '@affine/core/modules/docs-search';
import { WorkspaceService } from '@affine/core/modules/workspace';
import { LiveData, useLiveData, useService } from '@toeverything/infra';
import { type ReactNode, useEffect, useMemo } from 'react';
// Import the iframe container style (create this file next)
import { iframeContainer } from './iframe-page.css';

interface PagePreviewProps {
  pageId: string;
  emptyFallback?: ReactNode;
  fallback?: ReactNode;
}

const PagePreviewInner = ({
  pageId,
  emptyFallback,
  fallback,
}: PagePreviewProps) => {
  const docSummary = useService(DocsSearchService);
  const workspaceService = useService(WorkspaceService);

  // Use workspace to get doc metadata (including mode & iframeUrl)
  const doc = useLiveData(
    useMemo(
      () => LiveData.from(workspaceService.workspace.engine.doc.watch$(pageId), null),
      [workspaceService, pageId]
    )
  );

  // For summaries (original logic)
  const summary = useLiveData(
    useMemo(
      () => LiveData.from(docSummary.watchDocSummary(pageId), null),
      [docSummary, pageId]
    )
  );

  useEffect(() => {
    const undo = docSummary.indexer.addPriority(pageId, 100);
    return undo;
  }, [docSummary, pageId]);

  useEffect(() => {
    const undo = workspaceService.workspace.engine.doc.addPriority(pageId, 10);
    return undo;
  }, [workspaceService, pageId]);

  // --- Render iframe if this is an iframe page ---
  if (doc && doc.mode === 'iframe' && doc.iframeUrl) {
    return (
      <div className={iframeContainer}>
        <iframe
          src={doc.iframeUrl}
          title="Embedded Iframe"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    );
  }

  // --- Otherwise, render summary preview as before ---
  const res =
    summary === null ? fallback : summary === '' ? emptyFallback : summary;
  return res;
};

export const PagePreview = (props: PagePreviewProps) => {
  return <PagePreviewInner {...props} />;
};
