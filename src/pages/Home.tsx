import { useEffect } from 'react';
import { FileQuestion, BookOpen } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { BankCard } from '../components/Bank/BankCard';
import { FileUploader } from '../components/Import/FileUploader';
import { useBankStore } from '../stores/bankStore';

export const Home = () => {
  const { banks, loadBanks, deleteBank, importFile } = useBankStore();

  useEffect(() => {
    loadBanks();
  }, [loadBanks]);

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个题库吗？删除后无法恢复。')) {
      deleteBank(id);
    }
  };

  const handleImport = async (file: File) => {
    const result = await importFile(file);
    return result;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="题库刷题" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <FileUploader onImport={handleImport} />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-800">我的题库</h2>
            </div>
            <span className="text-gray-500 text-sm">{banks.length} 个题库</span>
          </div>

          {banks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <FileQuestion className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无题库</h3>
              <p className="text-gray-500">点击上方区域上传文件创建你的第一个题库</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {banks.map(bank => (
                <BankCard key={bank.id} bank={bank} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};