
"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { 
  Paperclip, 
  Send, 
  BrainCog,
  User,
  Ratio,
  Settings2,
  ChevronDown,
  Check
} from "lucide-react";
import { Textarea } from "./textarea";
import { cn } from "../../lib/utils";
import { useAutoResizeTextarea } from "../hooks/use-auto-resize-textarea";
import { mockStore } from "../../services/mockStore";
import { CharacterModel } from "../../types";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[100] w-64 rounded-[1.5rem] border border-slate-800 bg-[#1A1B20] p-2 text-slate-200 shadow-2xl outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const DropdownItem = ({ children, onClick, active, icon: Icon }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all group text-left",
      active ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
    )}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon className={cn("w-3.5 h-3.5", active ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />}
      {children}
    </div>
    {active && <Check className="w-3.5 h-3.5" />}
  </button>
);

interface AIInputWithSearchProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onSubmit?: (value: string, config: any) => void;
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function AIInputWithSearch({
  id = "ai-input-with-search",
  placeholder = "Describe your imagination...",
  minHeight = 48,
  maxHeight = 164,
  onSubmit,
  onFileSelect,
  className
}: AIInputWithSearchProps) {
  const [value, setValue] = React.useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  const [selectedChar, setSelectedChar] = React.useState<CharacterModel | null>(null);
  const [selectedRatio, setSelectedRatio] = React.useState("16:9");
  const [selectedModel, setSelectedModel] = React.useState("Nano Banana Pro");
  
  const [characters, setCharacters] = React.useState<CharacterModel[]>([]);

  React.useEffect(() => {
    setCharacters(mockStore.getCharacters().filter(c => c.status === 'ready'));
  }, []);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.(value, { character: selectedChar, ratio: selectedRatio, model: selectedModel });
      setValue("");
      adjustHeight(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-2xl w-full mx-auto">
        <div className="relative flex flex-col bg-[#1A1B20] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            <Textarea
              id={id}
              value={value}
              placeholder={placeholder}
              className="w-full px-5 py-4 bg-transparent border-none text-white placeholder:text-slate-500 resize-none focus-visible:ring-0 text-base leading-relaxed"
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-black/20 border-t border-slate-800/50">
            <div className="flex flex-wrap items-center gap-2">
              <label className="cursor-pointer rounded-xl p-2 bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white mr-1">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Paperclip className="w-4 h-4" />
              </label>

              {/* Character Selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/50 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700/40 transition-all">
                    <User className="w-3 h-3 text-indigo-400" />
                    {selectedChar ? selectedChar.name : "Character"}
                    <ChevronDown className="w-3 h-3 opacity-30" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <div className="p-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 px-3">Identity</div>
                  {characters.map(c => (
                    <DropdownItem key={c.id} active={selectedChar?.id === c.id} onClick={() => setSelectedChar(c)}>{c.name}</DropdownItem>
                  ))}
                  <div className="border-t border-slate-800 my-1 pt-1">
                     <DropdownItem onClick={() => setSelectedChar(null)} active={!selectedChar}>Universal</DropdownItem>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Ratio Selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/50 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700/40 transition-all">
                    <Ratio className="w-3 h-3 text-emerald-400" />
                    {selectedRatio}
                    <ChevronDown className="w-3 h-3 opacity-30" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48">
                  <div className="p-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 px-3">Aspect Ratio</div>
                  {["1:1", "16:9", "9:16", "4:3"].map(r => (
                    <DropdownItem key={r} active={selectedRatio === r} onClick={() => setSelectedRatio(r)}>{r}</DropdownItem>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Model Selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/50 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700/40 transition-all">
                    <Settings2 className="w-3 h-3 text-amber-400" />
                    Model
                    <ChevronDown className="w-3 h-3 opacity-30" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <div className="p-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 px-3">Engine</div>
                  {["Nano Banana Pro", "Pony Realism (SDXL)", "Seedream 4.5"].map(m => (
                    <DropdownItem key={m} active={selectedModel === m} onClick={() => setSelectedModel(m)}>{m}</DropdownItem>
                  ))}
                </PopoverContent>
              </Popover>

              <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500/20 transition-all">
                <BrainCog className="w-3.5 h-3.5" />
                Enhance
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!value.trim()}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl transition-all",
                  value.trim()
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
