

import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FilterFileUpload({ 
  label,
  buttons = ['browse', 'register', 'execute'] 
}: { 
  label: string,
  buttons?: ('browse' | 'register' | 'execute')[]
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0 && textInputRef.current) {
      textInputRef.current.value = event.target.files[0].name;
    } else if (textInputRef.current) {
      textInputRef.current.value = "선택된 파일 없음";
    }
  };

  const labelId = `label-${label.replace(/\s+/g, '-')}`;

  return (
    <div className="flex h-9 items-center gap-2">
      <Label
        htmlFor={labelId}
        className="block w-[100px] flex-shrink-0 text-right text-sm font-medium"
      >
        {label}
      </Label>
      <div className="flex flex-grow items-center gap-2">
        <Input 
          id={labelId} 
          ref={textInputRef} 
          type="text" 
          className="h-9 flex-grow bg-muted" 
          readOnly 
          placeholder="선택된 파일 없음" 
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />
        {buttons.includes('browse') && <Button variant="outline" className="h-9" onClick={handleBrowseClick}>찾아보기</Button>}
        {buttons.includes('register') && <Button variant="outline" className="h-9">등록</Button>}
        {buttons.includes('execute') && <Button variant="outline" className="h-9">실행</Button>}
      </div>
    </div>
  );
}
