"use client";

import { MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FindDoctor() {
  return (
    <div className="mt-10 w-full max-w-[540px] rounded-2xl bg-white p-2 shadow-ambient ring-1 ring-kinex-outline/15">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <div className="flex min-h-[52px] flex-1 items-center gap-3 rounded-xl bg-kinex-surface-low px-4 py-2">
          <Search className="h-5 w-5 shrink-0 text-kinex-muted" aria-hidden />
          <Input
            type="search"
            placeholder="Find a Doctor / Zip"
            className="h-auto border-0 bg-transparent p-0 text-[15px] shadow-none placeholder:text-kinex-muted focus-visible:ring-0"
          />
        </div>
        <div className="flex min-h-[52px] flex-1 items-center gap-3 rounded-xl bg-kinex-surface-low px-2 py-2 sm:max-w-[200px]">
          <MapPin
            className="ml-2 h-5 w-5 shrink-0 text-kinex-muted"
            aria-hidden
          />
          <Select>
            <SelectTrigger className="h-auto min-h-0 flex-1 border-0 bg-transparent px-1 text-[15px] shadow-none focus:ring-0 focus:ring-offset-0 [&>span]:text-kinex-muted data-[placeholder]:text-kinex-muted">
              <SelectValue placeholder="Your City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new-york">New York</SelectItem>
              <SelectItem value="los-angeles">Los Angeles</SelectItem>
              <SelectItem value="chicago">Chicago</SelectItem>
              <SelectItem value="houston">Houston</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          className="h-[52px] shrink-0 rounded-xl bg-kinex-primary px-8 text-[15px] font-semibold text-white hover:bg-kinex-container sm:h-auto sm:min-h-[52px]"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
