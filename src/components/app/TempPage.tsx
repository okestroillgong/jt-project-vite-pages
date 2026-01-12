
import { Construction } from 'lucide-react';

export function TempPage({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Construction className="h-16 w-16" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>페이지 준비 중입니다.</p>
    </div>
  );
}
