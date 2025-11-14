import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NumbersList from "./NumbersList";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NumbersDisplayProps {
  userId: string;
}

interface NumberRecord {
  id: string;
  number: string;
  status: string;
  used_at: string | null;
}

const NumbersDisplay = ({ userId }: NumbersDisplayProps) => {
  const [availableNumbers, setAvailableNumbers] = useState<NumberRecord[]>([]);
  const [usedNumbers, setUsedNumbers] = useState<NumberRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNumbers = async () => {
    try {
      const { data, error } = await supabase
        .from("numbers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAvailableNumbers(data?.filter((n) => n.status === "available") || []);
      setUsedNumbers(data?.filter((n) => n.status === "used") || []);
    } catch (error: any) {
      toast.error("Failed to fetch numbers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers();

    // Set up realtime subscription
    const channel = supabase
      .channel("numbers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "numbers",
        },
        () => {
          fetchNumbers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCopyNumber = async (numberId: string, numberValue: string) => {
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(numberValue);

      // Update status to used
      const { error } = await supabase
        .from("numbers")
        .update({
          status: "used",
          used_by: userId,
          used_at: new Date().toISOString(),
        })
        .eq("id", numberId);

      if (error) throw error;

      toast.success("Number copied and moved to Used List");
    } catch (error: any) {
      toast.error("Failed to copy number");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const { error } = await supabase.from("numbers").delete().neq("id", "");

      if (error) throw error;

      toast.success("All numbers deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete numbers");
    }
  };

  const handleManualReset = async () => {
    try {
      const { error } = await supabase
        .from("numbers")
        .update({
          status: "available",
          used_by: null,
          used_at: null,
        })
        .eq("status", "used");

      if (error) throw error;

      toast.success("All used numbers reset to available");
    } catch (error: any) {
      toast.error("Failed to reset numbers");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Manual Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Used Numbers?</AlertDialogTitle>
              <AlertDialogDescription>
                This will move all used numbers back to the available list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleManualReset}>
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete All Numbers?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                numbers from both lists.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAll}>
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <NumbersList
          title="Available Numbers"
          description="Click any number to copy and move to Used List"
          numbers={availableNumbers}
          loading={loading}
          onCopy={handleCopyNumber}
          canCopy={true}
        />
        <NumbersList
          title="Used Numbers"
          description="Numbers that have been copied (read-only)"
          numbers={usedNumbers}
          loading={loading}
          canCopy={false}
        />
      </div>
    </div>
  );
};

export default NumbersDisplay;