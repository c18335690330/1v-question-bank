import { useState, useRef } from 'react';
import { Upload, FileText, FileJson, FileCode, FileText as FilePdf, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  onImport: (file: File) => Promise<{ success: boolean; count?: number }>;
}

export const FileUploader = ({ onImport }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'json', 'md', 'markdown', 'pdf'].includes(ext || '')) {
      setStatus('error');
      setMessage('不支持的文件格式，请上传 txt、json、md 或 pdf 文件');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
      return;
    }

    setStatus('uploading');
    setMessage('正在解析文件...');

    const result = await onImport(file);

    if (result.success && result.count) {
      setStatus('success');
      setMessage(`成功导入 ${result.count} 道题目！`);
    } else {
      setStatus('error');
      setMessage('解析失败，请检查文件格式是否正确');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Upload className="w-8 h-8 text-primary-500" />;
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'uploading':
        return 'bg-primary-50 border-primary-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return isDragging ? 'bg-primary-50 border-primary-400' : 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">导入题库</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${getStatusBg()}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.json,.md,.markdown,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          {getStatusIcon()}
          
          {status === 'idle' ? (
            <>
              <p className="text-gray-600 font-medium">点击或拖拽文件到此处</p>
              <p className="text-gray-400 text-sm">支持 txt、json、md、pdf 格式</p>
            </>
          ) : (
            <p className={status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-primary-600'}>
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="w-4 h-4 text-blue-500" />
          <span>TXT：每行一题格式</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileJson className="w-4 h-4 text-yellow-500" />
          <span>JSON：结构化数据</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileCode className="w-4 h-4 text-green-500" />
          <span>MD：Markdown格式</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FilePdf className="w-4 h-4 text-red-500" />
          <span>PDF：文档格式</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
        <p className="font-medium mb-2">格式示例：</p>
        <pre className="text-xs whitespace-pre-wrap bg-white p-3 rounded">
1. 题目内容？
A. 选项一
B. 选项二
答案：A
解析：这是解析内容
        </pre>
      </div>
    </div>
  );
};