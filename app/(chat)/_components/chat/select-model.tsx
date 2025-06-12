"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import PROVIDERS from "@/constants/models";

const modelGroups = {
  Anthropic: ["claude-3-5-sonnet", "claude-3-7-sonnet", "claude-4-sonnet"],
  Google: ["gemini-2.0-flash", "gemini-2.5-flash"],
  OpenAI: ["gpt-4o", "gpt-4o-mini"],
  DeepSeek: ["deepseek-r1"],
};

interface SelectModelProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const SelectModel = ({ selectedModel, onModelChange }: SelectModelProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer text-sm">
        {selectedModel} <ChevronDown className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(modelGroups).map(([group, models]) => (
          <div key={group}>
            <DropdownMenuLabel>{group}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {models.map((model) => (
              <DropdownMenuItem
                key={model}
                onClick={() => onModelChange(model)}
                className={selectedModel === model ? "bg-accent" : ""}
              >
                {model}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectModel;
