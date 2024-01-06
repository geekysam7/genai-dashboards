import { FALLBACK } from "@/constants/general";

type TFallback = typeof FALLBACK;

type ITEM<T> = Record<string, keyof T>;

type VALUE_PARSER = (value: any, headers: any) => any;

interface Dictionary<T> {
  [Key: string]: T;
}

export type { TFallback, ITEM, VALUE_PARSER, Dictionary };
