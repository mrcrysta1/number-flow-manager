import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText } from "lucide-react";

interface NumbersUploadProps {
  userId: string;
}

const NumbersUpload = ({ userId }: NumbersUploadProps) => {
  const [textInput, setTextInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleTextUpload = async () => {
    if (!textInput.trim()) {
      toast.error("Please enter some numbers");
      return;
    }

    setUploading(true);
    try {
      const numbers = textInput
        .split("\n")
        .map((n) => n.trim())
        .filter((n) => n);

      // Check for duplicates
      const { data: existingNumbers } = await supabase
        .from("numbers")
        .select("number, uploaded_by, profiles(username)")
        .in("number", numbers);

      const duplicates = existingNumbers || [];
      const duplicateNumbers = new Set(duplicates.map((d) => d.number));

      // Show alerts for duplicates
      duplicates.forEach((dup) => {
        const username = (dup.profiles as any)?.username || "Unknown User";
        toast.error(`Number "${dup.number}" already exists and belongs to: ${username}`);
      });

      // Filter out duplicates
      const uniqueNumbers = numbers.filter((num) => !duplicateNumbers.has(num));

      if (uniqueNumbers.length === 0) {
        toast.error("All numbers already exist in the system");
        setUploading(false);
        return;
      }

      const numberRecords = uniqueNumbers.map((number) => ({
        number,
        status: "available",
        uploaded_by: userId,
      }));

      const { error } = await supabase.from("numbers").insert(numberRecords);

      if (error) throw error;

      toast.success(`Successfully uploaded ${uniqueNumbers.length} new numbers`);
      if (duplicates.length > 0) {
        toast.info(`Skipped ${duplicates.length} duplicate numbers`);
      }
      setTextInput("");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload numbers");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const numbers = text
        .split("\n")
        .map((n) => n.trim())
        .filter((n) => n);

      // Check for duplicates
      const { data: existingNumbers } = await supabase
        .from("numbers")
        .select("number, uploaded_by, profiles(username)")
        .in("number", numbers);

      const duplicates = existingNumbers || [];
      const duplicateNumbers = new Set(duplicates.map((d) => d.number));

      // Show alerts for duplicates
      duplicates.forEach((dup) => {
        const username = (dup.profiles as any)?.username || "Unknown User";
        toast.error(`Number "${dup.number}" already exists and belongs to: ${username}`);
      });

      // Filter out duplicates
      const uniqueNumbers = numbers.filter((num) => !duplicateNumbers.has(num));

      if (uniqueNumbers.length === 0) {
        toast.error("All numbers already exist in the system");
        e.target.value = "";
        setUploading(false);
        return;
      }

      const numberRecords = uniqueNumbers.map((number) => ({
        number,
        status: "available",
        uploaded_by: userId,
      }));

      const { error } = await supabase.from("numbers").insert(numberRecords);

      if (error) throw error;

      toast.success(`Successfully uploaded ${uniqueNumbers.length} new numbers from file`);
      if (duplicates.length > 0) {
        toast.info(`Skipped ${duplicates.length} duplicate numbers`);
      }
      e.target.value = "";
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Numbers
        </CardTitle>
        <CardDescription>
          Add numbers via text input or upload a .txt file (one number per line)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter numbers (one per line)&#10;03001234567&#10;03001234568&#10;03001234569"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={6}
            className="font-mono"
          />
          <Button
            onClick={handleTextUpload}
            disabled={uploading}
            className="w-full"
          >
            Upload Numbers
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div>
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              className="w-full"
              disabled={uploading}
              asChild
            >
              <span>
                <FileText className="h-4 w-4 mr-2" />
                Upload .txt File
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NumbersUpload;