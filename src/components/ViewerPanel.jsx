import TextViewer from './viewers/TextViewer';
import PdfViewer from './viewers/PdfViewer';
import MarkdownViewer from './viewers/MarkdownViewer';
import JsonViewer from './viewers/JsonViewer';
import DrawioViewer from './DrawioViewer';

/**
 * Panel visor que renderiza el componente apropiado según el tipo de archivo
 */
function ViewerPanel({ file, onUpdateContent, onAddSignature }) {
    const renderViewer = () => {
        switch (file.type) {
            case 'pdf':
                return <PdfViewer file={file} onAddSignature={onAddSignature} />;
            case 'md':
                return <MarkdownViewer file={file} onUpdateContent={onUpdateContent} />;
            case 'json':
                return <JsonViewer file={file} onUpdateContent={onUpdateContent} />;
            case 'drawio':
                return <DrawioViewer xmlContent={file.content} fileName={file.name} />;
            case 'txt':
            default:
                return <TextViewer file={file} onUpdateContent={onUpdateContent} />;
        }
    };

    return (
        <div className="viewer-panel">
            {renderViewer()}
        </div>
    );
}

export default ViewerPanel;
