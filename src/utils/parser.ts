import type { Question, QuestionType } from './types';
import { generateId } from './storage';
import * as pdf from 'pdf-parse';

export const parseTxtFile = (content: string, bankId: string): Question[] => {
  const questions: Question[] = [];
  const blocks = content.split(/\n\n+/).filter(b => b.trim());
  
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 2) continue;
    
    let currentLine = 0;
    let questionContent = '';
    const options: string[] = [];
    let answer: string[] = [];
    let explanation = '';
    
    while (currentLine < lines.length) {
      const line = lines[currentLine].trim();
      
      if (line.match(/^\d+\./)) {
        questionContent = line.replace(/^\d+\.\s*/, '');
      } else if (line.match(/^[A-Da-d]\./)) {
        options.push(line);
      } else if (line.startsWith('答案') || line.startsWith('参考答案')) {
        const answerMatch = line.match(/[A-Da-d,，、]+/);
        if (answerMatch) {
          answer = answerMatch[0].split(/[,，、]/).map(a => a.trim().toUpperCase()).filter(Boolean);
        }
      } else if (line.startsWith('解析') || line.startsWith('说明')) {
        explanation = line.replace(/^(解析|说明)[:：]\s*/, '');
      } else if (questionContent && !line.startsWith('答案') && !line.startsWith('解析')) {
        questionContent += ' ' + line;
      }
      
      currentLine++;
    }
    
    if (questionContent && options.length > 0 && answer.length > 0) {
      const type: QuestionType = answer.length > 1 ? 'multiple' : 'single';
      questions.push({
        id: generateId(),
        bankId,
        type,
        content: questionContent,
        options,
        answer,
        explanation,
        difficulty: 1,
        category: '未分类'
      });
    }
  }
  
  return questions;
};

export const parseJsonFile = (content: string, bankId: string): Question[] => {
  try {
    const data = JSON.parse(content);
    if (!Array.isArray(data)) return [];
    
    return data.map((item: unknown) => {
      const q = item as Partial<Question>;
      return {
        id: q.id || generateId(),
        bankId,
        type: (q.type as QuestionType) || 'single',
        content: q.content || '',
        options: q.options || [],
        answer: Array.isArray(q.answer) ? q.answer.map(String) : [],
        explanation: q.explanation || '',
        difficulty: typeof q.difficulty === 'number' ? q.difficulty : 1,
        category: q.category || '未分类'
      };
    }).filter((q: Question) => q.content && q.answer.length > 0);
  } catch {
    return [];
  }
};

export const parseMarkdownFile = (content: string, bankId: string): Question[] => {
  const questions: Question[] = [];
  const blocks = content.split(/^##\s+/m).filter(b => b.trim());
  
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 3) continue;
    
    let questionContent = '';
    const options: string[] = [];
    let answer: string[] = [];
    let explanation = '';
    let inQuestion = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const option = trimmed.replace(/^[-*]\s*/, '');
        if (option.match(/^[A-Da-d][.．、]/)) {
          options.push(option);
        }
      } else if (trimmed.startsWith('**答案')) {
        const answerMatch = trimmed.match(/[A-Da-d,，、]+/);
        if (answerMatch) {
          answer = answerMatch[0].split(/[,，、]/).map(a => a.trim().toUpperCase()).filter(Boolean);
        }
      } else if (trimmed.startsWith('**解析')) {
        explanation = trimmed.replace(/^\*\*解析[:：]\*\*\s*/, '');
      } else if (trimmed && !inQuestion) {
        questionContent = trimmed;
        inQuestion = true;
      } else if (trimmed && inQuestion && options.length === 0) {
        questionContent += ' ' + trimmed;
      }
    }
    
    if (questionContent && options.length > 0 && answer.length > 0) {
      const type: QuestionType = answer.length > 1 ? 'multiple' : 'single';
      questions.push({
        id: generateId(),
        bankId,
        type,
        content: questionContent,
        options,
        answer,
        explanation,
        difficulty: 1,
        category: '未分类'
      });
    }
  }
  
  return questions;
};

export const parsePdfFile = async (file: File, bankId: string): Promise<Question[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const parser = new pdf.PDFParse({ data: uint8Array });
    const textResult = await parser.getText();
    const text = textResult.text;
    
    await parser.destroy();
    
    const questions: Question[] = [];
    const blocks = text.split(/\n\n+/).filter((b: string) => b.trim());
    
    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 2) continue;
      
      let currentLine = 0;
      let questionContent = '';
      const options: string[] = [];
      let answer: string[] = [];
      let explanation = '';
      
      while (currentLine < lines.length) {
        const line = lines[currentLine].trim();
        
        if (line.match(/^\d+\./)) {
          questionContent = line.replace(/^\d+\.\s*/, '');
        } else if (line.match(/^[A-Da-d]\./)) {
          options.push(line);
        } else if (line.startsWith('答案') || line.startsWith('参考答案')) {
          const answerMatch = line.match(/[A-Da-d,，、]+/);
          if (answerMatch) {
            answer = answerMatch[0].split(/[,，、]/).map((a: string) => a.trim().toUpperCase()).filter(Boolean);
          }
        } else if (line.startsWith('解析') || line.startsWith('说明')) {
          explanation = line.replace(/^(解析|说明)[:：]\s*/, '');
        } else if (questionContent && !line.startsWith('答案') && !line.startsWith('解析')) {
          questionContent += ' ' + line;
        }
        
        currentLine++;
      }
      
      if (questionContent && options.length > 0 && answer.length > 0) {
        const type: QuestionType = answer.length > 1 ? 'multiple' : 'single';
        questions.push({
          id: generateId(),
          bankId,
          type,
          content: questionContent,
          options,
          answer,
          explanation,
          difficulty: 1,
          category: '未分类'
        });
      }
    }
    
    return questions;
  } catch (error) {
    console.error('PDF解析错误:', error);
    return [];
  }
};

export const detectFileType = (fileName: string): 'txt' | 'json' | 'md' | 'pdf' | 'unknown' => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'txt') return 'txt';
  if (ext === 'json') return 'json';
  if (ext === 'md' || ext === 'markdown') return 'md';
  if (ext === 'pdf') return 'pdf';
  return 'unknown';
};

export const parseFile = (content: string, fileName: string, bankId: string): Question[] => {
  const type = detectFileType(fileName);
  
  switch (type) {
    case 'txt':
      return parseTxtFile(content, bankId);
    case 'json':
      return parseJsonFile(content, bankId);
    case 'md':
      return parseMarkdownFile(content, bankId);
    default:
      return [];
  }
};