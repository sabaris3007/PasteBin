import React from 'react';

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'import', 'export', 'default', 'from',
  'class', 'extends', 'super', 'new', 'this', 'async', 'await', 'try', 'catch', 'finally',
  'throw', 'typeof', 'instanceof', 'void', 'public', 'private', 'protected', 'static',
  'final', 'abstract', 'interface', 'implements', 'enum', 'struct', 'typedef',
  'using', 'template', 'def', 'self', 'elif', 'with', 'as', 'pass', 'raise', 'except',
  'lambda', 'global', 'nonlocal', 'None', 'True', 'False', 'and', 'or', 'not', 'in', 'is',
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'CREATE', 'TABLE',
  'DROP', 'ALTER', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'GROUP', 'BY', 'ORDER',
  'HAVING', 'LIMIT', 'NULL', 'PRIMARY', 'KEY',
  'select', 'from', 'where', 'insert', 'into', 'update', 'delete', 'create', 'table', 'join',
]);

const STYLE_KW = { color: '#2563EB', fontWeight: 700 };
const STYLE_STR = { color: '#059669', fontWeight: 500 };
const STYLE_NUM = { color: '#7C3AED', fontWeight: 600 };
const STYLE_CMT = { color: '#9CA3AF', fontStyle: 'italic' as const };
const STYLE_TAG = { color: '#0284C7', fontWeight: 600 };

function isNumeric(s: string) {
  return s.length > 0 && !isNaN(Number(s));
}

function tokenize(line: string): { text: string; type: string }[] {
  const tokens: { text: string; type: string }[] = [];
  let i = 0;

  while (i < line.length) {
    // Single-line comment // or #
    if (
      (line[i] === '/' && line[i + 1] === '/') ||
      line[i] === '#'
    ) {
      tokens.push({ text: line.slice(i), type: 'comment' });
      break;
    }

    // Quoted string: " or '
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === '\\' && j + 1 < line.length) j++; // skip escaped char
        j++;
      }
      if (j < line.length && line[j] === quote) j++; // include closing quote if present
      tokens.push({ text: line.slice(i, j), type: 'string' });
      i = j;
      continue;
    }

    // Word token (identifier / keyword / number)
    if (/[a-zA-Z0-9_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (isNumeric(word)) {
        tokens.push({ text: word, type: 'number' });
      } else if (KEYWORDS.has(word)) {
        tokens.push({ text: word, type: 'keyword' });
      } else {
        tokens.push({ text: word, type: 'ident' });
      }
      i = j;
      continue;
    }

    // HTML / XML tag characters < >
    if (line[i] === '<' || line[i] === '>') {
      tokens.push({ text: line[i], type: 'tag' });
      i++;
      continue;
    }

    // Everything else: punctuation, spaces, symbols
    tokens.push({ text: line[i], type: 'plain' });
    i++;
  }

  return tokens;
}

export function highlightCodeLine(line: string, lang: string): React.ReactNode {
  if (lang === 'plaintext' || !line) {
    return line || '\u200B'; // zero-width space to preserve empty line height
  }

  const tokens = tokenize(line);

  return (
    <>
      {tokens.map((tok, idx) => {
        if (tok.type === 'comment') return <span key={idx} style={STYLE_CMT}>{tok.text}</span>;
        if (tok.type === 'string') return <span key={idx} style={STYLE_STR}>{tok.text}</span>;
        if (tok.type === 'number') return <span key={idx} style={STYLE_NUM}>{tok.text}</span>;
        if (tok.type === 'keyword') return <span key={idx} style={STYLE_KW}>{tok.text}</span>;
        if (tok.type === 'tag' && lang === 'html') return <span key={idx} style={STYLE_TAG}>{tok.text}</span>;
        return <React.Fragment key={idx}>{tok.text}</React.Fragment>;
      })}
    </>
  );
}
