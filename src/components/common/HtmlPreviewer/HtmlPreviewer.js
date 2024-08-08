// src/components/common/HtmlPreviewer/HtmlPreviewer.js
import React, { useState, useEffect } from 'react';
import { Sandpack, SandpackThemeProvider } from '@codesandbox/sandpack-react';
import { atomDark } from '@codesandbox/sandpack-themes';
import { X, ExternalLink, Maximize, Minimize } from 'lucide-react';

const HtmlPreviewer = ({ content, language, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState('horizontal');
  const [editorHeight, setEditorHeight] = useState('50vh');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOrientation('vertical');
        setEditorHeight('40vh');
      } else {
        setOrientation('horizontal');
        setEditorHeight('80vh');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(content);
      newWindow.document.close();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderHtmlContent = () => (
    <iframe
      srcDoc={content}
      title="HTML Preview"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );

  const renderJsxContent = () => {
    const files = {
      "App.tsx": content,
      "/public/index.html": `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>`,
    };

    const template = "react-ts";

    return (
      <SandpackThemeProvider theme={atomDark}>
        <div className={`flex-grow overflow-hidden flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}`}>
          <div className="isolate w-full h-full">
            <Sandpack
              theme={atomDark}
              options={{
                showNavigator: window.innerWidth >= 768, 
                externalResources: [
                  "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
                ],
                editorHeight: editorHeight, 
                showTabs: window.innerWidth >= 768,
                showLineNumbers: true,
                wrapContent: true, 
              }}
              files={files}
              template={template}
              customSetup={{
                dependencies: {
                  "lucide-react": "latest",
                  recharts: "2.9.0",
                },
              }}
            />
            {window.innerWidth < 768 && (
              <div className="p-2">
                <label htmlFor="editorHeight" className="block text-sm font-medium text-gray-700">Adjust Editor Height</label>
                <input
                  type="range"
                  id="editorHeight"
                  name="editorHeight"
                  min="20"
                  max="80"
                  value={parseInt(editorHeight, 10)}
                  onChange={(e) => setEditorHeight(`${e.target.value}vh`)}
                  className="w-full mt-1"
                />
              </div>
            )}
          </div>
        </div>
      </SandpackThemeProvider>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4">
      <div className={`bg-white rounded-lg overflow-hidden flex flex-col ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl h-[90vh]'}`}>
        <div className="bg-gray-100 p-2 sm:p-3 flex justify-between items-center border-b">
          <h2 className="text-base sm:text-lg font-semibold">Live Preview</h2>
          <div className="flex space-x-1 sm:space-x-2">
            <button onClick={openInNewTab} className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" title="Open in new tab">
              <ExternalLink size={16} />
            </button>
            <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" title="Close preview">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-hidden flex">
          {language === 'html' ? renderHtmlContent() : renderJsxContent()}
        </div>
      </div>
    </div>
  );
};

export default HtmlPreviewer;
