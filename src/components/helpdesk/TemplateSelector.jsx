import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TemplateSelector({ onSelectTemplate, category }) {
  const { data: templates = [] } = useQuery({
    queryKey: ['templates', category],
    queryFn: () => base44.entities.TicketTemplate.filter({ 
      isActive: true,
      ...(category && { category })
    })
  });

  const [selectedTemplate, setSelectedTemplate] = React.useState("");

  const handleApply = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      onSelectTemplate(template.message);
    }
  };

  if (templates.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-2">
      <FileText className="w-4 h-4 text-gray-400" />
      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Use a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        size="sm" 
        onClick={handleApply}
        disabled={!selectedTemplate}
        variant="outline"
      >
        Apply
      </Button>
    </div>
  );
}