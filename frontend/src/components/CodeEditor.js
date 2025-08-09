import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Save, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const CodeEditor = ({ 
  language = 'javascript', 
  initialCode = '', 
  onCodeChange, 
  onSubmit, 
  isSubmitting = false,
  readOnly = false,
  height = '400px',
  theme = 'vs-dark',
  disableCopyPaste = false,
  hideToolbar = false
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (value) => {
    setCode(value || '');
    if (onCodeChange) {
      onCodeChange(value || '');
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(code);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    if (onCodeChange) {
      onCodeChange(initialCode);
    }
    toast.success('Code reset to initial state');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const getLanguageForMonaco = () => {
    const languageMap = {
      'javascript': 'javascript',
      'python': 'python',
      'sql': 'sql',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'csharp': 'csharp',
      'typescript': 'typescript',
      'html': 'html',
      'css': 'css'
    };
    return languageMap[language.toLowerCase()] || 'plaintext';
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: readOnly,
    automaticLayout: true,
    wordWrap: 'on',
    formatOnPaste: !disableCopyPaste,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    tabSize: 2,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all',
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto'
    },
    // Disable context menu if copy/paste is disabled
    contextmenu: !disableCopyPaste
  };

  // Handle anti-cheat: disable copy/paste
  const handleEditorDidMount = (editor, monaco) => {
    if (disableCopyPaste) {
      // Disable copy
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
        toast.warning('Copy is disabled during the assessment');
      });
      
      // Disable paste
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
        toast.warning('Paste is disabled during the assessment');
      });
      
      // Disable cut
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {
        toast.warning('Cut is disabled during the assessment');
      });
      
      // Disable right-click context menu
      editor.onContextMenu((e) => {
        e.event.preventDefault();
        e.event.stopPropagation();
      });
    }
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
      {/* Editor Header */}
      <div className="bg-gray-50 border-b px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Language: {language.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">
            {code.split('\n').length} lines
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!disableCopyPaste && !hideToolbar && (
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
          
          {!readOnly && !hideToolbar && (
            <>
              <button
                onClick={handleReset}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Reset code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              {onSubmit && (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !code.trim()}
                  className={`
                    flex items-center space-x-1 px-3 py-1.5 rounded text-sm font-medium
                    ${isSubmitting || !code.trim()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    } transition-colors
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Run Code</span>
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={height}
        language={getLanguageForMonaco()}
        value={code}
        theme={theme}
        onChange={handleCodeChange}
        options={editorOptions}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      />

      {/* Editor Footer */}
      <div className="bg-gray-50 border-t px-4 py-2 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>
            {readOnly ? 'Read-only mode' : disableCopyPaste ? 'Copy/Paste disabled' : 'Press Ctrl+S to save'}
          </span>
          <span>
            Characters: {code.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
