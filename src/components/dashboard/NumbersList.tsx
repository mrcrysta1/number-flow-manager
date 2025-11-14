import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface NumberRecord {
  id: string;
  number: string;
  status: string;
  used_at: string | null;
}

interface NumbersListProps {
  title: string;
  description: string;
  numbers: NumberRecord[];
  loading: boolean;
  onCopy?: (id: string, number: string) => void;
  canCopy: boolean;
}

const NumbersList = ({
  title,
  description,
  numbers,
  loading,
  onCopy,
  canCopy,
}: NumbersListProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            {numbers.length} numbers
          </span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : numbers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No numbers available
            </div>
          ) : (
            <div className="space-y-2">
              {numbers.map((record) => (
                <div
                  key={record.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    canCopy
                      ? "hover:bg-accent hover:shadow-sm cursor-pointer"
                      : "bg-muted/50"
                  }`}
                  onClick={
                    canCopy
                      ? () => onCopy?.(record.id, record.number)
                      : undefined
                  }
                >
                  <span className="font-mono text-sm font-medium">
                    {record.number}
                  </span>
                  {canCopy ? (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NumbersList;